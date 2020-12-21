const mongoose = require("mongoose")
const BannerSchema = new mongoose.Schema({
    position: {
        type: Number
    },
    img: {
        type: String,
        required: true
    },
    nodes: [{
        left: {
            type: Number
        },
        bottom: {
            type: Number
        },
        openDefault: {
            type: Boolean,
            default: false
        },
        content: {
            title: {
                type: String
            },
            subTitle: {
                type: String
            },
            color: {
                type: String
            },
            requirement: {
                type: String
            },
            product: {
                type: String
            },
            link: {
                type: String
            }
        }
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model('Banner', BannerSchema)
