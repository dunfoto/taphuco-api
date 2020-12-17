const mongoose = require("mongoose")
const ImageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    hotSpots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "HotSpot"
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    deletedAt: {
        type: Date,
        default: null
    }
})

module.exports = mongoose.model('Image', ImageSchema)