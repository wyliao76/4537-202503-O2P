const Redis = require('ioredis')

const redis = {
    client: null,
    connect: function() {
        this.client = new Redis(process.env.REDIS_HOST)
        console.log('Redis connected.')
    },
    close: async function() {
        await this.client.quit()
        console.log('Redis closed.')
    },
}

module.exports = redis
