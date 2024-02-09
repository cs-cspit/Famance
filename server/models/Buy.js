const mongoose = require("mongoose")

const BuySchema = mongoose.Schema({
    amoungboughtinfcoins: {type: Number, required: true},
    amountboughtinsc: {type: Number, required: true},
    emailofbuyer: {type: String, required: true},
    timestamp: {type: Date, required: true, default: Date.now},
    usernameofbuyer: {type: String, required: true},
    usernameofsc: {type: String, required: true},
})

const BuyModel = mongoose.model("buys", BuySchema)
module.exports = BuyModel