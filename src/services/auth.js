const usersModel = require('../models/users')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const jwt = require('jsonwebtoken')
const { auth, CustomError } = require('../utilities')

const registerPOST = async (email, password) => {
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

const loginPOST = async (email, password) => {
    const user = await usersModel.findOne({ email: email }, { email: 1, password: 1 }).lean()
    if (!await bcrypt.compare(password, user.password)) {
        throw new CustomError('403', 'Invalid password')
    }
    return auth.addToken(user.email)
}

const logoutGET = async (token) => {
    const email = await auth.verify(token)
    await auth.removeToken(email)
    return true
}

const resetPasswordPOST = async ({ userId, password }) => {
}

module.exports = {
    registerPOST,
    loginPOST,
    logoutGET,
    resetPasswordPOST,
}
