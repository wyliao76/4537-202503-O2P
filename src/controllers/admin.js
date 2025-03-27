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

const banUserPOST = async (req, res, next) => {
    try {
        const { email = '' } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
        })
        await schema.validateAsync({ email }, { abortEarly: false })

        const result = await adminService.banUserPOST(email)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const unBanUserPOST = async (req, res, next) => {
    try {
        const { email = '' } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
        })
        await schema.validateAsync({ email }, { abortEarly: false })

        const result = await adminService.unBanUserPOST(email)

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

const adjustTokenPOST = async (req, res, next) => {
    try {
        const { email = '', times } = req.body

        const schema = Joi.object({
            email: Joi.string().max(24).required().email().messages({
                'string.email': 'Not a valid email',
                'string.max': 'Emails have a maximum length of 24 characters',
                'string.empty': 'Email cannot be empty',
            }),
            times: Joi.number().required().messages({
                'number.base': 'Times must be a number',
                'number.empty': 'Times cannot be empty',
                'any.required': 'Times is required',
            }),
        })
        await schema.validateAsync({ email, times }, { abortEarly: false })

        const result = await adminService.adjustTokenPOST(email, times)

        return res.status(200).json({ msg: result })
    } catch (error) {
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
    banUserPOST,
    unBanUserPOST,
    adjustTokenPOST,
    recordsGET,
}
