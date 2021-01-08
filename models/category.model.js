const mongoose = require('mongoose'),
    mongoose_fuzzy_searching = require('mongoose-fuzzy-searching'),
    ModelSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
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

ModelSchema.plugin(mongoose_fuzzy_searching, { fields: ['title'] })

module.exports = mongoose.model('Category', ModelSchema)
