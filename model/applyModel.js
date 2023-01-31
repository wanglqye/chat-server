const mongoose = require("mongoose")
const db = require('../config/db');
// 好友申请表
const ApplySchema = new mongoose.Schema({
    userID: String,	//用户id
    applyList: [
        { applyId: String,
          note: String,
          time: String
        }
    ],   //申请表
    // {note,applyId}
})

module.exports = db.model("application", ApplySchema);
