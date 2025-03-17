const { apiService } = require('../services/index')

const questionsGET = async (req, res, next) => {
    try {
        const result = await apiService.questionsGET()

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const personaPOST = async (req, res, next) => {
    try {
        const result = await apiService.personaPOST(req.body)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    questionsGET,
    personaPOST,
}
