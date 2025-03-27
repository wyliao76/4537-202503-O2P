const jwt = require('jsonwebtoken')
const Record = require('../models/records')

const apiLogger = (req, res, next) => {
    res.on('finish', async () => {
        console.log('start')
        if (![400, 401, 403, 404].includes(res.statusCode)) {
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
                console.log('API record logged')
            } catch (error) {
                console.log(error)
                console.log('Error writing api call record')
            }
        }
    })
    next()
}

module.exports = {
    apiLogger,
}
