const mongoose = require('mongoose')
const ModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }],
    level: {
        type: Number
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Permission', ModelSchema)
