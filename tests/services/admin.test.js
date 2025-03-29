const usersModel = require('../../src/models/users')
const tokensModel = require('../../src/models/tokens')
const recordsModel = require('../../src/models/records')
const { adminService } = require('../../src/services')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin', enable: true },
    { email: 'test@gmail.com', password: '123', role: 'normal', enable: false },
]

const records = [
    { method: 'GET', route: '/questions', email: 'test@gmail.com' },
    { method: 'GET', route: '/questions', email: 'admin@gmail.com' },
    { method: 'GET', route: '/admin/users', email: 'admin@gmail.com' },
]

describe('admin', () => {
    describe('usersGET', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
            await recordsModel.insertMany(records)
        })

        it('pass', async () => {
            const results = await adminService.usersGET()

            expect(results).toHaveLength(2)
            expect(results[0].email).toBe(users[0].email)
            expect(results[0].role).toBe(users[0].role)
            expect(results[0].enable).toBe(users[0].enable)
            expect(results[0].apiCallCount).toBe(2)

            expect(results[1].email).toBe(users[1].email)
            expect(results[1].role).toBe(users[1].role)
            expect(results[1].enable).toBe(users[1].enable)
            expect(results[1].apiCallCount).toBe(1)
        })
    })

    describe('adjustTokenPOST', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
            await tokensModel.insertMany(users)
        })

        it('pass', async () => {
            const times = 100
            const result = await adminService.adjustTokenPOST(users[1].email, times)

            expect(result.email).toBe(users[1].email)
            expect(result.tokens).toBe(times)
        })
    })

    describe('recordsGET', () => {
        beforeEach(async () => {
            await recordsModel.insertMany(records)
        })

        it('pass', async () => {
            const results = await adminService.recordsGET()

            expect(results).toHaveLength(2)

            expect(results[0].count).toBe(2)
            expect(results[1].count).toBe(1)
            expect(results[0].method).toBe('GET')
            expect(results[1].method).toBe('GET')
            expect(results[0].route).toBe('/questions')
            expect(results[1].route).toBe('/admin/users')
        })
    })
})
