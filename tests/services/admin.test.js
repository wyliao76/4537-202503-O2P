const { redis, CustomError } = require('../../src/utilities/index')
const usersModel = require('../../src/models/users')
const tokensModel = require('../../src/models/tokens')
const recordsModel = require('../../src/models/records')
const { adminService, authService } = require('../../src/services')

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

    // describe('banUserPOST', () => {
    //     beforeEach(() => {
    //         return Promise.all(
    //             users.map((user) => authService.registerPOST(user.email, user.password)),
    //         )
    //     })

    //     it('pass', async () => {
    //         await authService.loginPOST(users[1].email, users[1].password)

    //         const result = await adminService.banUserPOST(users[1].email)

    //         expect(result.enable).toBe(false)
    //         expect(await redis.client.get(result.email)).toBeNull()
    //     })

    //     it('pass (user not logged in)', async () => {
    //         const result = await adminService.banUserPOST(users[1].email)

    //         expect(result.enable).toBe(false)
    //         expect(await redis.client.get(result.email)).toBeNull()
    //     })

    //     it('failed (user not found)', async () => {
    //         await expect(adminService.banUserPOST('nouser@gmail.com')).rejects.toThrow(new CustomError('500', 'Failed to disable user'))
    //     })
    // })

    // describe('unBanUserPOST', () => {
    //     beforeEach(() => {
    //         return Promise.all(
    //             users.map((user) => authService.registerPOST(user.email, user.password)),
    //         )
    //     })

    //     it('pass', async () => {
    //         await authService.loginPOST(users[1].email, users[1].password)

    //         const result = await adminService.unBanUserPOST(users[1].email)

    //         expect(result.enable).toBe(true)
    //     })

    //     it('failed (user not found)', async () => {
    //         await expect(adminService.unBanUserPOST('nouser@gmail.com')).rejects.toThrow(new CustomError('500', 'Failed to enable user'))
    //     })
    // })

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
