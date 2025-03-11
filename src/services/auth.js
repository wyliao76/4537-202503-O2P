const usersModel = require('../models/users')


const registerPOST = async (loginId, name, email, password) => {
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
