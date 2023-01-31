const mongoose = require("mongoose")
const db = require('../config/db');

// 生成群号的表
const NumberSchema = new mongoose.Schema({
    name: String,
    group_number: {
        type: Number,
        default: 1000000
    }
})
module.exports = db.model("number", NumberSchema);
