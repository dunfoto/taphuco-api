const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Category', ModelSchema)
