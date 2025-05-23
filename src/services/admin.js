const { redis, CustomError } = require('../utilities')
const usersModel = require('../models/users')
const recordsModel = require('../models/records')


const usersGET = () => {
    const result = usersModel.aggregate([
        {
            $lookup: {
                from: 'records',
                localField: 'email',
                foreignField: 'email',
                as: 'userRecords',
            },
        },
        {
            $addFields: {
                apiCallCount: { $size: '$userRecords' },
            },
        },
        {
            $project: {
                _id: 0,
                email: 1,
                role: 1,
                enable: 1,
                apiCallCount: 1,
            },
        },
        {
            $sort: { email: 1 },
        },
    ])

    return result
}

const toggleBanUserPATCH = async (email, enable) => {
    const result = await usersModel.findOneAndUpdate(
        { email: email },
        { enable: enable },
        { new: true, projection: { email: 1, enable: 1 } },
    )

    if (!result || result.enable !== enable) {
        throw new CustomError('500', 'Failed to toggle enable user')
    }

    if (enable === false) {
        await redis.client.del(result.email)
    }

    return result
}

const recordsGET = async () => {
    const result = await recordsModel.aggregate([{
        $group: {
            _id: {
                method: '$method',
                route: '$route',
            },
            count: { $sum: 1 },
        },
    },
    {
        $project: {
            _id: 0,
            method: '$_id.method',
            route: '$_id.route',
            count: 1,
        },
    },
    {
        $sort: { count: -1 }, // Sort by desc
    }])
    return result
}


module.exports = {
    usersGET,
    recordsGET,
    toggleBanUserPATCH,
}
