const mongoose = require('mongoose')
const { Schema } = mongoose
const { Mixed } = Schema.Types

const PersonasSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    persona: {
        type: Mixed,
        required: true,
    },
    pathToImage: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Personas', PersonasSchema)
