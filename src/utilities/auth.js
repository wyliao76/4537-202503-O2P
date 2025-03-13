const Redis = require('ioredis')
const jwt = require('jsonwebtoken')
const { CustomError } = require('./customError')

const addToken = async (email, token) => {
    const expirationInSec = Number(process.env.TOKEN_EXPIRATION_IN_SEC || '86400')
    await auth.redis.setex(email, expirationInSec, token)
}

const removeToken = (email) => {
    return auth.redis.del(email)
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

const connect = () => {
    auth.redis = new Redis(process.env.REDIS_HOST)
    console.log('Redis connected.')
}

const close = async () => {
    await auth.redis.quit()
    console.log('Redis closed.')
}

const auth = {
    redis: null,
    connect,
    close,
    addToken,
    removeToken,
    verify,
}

module.exports = auth
