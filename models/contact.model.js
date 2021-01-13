const mongoose = require("mongoose")
const ModelSchema = new mongoose.Schema({
    name: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    content: {
        type: String
    },
    path: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Contact', ModelSchema)