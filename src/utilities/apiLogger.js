const jwt = require('jsonwebtoken')
const Record = require('../models/records')

const apiLogger = async (req, _, next) => {
    try {
        const { token } = req.cookies

        const result = await jwt.verify(token, process.env.SECRET)
        const email = result.email
        const method = req.method
        const path = req.path

        const record = new Record({
            method: method,
            route: path,
            email: email,
        })
        await record.save()

        next()
    } catch (error) {
        console.log(error)
        console.log('Error writing api call record')
        next()
    }
}

module.exports = {
    apiLogger,
}
