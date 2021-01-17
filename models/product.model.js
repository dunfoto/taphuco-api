const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    imgs: [{
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
    }],
    auxiliariesForPrint: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Product', ModelSchema)
