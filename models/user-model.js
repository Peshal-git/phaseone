const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    email: String,
    googleId: String,
    facebookId: String,
    thumbnail: String,
    password: String,
    method: {
        type: String,
        enum: ["local", "google", "facebook"],
        default: 'local',
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

userSchema.pre("save", async function (next) {
    if (this.method == 'local') {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User