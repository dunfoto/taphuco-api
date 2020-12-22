const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    img: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('CustomerExperience', ModelSchema)
