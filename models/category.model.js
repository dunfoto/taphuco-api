const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    title: {
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

module.exports = mongoose.model('Category', ModelSchema)
