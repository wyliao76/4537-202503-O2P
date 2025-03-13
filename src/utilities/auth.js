const jwt = require('jsonwebtoken')
const { CustomError } = require('./customError')
const redis = require('./redis')

const addToken = async (email, token) => {
    const expirationInSec = Number(process.env.TOKEN_EXPIRATION_IN_SEC || '86400')
    await redis.client.setex(email, expirationInSec, token)
}

const removeToken = (email) => {
    return redis.client.del(email)
}

const verify = async (token) => {
    try {
        const result = await jwt.verify(token, process.env.SECRET)
        console.log(result)
        return result.email
    } catch (error) {
        throw new CustomError('401', error.message)
    }
}

module.exports = {
    addToken,
    removeToken,
    verify,
}
