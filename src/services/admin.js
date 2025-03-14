const { redis, CustomError } = require('../utilities')
const usersModel = require('../models/users')


const usersGET = () => {
    return usersModel.find({}, { email: 1, role: 1, api_tokens: 1 }).lean()
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
const adjustTokenPOST = (email) => {
    return usersModel.find({}, { email: 1, role: 1, api_tokens: 1 }).lean()
}


module.exports = {
    usersGET,
    banUserPOST,
    adjustTokenPOST,
}
