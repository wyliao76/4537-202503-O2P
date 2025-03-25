const mongoose = require('mongoose')
const { Schema } = mongoose

const TokensSchema = new Schema({
    tokens: {
        type: Number,
        default: 20,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('api_tokens', TokensSchema)
