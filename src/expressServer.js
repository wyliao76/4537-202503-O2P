const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const { authRouter, apiRouter } = require('./routers')
const cors = require('cors')
const { CustomError, auth } = require('./utilities')

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
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

app.use('/', authRouter)
app.use('/api', auth.isLogin, apiRouter)

app.get('/isLogin', auth.isLogin, (_, res) => {
    return res.status(200).send('ok')
})

app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

// app.get('/api/users', async (req, res) => {
//     const users = await usersModel.find()
//     res.json(users)
// })

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app }
