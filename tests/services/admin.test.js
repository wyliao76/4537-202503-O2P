const { auth, redis, CustomError } = require('../../src/utilities/index')
const usersModel = require('../../src/models/users')
const { adminService, authService } = require('../../src/services')

const users = [
    { email: 'admin@gmail.com', password: 'admin', role: 'admin' },
    { email: 'test@gmail.com', password: '123', role: 'normal' },
]

const adjustTokenPOST = (email) => {
    return usersModel.find({}, { email: 1, role: 1, api_tokens: 1 }).lean()
}

describe('admin', () => {
    describe('usersGET', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
        })

        it('pass', async () => {
            const results = await adminService.usersGET()

            expect(results).toHaveLength(2)
            results.forEach((result, index) => {
                expect(result.email).toBe(users[index].email)
                expect(result.role).toBe(users[index].role)
                expect(result.api_tokens).toBe(20)
            })
        })
    })

    describe('banUserPOST', () => {
        beforeEach(() => {
            return Promise.all(
                users.map((user) => authService.registerPOST(user.email, user.password)),
            )
        })

        it('pass', async () => {
            await authService.loginPOST(users[1].email, users[1].password)

            const result = await adminService.banUserPOST(users[1].email)

            expect(result.enable).toBe(false)
            expect(await redis.client.get(result.email)).toBeNull()
        })

        it('pass (user not logged in)', async () => {
            const result = await adminService.banUserPOST(users[1].email)

            expect(result.enable).toBe(false)
            expect(await redis.client.get(result.email)).toBeNull()
        })

        it('failed (user not found)', async () => {
            await expect(adminService.banUserPOST('nouser@gmail.com')).rejects.toThrow(new CustomError('500', 'Failed to disable user'))
        })
    })

    describe('unBanUserPOST', () => {
        beforeEach(() => {
            return Promise.all(
                users.map((user) => authService.registerPOST(user.email, user.password)),
            )
        })

        it('pass', async () => {
            await authService.loginPOST(users[1].email, users[1].password)

            const result = await adminService.unBanUserPOST(users[1].email)

            expect(result.enable).toBe(true)
        })

        it('failed (user not found)', async () => {
            await expect(adminService.unBanUserPOST('nouser@gmail.com')).rejects.toThrow(new CustomError('500', 'Failed to enable user'))
        })
    })

    describe('adjustTokenPOST', () => {
        beforeEach(async () => {
            await usersModel.insertMany(users)
        })

        it('pass', async () => {
            const times = 100
            const result = await adminService.adjustTokenPOST(users[1].email, times)

            expect(result.email).toBe(users[1].email)
            expect(result.api_tokens).toBe(times)
        })
    })
})
