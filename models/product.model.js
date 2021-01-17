const mongoose = require('mongoose'),
    mongoose_fuzzy_searching = require('mongoose-fuzzy-searching'),
    ModelSchema = new mongoose.Schema({
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

ModelSchema.plugin(mongoose_fuzzy_searching, {
    fields: ['title', 'description', 'prepare', 'afterDye', 'complete', 'auxiliariesForPrint']
})

ModelSchema.index({ title: "text", description: "text", prepare: "text", afterDye: "text", complete: "", auxiliariesForPrint: "text" })

module.exports = mongoose.model('Product', ModelSchema)
