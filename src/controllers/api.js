const { apiService } = require('../services/index')

const questionsPOST = async (req, res, next) => {
    try {
        const result = await apiService.questionsPOST()

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const personaPOST = async (req, res, next) => {
    try {
        const { answerObjs } = req.body

        const result = await apiService.personaPOST(answerObjs)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const imagePOST = async (req, res, next) => {
    try {
        const { answerObjs } = req.body

        const result = await apiService.imagePOST(answerObjs)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    questionsPOST,
    personaPOST,
    imagePOST,
}
