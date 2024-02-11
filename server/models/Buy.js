const mongoose = require("mongoose")

const BuySchema = new mongoose.Schema({
    amountboughtinfcoins: {type: Number},
    amountboughtinsc: {type: Number},
    timestamp: {type: Date, default: Date.now},
    usernameofbuyer: {type: String},
    usernameofsc: {type: String},
})

const BuyModel = mongoose.model("buys", BuySchema)
module.exports = BuyModel