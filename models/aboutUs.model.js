const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    histories: [{
        year: Number,
        image: String,
        content: String
    }],
    businessArea: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    boardDirecter: [{
        name: String,
        position: String,
        level: Number
    }],
    clients: [{
        type: String
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('AboutUs', ModelSchema)
