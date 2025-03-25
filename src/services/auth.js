const usersModel = require('../models/users')
const tokensModel = require('../models/tokens')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const mongoose = require('mongoose')
const { auth, CustomError, redis } = require('../utilities')

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

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await Promise.all([
            usersModel.create(user),
            tokensModel.create({ email: email }),
        ])

        await session.commitTransaction()
    } catch (error) {
        await session.abortTransaction()
    } finally {
        session.endSession()
    }
}

const loginPOST = async (email, password) => {
    const user = await usersModel.findOne({ email: email }, { email: 1, password: 1 }).lean()
    if (!user) {
        throw new CustomError('404', 'User not found')
    }
    if (!await bcrypt.compare(password, user.password)) {
        throw new CustomError('403', 'Invalid password')
    }
    // revoke token if exists
    const token = await redis.client.get(user.email)
    if (token) {
        console.log(`token exists: ${token}`)
        await auth.revokeToken(token)
    }
    return auth.addToken(user.email)
}

const logoutGET = async (token) => {
    await auth.revokeToken(token)
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
