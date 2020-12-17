const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    reference: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Power', ModelSchema)
