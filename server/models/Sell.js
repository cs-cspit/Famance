const mongoose = require('mongoose')

const SellSchema = new mongoose.Schema({
    amountreceivedinfcoins: {type: Number},
    amountsoldinsc: {type: Number},
    timestamp: {type: Date, default: Date.now},
    usernameofsc: {type: String},
    usernameofseller: {type: String},
})

const SellModel = mongoose.model("sells", SellSchema)
module.exports = SellModel