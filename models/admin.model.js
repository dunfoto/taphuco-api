const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
    },
    password: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Admin', UserSchema)
