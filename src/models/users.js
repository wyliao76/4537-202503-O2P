const mongoose = require('mongoose')
const { Schema } = mongoose

const UsersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'normal',
        enum: ['admin', 'normal'],
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    enable: {
        type: Boolean,
        default: false,
    },
    api_tokens: {
        type: Number, default: 20,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Users', UsersSchema)

