const mongoose = require("mongoose")
const BannerSchema = new mongoose.Schema({
    original: {
        type: String,
        required: true
    },
    nodes: {
        left: Number,
        bottom: Number,
        content: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HotSpot"
        },
        openDefault: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Banner', BannerSchema)
