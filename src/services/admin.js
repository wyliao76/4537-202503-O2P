const { redis, CustomError } = require('../utilities')
const usersModel = require('../models/users')
const tokenModel = require('../models/tokens')


const usersGET = () => {
    return usersModel.find({}, {
        email: 1,
        role: 1,
        api_tokens: 1,
        lastLogin: 1,
        enable: 1,
    }).lean()
}

const banUserPOST = async (email) => {
    const result = await usersModel.findOneAndUpdate(
        { email: email },
        { enable: false },
        { new: true, projection: { email: 1, enable: 1 } },
    )

    if (!result || result.enable === true) {
        throw new CustomError('500', 'Failed to disable user')
    }

    // don't care if not exists
    await redis.client.del(result.email)

    return result
}

const unBanUserPOST = async (email) => {
    const result = await usersModel.findOneAndUpdate(
        { email: email },
        { enable: true },
        { new: true, projection: { email: 1, enable: 1 } },
    )

    if (!result || result.enable === false) {
        throw new CustomError('500', 'Failed to enable user')
    }

    return result
}

const toggleBanUserPATCH = async (email, enable) => {
    const result = await usersModel.findOneAndUpdate(
        { email: email },
        { enable: enable },
        { new: true, projection: { email: 1, enable: 1 } },
    )

    if (!result || result.enable !== enable) {
        throw new CustomError('500', 'Failed to toggle enable user')
    }

    return result
}

const adjustTokenPOST = async (email, times) => {
    const result = await tokenModel.findOneAndUpdate(
        { email: email },
        { tokens: times },
        { new: true, projection: { email: 1, tokens: 1 } },
    )

    if (!result || result.tokens !== times) {
        throw new CustomError('500', 'Failed to adjust api tokens')
    }

    return result
}


module.exports = {
    usersGET,
    banUserPOST,
    unBanUserPOST,
    adjustTokenPOST,
    toggleBanUserPATCH,
}
