const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    balance: {type: Number, default: 1000},
    bio: {type: String, required: true},
    ccm: {type: Number, default: 0},
    cfi: {type: Number, default: 0},
    check: {type: Boolean, default: false},
    password: {type: String, required: true},
    imageURL: {type: String, default: "uploads/default.jpg"}
})

const UserModel = mongoose.model("users", UserSchema)
module.exports = UserModel