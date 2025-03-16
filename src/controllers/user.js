const { userService } = require('../services/index')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const userGET = async (req, res, next) => {
    try {
        const { token } = req.cookies || {}
        const { email } = await jwt.decode(token) || {}

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
        })
        await schema.validateAsync({ email }, { abortEarly: false })

        const result = await userService.userGET(email)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    userGET,
}
