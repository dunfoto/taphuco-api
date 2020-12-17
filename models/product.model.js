const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: [{
        type: String
    }],
    prepare: [{
        type: String
    }],
    afterDye: [{
        type: String
    }],
    complete: [{
        type: String
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ModelSchema)
