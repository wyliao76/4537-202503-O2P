const { auth, redis, CustomError } = require('../../src/utilities/index')
const jwt = require('jsonwebtoken')

const users = [
    { email: 'admin@gmail.com', password: 'admin' },
]

describe('auth', () => {
    describe('addToken', () => {
        it('pass', async () => {
            const token = await auth.addToken(users[0].email)
            const result = await jwt.verify(token, process.env.SECRET)
            expect(result.exp - result.iat).toBe(Number(process.env.TOKEN_EXPIRATION_IN_SEC))
            expect(token).toBe(await redis.client.get(result.email))
        })
    })

    describe('revokeToken', () => {
        it('pass', async () => {
            const token = await auth.addToken(users[0].email)
            const result = await auth.revokeToken(token)
            expect(result).toBe(1)
            expect(await redis.client.get(result.email)).toBeNull()
        })

        it('fail', async () => {
            await expect(auth.revokeToken('')).rejects.toThrow(new CustomError('400', 'Bad request'))
        })
    })

    describe('verify', () => {
        it('pass', async () => {
            const token = await auth.addToken(users[0].email)
            const email = await auth.verify(token)
            expect(email).toBe(users[0].email)
            expect(await redis.client.get(email)).toBe(token)
        })

        it('not login', async () => {
            const token = await auth.addToken(users[0].email)
            await auth.revokeToken(token)
            await expect(auth.verify(token)).rejects.toThrow(new CustomError('401', 'not login'))
        })

        it('token expired', async () => {
            const TOKEN_EXPIRATION_IN_SEC = process.env.TOKEN_EXPIRATION_IN_SEC
            process.env.TOKEN_EXPIRATION_IN_SEC = '0'

            const token = await auth.addToken(users[0].email)
            await expect(auth.verify(token)).rejects.toThrow(new CustomError('401', 'jwt expired'))

            process.env.TOKEN_EXPIRATION_IN_SEC = TOKEN_EXPIRATION_IN_SEC
        })
    })

    describe('isLogin', () => {
        let next

        beforeEach(async () => {
            next = jest.fn()
        })

        it('pass', async () => {
            const token = await auth.addToken(users[0].email)
            const req = { cookies: { token: token } }
            await auth.isLogin(req, {}, next)

            expect(next).toHaveBeenCalledWith()
        })

        it('fail empty token', async () => {
            const req = { cookies: { token: '' } }
            await auth.isLogin(req, {}, next)

            expect(next).toHaveBeenCalledWith(new CustomError('401', 'jwt must be provided'))
        })

        it('fail malformed', async () => {
            const req = { cookies: { token: 'yo' } }
            await auth.isLogin(req, {}, next)

            expect(next).toHaveBeenCalledWith(new CustomError('401', 'jwt malformed'))
        })

        it('fail expired', async () => {
            const TOKEN_EXPIRATION_IN_SEC = process.env.TOKEN_EXPIRATION_IN_SEC
            process.env.TOKEN_EXPIRATION_IN_SEC = '0'

            const token = await auth.addToken(users[0].email)
            const req = { cookies: { token: token } }
            await auth.isLogin(req, {}, next)

            expect(next).toHaveBeenCalledWith(new CustomError('401', 'jwt expired'))

            process.env.TOKEN_EXPIRATION_IN_SEC = TOKEN_EXPIRATION_IN_SEC
        })
    })
})
