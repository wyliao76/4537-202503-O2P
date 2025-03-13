const jwt = require('jsonwebtoken')
const { CustomError } = require('./customError')
const redis = require('./redis')

const addToken = async (email) => {
    console.log(email)
    const token = await jwt.sign({ email: email }, process.env.SECRET, { expiresIn: Number(process.env.TOKEN_EXPIRATION_IN_SEC) })
    console.log(token)

    const expirationInSec = Number(process.env.TOKEN_EXPIRATION_IN_SEC || '86400')
    await redis.client.setex(email, expirationInSec, token)
    return token
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
