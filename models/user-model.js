const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username: String,
    googleId: String,
    facebookId: String,
    thumbnail: String
})

const User = mongoose.model('User', userSchema)

module.exports = User