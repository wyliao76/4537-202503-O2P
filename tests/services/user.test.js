const { CustomError } = require('../../src/utilities/index')
const usersModel = require('../../src/models/users')
const { userService } = require('../../src/services')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { email: 'test@gmail.com', password: '123', role: 'normal' },
]

describe('user', () => {
    describe('userGET', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
        })

        it('pass', async () => {
            const result = await userService.userGET(users[0].email)

            expect(result.email).toBe(users[0].email)
            expect(result.role).toBe(users[0].role)
            expect(result.lastLogin).toBeNull()
            expect(result.enable).toBe(true)
            expect(result.api_tokens).toBe(20)
        })

        it('fail', async () => {
            await expect(userService.userGET('not_exist')).rejects.toThrow(new CustomError('404', 'user not found'))
        })
    })
})
