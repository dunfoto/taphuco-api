const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Role', ModelSchema)
