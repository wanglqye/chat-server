const mongoose = require("mongoose")
const db = require('../config/db');


// 保存所有用户的socket id
const SocketSchema = new mongoose.Schema({
    userId: String,
    socketId: String
})

module.exports = db.model("userSocket", SocketSchema)
