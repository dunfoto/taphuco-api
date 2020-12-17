const mongoose = require("mongoose")
const HotSpotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    content: {
        color: {
            type: String
        },
        requirement: {
            type: String
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    },
    url: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('HotSpot', HotSpotSchema)
