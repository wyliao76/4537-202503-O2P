const { CustomError } = require('./customError')
const auth = require('./auth')
const redis = require('./redis')

module.exports = {
    CustomError,
    auth,
    redis,
}

