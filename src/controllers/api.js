const { apiService } = require('../services/index')
const jwt = require('jsonwebtoken')

const questionsGET = async (req, res, next) => {
    try {
        const result = await apiService.questionsGET()

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const quizzesGET = async (req, res, next) => {
    try {
        const result = await apiService.quizzesGET()

        return res.status(200).json( { msg: result } )
    } catch (error) {
        next(error)
    }
}

const tokensGET = async (req, res, next) => {
    try {
        const { token } = req.cookies || {}
        const { email } = await jwt.decode(token) || {}

        const result = await apiService.tokensGET(email)
        console.log(result);

        return res.status(200).json( { msg: result } )
    } catch (error) {
        next(error)
    }
}

const personaPOST = async (req, res, next) => {
    try {
        const result = await apiService.personaPOST(req.body)

        const { token } = req.cookies || {}
        const { email } = await jwt.decode(token) || {}

        try {
            await apiService.decrementApiTokens(email);
        } catch (err) {
            console.error("Failed to decrement API tokens:", err);
        }

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    questionsGET,
    personaPOST,
    quizzesGET,
    tokensGET
}
