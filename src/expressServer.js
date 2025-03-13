const express = require('express')
const compression = require('compression')
const { authRouter } = require('./routers')
const usersModel = require('./models/users')
const AIManager = require('./ai')
const cors = require('cors')
const { CustomError } = require('./utilities')

const app = express()
const server = require('http').createServer(app)
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const whitelist = [process.env.FRONTEND_ORIGIN, 'null']
app.use(cors({
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new CustomError('400', 'Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}))

const aiManager = new AIManager()

app.use('/', authRouter)
app.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

app.get('/api/users', async (req, res) => {
    const users = await usersModel.find()
    res.json(users)
})

app.post('/api/questions', async (req, res) => {
    const response = await aiManager.generateQuestionBatch()
    res.json(response)
})

app.post('/api/persona', async (req, res) => {
    const answerObjs = req.body
    const response = await aiManager.generatePersona(JSON.stringify(answerObjs))
    res.json(response)
})

app.post('/api/image', async (req, res) => {
    const answerObjs = req.body
    const response = await aiManager.generateImage(JSON.stringify(answerObjs))
    console.log('response being sent: ' + response)
    res.json(response)
})

app.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app }
