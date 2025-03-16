const usersModel = require('../../src/models/users')
const { userController } = require('../../src/controllers')
const { userService } = require('../../src/services')
const { auth, CustomError } = require('../../src/utilities')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { email: 'test@gmail.com', password: '123', role: 'normal' },
]

describe('admin', () => {
    describe('usersGET', () => {
        let req
        let res
        let next

        beforeEach(async () => {
            await usersModel.insertMany(users)
            next = jest.fn()
        })

        it('pass', async () => {
            const user = await userService.userGET(users[0].email)
            const results = { msg: user }
            const token = await auth.addToken(users[0].email)
            req = {
                cookies: {
                    token: token,
                },
            }
            res = {
                status: jest.fn().mockReturnThis(200),
                json: jest.fn().mockReturnThis(results),
            }

            await userController.userGET(req, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(results)
        })

        it('fail', async () => {
            const token = await auth.addToken('not_exist@gmail.com')
            req = {
                cookies: {
                    token: token,
                },
            }

            await userController.userGET(req, res, next)

            expect(next).toHaveBeenCalledWith(new CustomError('404', 'user not found'))
        })
    })
})
