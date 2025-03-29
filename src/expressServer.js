const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const { authRouter, apiRouter, adminRouter, userRouter } = require('./routers')
const cors = require('cors')
const { CustomError, auth, apiLogger } = require('./utilities')

const app = express()
const server = require('http').createServer(app)
app.use(cookieParser())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const whitelist = [process.env.FRONTEND_ORIGIN, 'null']
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new CustomError('400', 'Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use('/', authRouter)
app.use(['/api', '/admin', '/user'], auth.isLogin)
app.use('/admin', auth.isAdmin)

app.use(['/api', '/admin', '/user'], apiLogger)

app.use('/api', apiRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((error, req, res, next) => {
    // error.code ? console.error(error.message) : console.error(error)
    return res.status(error.code || 500).json({ msg: error.message })
})

module.exports = { server, app }
