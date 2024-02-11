const mongoose = require('mongoose')

const GraphSchema = new mongoose.Schema({
    usernameofsc: {type: String},
    price: {type: Number},
    timestamp: {type: Date}
})

const GraphModel = mongoose.model("graphs", GraphSchema)
module.exports = GraphModel