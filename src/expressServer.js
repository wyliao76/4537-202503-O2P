const express = require('express')
const path = require('path')
const compression = require('compression')
const { authRouter } = require('./routers')
const usersModel = require('./models/users')
const AIManager = require('./ai')
const cors = require('cors');

const app = express()
const server = require('http').createServer(app)
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'], 
}));
const aiManager = new AIManager()

const mongoUrl = process.env.NODE_ENV === 'local' ?
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}` +
    `@${process.env.MONGO_HOST}:${process.env.DATABASE_PORT}/${process.env.MONGO_DB}?authSource=admin&replicaSet=rs0&retryWrites=true&w=majority&directConnection=true` :
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority&appName=`

console.log(mongoUrl)

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

app.post('/users', async (req, res) => {
    const newUser = new User(req.body)
    await newUser.save()
    res.status(201).send('User created!')
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'))
})

app.get('/questions', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/questions.html'))
})

app.get('/', (req, res) => {
    return req.session.email ? res.redirect('/home') : res.render('landing')
})

app.get('*', (req, res) => {
    return res.status(404).render('404', { error: 'Page does not exist!', pictureID: req.session.picture })
})

app.use((err, req, res, next) => {
    console.error(err)
    return res.status(err.code || 500).json({ msg: err.msg })
})

module.exports = { server, app, mongoUrl }
