const { authService } = require('../services/index')
const Joi = require('joi')

const registerPOST = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
            password: Joi.string().required().messages({
                'string.empty': 'Password cannot be an empty',
            }),
        })
        await schema.validateAsync({ email, password }, { abortEarly: false })

        await authService.registerPOST(email.toLowerCase(), password)

        return res.status(200).json({ msg: 'ok' })
    } catch (err) {
        console.log(err)
        if (err.isJoi) {
            const msg = err.details.map((detail) => detail.message)

            return res.status(400).json({
                msg: msg,
            })
        }
        return res.status(409).json({
            msg: err.message,
        })
    }
}

const loginPOST = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
            password: Joi.string().required().messages({
                'string.empty': 'Password cannot be an empty',
            }),
        })
        await schema.validateAsync({ email, password }, { abortEarly: false })

        const token = await authService.loginPOST(email.toLowerCase(), password)

        res.cookie('token', token, { maxAge: 86400 * 1000, httpOnly: true, sameSite: 'None' })

        return res.status(200).json({ msg: token })
    } catch (error) {
        next(error)
    }
}

const logoutGET = async (req, res, next) => {
    try {
        const { token } = req.cookies || {}

        await authService.logoutGET(token)
        return res.status(200).json({ msg: 'ok' })
    } catch (error) {
        next(error)
    }
}

const resetPasswordPOST = async (req, res, next) => {
}


module.exports = {
    registerPOST,
    loginPOST,
    logoutGET,
    resetPasswordPOST,
}
