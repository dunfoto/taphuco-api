const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('History', ModelSchema)
