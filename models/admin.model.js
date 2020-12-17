const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }],
    password: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)
