const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    link: {
        type: String,
        unique: true,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Social', ModelSchema)
