const { adminService } = require('../services/index')

const usersGET = async (req, res, next) => {
    try {
        const result = await adminService.usersGET()

        return res.status(200).json({ msg: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    usersGET,
}
