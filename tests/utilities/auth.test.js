const auth = require('../../src/utilities/auth')

const users = [
    { email: 'admin@gmail.com', password: 'admin' },
    { email: 'test@gmail.com', password: '123' },
]

describe('auth', () => {
    describe('addToken', () => {
        it('pass', async () => {
            const token = await auth.addToken(users[0].email)
            expect(token).toBe('yo')
        })
    })
})
