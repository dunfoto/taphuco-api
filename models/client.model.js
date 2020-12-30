const mongoose = require("mongoose")
const ModelSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Client', ModelSchema)