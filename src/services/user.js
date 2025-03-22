const { CustomError } = require('../utilities')
const usersModel = require('../models/users')


const userGET = async (email) => {
    const user = await usersModel.findOne({ email: email }, {
        email: 1,
        role: 1,
        lastLogin: 1,
        enable: 1,
    }).lean()

    if (!user) {
        throw new CustomError('404', 'user not found')
    }
    return user
}

module.exports = {
    userGET,
}
