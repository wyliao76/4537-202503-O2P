
const { AIManager } = require('../utilities')
const quizModel = require('../models/quizzes')
const tokensModel = require('../models/tokens')
const personasModel = require('../models/personas')
const { CustomError } = require('../utilities')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const aiManager = new AIManager()

const quizzesGET = async () => {
    const quizzes = await quizModel.find({}).lean()
    if (!quizzes) {
        throw new CustomError('404', 'No quizzes')
    }

    return quizzes
}

const tokensGET = async (email) => {
    const user = await tokensModel.findOne({ email: email }).lean()
    if (!user) {
        throw new CustomError('404', 'User not found')
    }

    return user.tokens
}

const decrementApiTokens = async (email) => {
    const user = await tokensModel.findOne({ email: email }).lean()
    if (!user) {
        throw new CustomError('404', 'User not found')
    }

    if (user.tokens > 0) {
        await tokensModel.updateOne({ email: email }, { $inc: { tokens: -1 } })
    }
}

const questionsGET = () => {
    return aiManager.generateQuestionBatch()
}

const personaPOST = async (params) => {
    // get resonse from AI
    const response = await aiManager.generate(params.quizType, params.answers)
    if (!response) {
        throw new CustomError('500', 'Cannot generate persona')
    }

    // decrement API tokens
    await decrementApiTokens(params.email)

    // download image
    const uniqueFileName = `${response.persona.Name}-${uuidv4()}.png`
    await downloadImage(response.imageUrl, uniqueFileName)

    // add users new persona to database
    const personaRecord = {
        email: params.email,
        persona: response,
        pathToImage: uniqueFileName,
    }
    const newPersona = await personasModel.create(personaRecord)
    if (!newPersona) {
        throw new CustomError('500', 'Cannot save persona')
    }

    console.log(response)

    return response
}

const personaDELETE = async (params) => {
    if (!params.imageName) {
        throw new CustomError('image name not found')
    }

    const result = await personasModel.deleteOne({ email: params.email, pathToImage: params.imageName })
    if (result.deletedCount === 0) {
        throw new CustomError('could not delete persona')
    }

    // delete image from disk
    await deleteImage(params.imageName)

    return result
}

const downloadImage = async (imageUrl, fileName) => {
    const dirPath = path.resolve(__dirname, '../../images')

    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, fileName)
    const response = await axios.get(imageUrl, { responseType: 'stream' })
    const writer = fs.createWriteStream(filePath)

    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            console.log(`Image saved as ${filePath}`)
            resolve(filePath)
        })
        writer.on('error', reject)
    })
}

const deleteImage = async (fileName) => {
    const filePath = path.resolve(__dirname, '../../images', fileName)

    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(new Error(`failed to delete: ${err.message}`))
            } else {
                resolve(`Image deleted: ${filePath}`)
            }
        })
    })
}

const savedPersonaGET = async (email) => {
    const personas = await personasModel.find({ email: email }).lean()

    if (!personas) {
        throw new CustomError('500', 'Could not get personas')
    }

    return personas
}

const personaImageGET = async (req, res) => {
    const fileName = req.query.fileName

    if (!fileName) {
        throw new CustomError('400', 'Must provide filename')
    }

    const imagePath = path.resolve(__dirname, '../../images', fileName)

    if (!fs.existsSync(imagePath)) {
        throw new CustomError('500', 'Image not found')
    }

    return res.sendFile(imagePath)
}

module.exports = {
    questionsGET,
    personaPOST,
    quizzesGET,
    decrementApiTokens,
    tokensGET,
    savedPersonaGET,
    personaImageGET,
    personaDELETE,
}
