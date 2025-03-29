const { adminService } = require('../services/index')
const Joi = require('joi')

const isAdminGET = async (req, res, next) => {
    return res.status(200).json({ msg: 'ok' })
}

const usersGET = async (req, res, next) => {
    try {
        const result = await adminService.usersGET()

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const toggleBanUserPATCH = async (req, res, next) => {
    try {
        const { email = '' } = req.query
        const { enable = '' } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
            enable: Joi.boolean().required(),
        })

        await schema.validateAsync({ email, enable }, { abortEarly: false })

        const result = await adminService.toggleBanUserPATCH(email, enable)

        return res.status(200).json({ msg: result })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const recordsGET = async (req, res, next) => {
    try {
        const result = await adminService.recordsGET()
        return res.status(200).json({ msg: result })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    isAdminGET,
    usersGET,
    recordsGET,
    toggleBanUserPATCH,
}
