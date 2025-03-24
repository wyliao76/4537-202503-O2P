
const { AIManager } = require('../utilities')
const quizModel = require('../models/quizes')
const tokensModel = require('../models/tokens')
const { CustomError } = require('../utilities')

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

const personaPOST = async (body) => {
    const quizType = body.quizType
    const answers = JSON.stringify(body.answers)

    const response = await aiManager.generate(quizType, answers)

    console.log(response)

    return response
}

module.exports = {
    questionsGET,
    personaPOST,
    quizzesGET,
    decrementApiTokens,
    tokensGET,
}
