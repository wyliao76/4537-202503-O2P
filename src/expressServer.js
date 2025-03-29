const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const path = require('node:path')
const fs = require('node:fs')
const swaggerUI = require('swagger-ui-express')
const jsYaml = require('js-yaml')
const { authRouter, apiRouter, adminRouter, userRouter } = require('./routers')
const cors = require('cors')
const { CustomError, auth, apiLogger } = require('./utilities')

const openApiFilename = process.env.NODE_ENV === 'dev' ? 'openapi_dev.yml' : 'openapi.yml'
const openApiPath = path.join(__dirname, openApiFilename)
const schema = jsYaml.load(fs.readFileSync(openApiPath))

const app = express()
const server = require('http').createServer(app)
app.use(cookieParser())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const whitelist = [process.env.FRONTEND_ORIGIN, 'null', 'http://localhost:3000']
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

// eslint-disable-next-line new-cap
const router = express.Router()

router.use('/api-doc', swaggerUI.serve, swaggerUI.setup(schema))

router.use('/', authRouter)
router.use(['/api', '/admin', '/user'], auth.isLogin)
router.use('/admin', auth.isAdmin)

router.use(['/api', '/admin', '/user'], apiLogger)

router.use('/api', apiRouter)
router.use('/admin', adminRouter)
router.use('/user', userRouter)

router.get('/health', (_, res) => {
    return res.status(200).send('ok')
})

router.get('*', (req, res) => {
    return res.status(404).json({ error: 'Page does not exist!' })
})

router.use(unless(['/health', '/login'], auth.isLogin))

router.use((error, req, res, next) => {
    error.code ? console.error(error.message) : console.error(error)
    return res.status(error.code || 500).json({ msg: error.message })
})

app.use('/v1', router)
app.use('/', router)

// tool function
function unless(paths, middleware) {
    return (req, res, next) => {
        if (paths.includes(req.path)) {
            return next()
        }
        return middleware(req, res, next)
    }
}

module.exports = { server, app }
