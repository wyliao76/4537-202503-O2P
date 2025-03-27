const mongoose = require('mongoose')
const { Schema } = mongoose

const RecordsSchema = new Schema({
    method: {
        type: String,
        required: true,
    },
    route: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Records', RecordsSchema)
