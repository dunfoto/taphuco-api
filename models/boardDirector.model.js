const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('BoardDirector', ModelSchema)
