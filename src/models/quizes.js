const mongoose = require('mongoose')
const { Schema } = mongoose

const QuizSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Quizes', QuizSchema)
