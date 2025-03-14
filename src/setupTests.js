const mongoose = require('mongoose')
const { MongoMemoryReplSet } = require('mongodb-memory-server')
require('dotenv').config({ path: `${__dirname}/.env.${process.env.NODE_ENV}` })
const redis = require('./utilities/redis')


const mockMongooseUtils = {
    connect: async () => {
        this.replset = await MongoMemoryReplSet.create()
        const uri = this.replset.getUri()
        console.log(uri)

        const mongooseOpts = {
        }

        return mongoose.connect(uri, mongooseOpts)
    },
    close: async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        if (this.replset) {
            await this.replset.stop()
        }
    },
    clear: () => {
        const collections = mongoose.connection.collections
        return Promise.all(
            Object.values(collections).map((collection) => collection.deleteMany({})),
        )
    },

}

jest.mock('ioredis', () => require('ioredis-mock'))

beforeAll(async () => {
    return Promise.all([
        mockMongooseUtils.connect(),
        redis.connect(),
    ])
})

afterEach(async () => {
    await mockMongooseUtils.clear()
    await redis.client.flushdb()
})

afterAll(async () => {
    await mockMongooseUtils.close()
    await redis.close()
})
