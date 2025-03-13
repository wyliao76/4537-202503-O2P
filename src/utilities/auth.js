const jwt = require('jsonwebtoken')
const { CustomError } = require('./customError')
const redis = require('./redis')

const addToken = async (email) => {
    const token = await jwt.sign({ email: email }, process.env.SECRET, { expiresIn: Number(process.env.TOKEN_EXPIRATION_IN_SEC) })

    const expirationInSec = Number(process.env.TOKEN_EXPIRATION_IN_SEC || '86400')
    await redis.client.setex(email, expirationInSec, token)
    return token
}

const revokeToken = async (token) => {
    const { email } = await jwt.decode(token) || {}

    if (!email) {
        throw new CustomError('400', 'Bad request')
    }

    return redis.client.del(email)
}

const verify = async (token) => {
    try {
        const result = await jwt.verify(token, process.env.SECRET)
        if (await redis.client.get(result.email) === null) {
            throw new Error('not login')
        }
        return result.email
    } catch (error) {
        throw new CustomError('401', error.message)
    }
}

const isLogin = async (req, _, next) => {
    try {
        const { token } = req.cookies || {}
        await verify(token)
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addToken,
    revokeToken,
    verify,
    isLogin,
}
