const usersModel = require('../../src/models/users')
const tokensModel = require('../../src/models/tokens')
const recordsModel = require('../../src/models/records')
const { adminController } = require('../../src/controllers')
const { adminService } = require('../../src/services')
const Joi = require('joi')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { email: 'test@gmail.com', password: '123', role: 'normal' },
]

const records = [
    { method: 'GET', route: '/questions', email: 'test@gmail.com' },
    { method: 'GET', route: '/questions', email: 'admin@gmail.com' },
    { method: 'GET', route: '/admin/users', email: 'admin@gmail.com' },
]

describe('admin', () => {
    describe('usersGET', () => {
        let req
        let res
        let next

        beforeEach(async () => {
            await usersModel.insertMany(users)
        })

        it('pass', async () => {
            const users = await adminService.usersGET()
            const results = { msg: users }
            req = {}
            res = {
                status: jest.fn().mockReturnThis(200),
                json: jest.fn().mockReturnThis(results),
            }
            next = jest.fn()

            await adminController.usersGET(req, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(results)
        })
    })

    describe('toggleBanUserPATCH', () => {
        let req
        let res
        let next
        let result

        beforeEach(async () => {
            await usersModel.insertMany(users)
            result = await adminService.toggleBanUserPATCH(users[1].email, false)
            // bugged
            // result = await usersModel.findOne({ email: users[1].email }, { email: 1, enable: 1 }).lean()
            // result.enable = false
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis({ msg: result }),
            }
            next = jest.fn()
        })

        it('pass', async () => {
            req = {
                query: {
                    email: users[1].email,
                },
                body: {
                    enable: false,
                },
            }
            await adminController.toggleBanUserPATCH(req, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ msg: result })
        })

        it('fail (no email)', async () => {
            req = {
                query: {
                },
                body: {
                    enable: false,
                },
            }
            await adminController.toggleBanUserPATCH(req, res, next)

            expect(next).toHaveBeenCalledWith(new Joi.ValidationError('Email cannot be empty'))
        })

        it('fail (no enable)', async () => {
            req = {
                query: {
                    email: users[1].email,
                },
                body: {
                },
            }
            await adminController.toggleBanUserPATCH(req, res, next)

            expect(next).toHaveBeenCalledWith(new Joi.ValidationError('"enable" must be a boolean'))
        })
    })

    describe('adjustTokenPOST', () => {
        let req
        let res
        let next
        let result

        beforeEach(async () => {
            await usersModel.insertMany(users)
            await tokensModel.insertMany(users)
            result = await adminService.adjustTokenPOST(users[1].email, 100)
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            next = jest.fn()
        })

        it('pass', async () => {
            req = {
                body: {
                    email: users[1].email,
                    times: 100,
                },
            }
            await adminController.adjustTokenPOST(req, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ msg: result })
        })

        it('fail (no email)', async () => {
            req = {
                body: {
                    times: 100,
                },
            }
            await adminController.adjustTokenPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(new Joi.ValidationError('Email cannot be empty'))
        })

        it('fail (no times)', async () => {
            req = {
                body: {
                    email: users[1].email,
                },
            }
            await adminController.adjustTokenPOST(req, res, next)

            expect(next).toHaveBeenCalledWith(new Joi.ValidationError('Times is required'))
        })
    })

    describe('recordsGET', () => {
        beforeEach(async () => {
            await recordsModel.insertMany(records)
        })

        it('pass', async () => {
            const aggregateRecords = await adminService.recordsGET()
            const results = { msg: aggregateRecords }
            const req = {}
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            }
            const next = jest.fn()

            await adminController.recordsGET(req, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(results)
        })
    })
})
