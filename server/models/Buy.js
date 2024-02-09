const mongoose = require("mongoose")

const BuySchema = mongoose.Schema({
    amoungboughtinfcoins: {type: Number},
    amountboughtinsc: {type: Number},
    timestamp: {type: Date, default: Date.now},
    usernameofbuyer: {type: String},
    usernameofsc: {type: String},
})

const BuyModel = mongoose.model("buys", BuySchema)
module.exports = BuyModel