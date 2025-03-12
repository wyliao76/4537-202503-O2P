const usersModel = require('../models/users')
const bcrypt = require('bcrypt')


const registerPOST = async (email, password) => {
    const SALT_ROUNDS = 10
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS)

    await usersModel.countDocuments({ email: email }).then((count) => {
        if (count) {
            throw new Error('Account already registered with this email')
        }
    })

    const user = {
        email: email,
        password: hashedPass,
    }

    await usersModel.create(user)
}

const loginPOST = async (loginId, password) => {
}

const logoutGET = (req) => {
}

const resetPasswordPOST = async ({ userId, password }) => {
}

module.exports = {
    registerPOST,
    loginPOST,
    logoutGET,
    resetPasswordPOST,
}
