const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    pointMessage: {
        type: String,
        required: true
    },
    contentMessage: {
        type: String,
        required: true
    },
    application: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }],
    customerExperience: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomerExperience"
    }],
    solutions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solutions"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Home', ModelSchema)
