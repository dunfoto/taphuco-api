const mongoose = require('mongoose'),
    ModelSchema = new mongoose.Schema({
        showTitle: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        position: {
            type: Number,
            required: true
        }
    }, {
        timestamps: true
    })

module.exports = mongoose.model('Solution', ModelSchema)
