const mongoose = require("mongoose")
const db = require('../config/db');

const GroupChatSchema = new mongoose.Schema({
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: "group" },
    msg_list:[]
})
module.exports = db.model("groupChat", GroupChatSchema);
/**
 * msg_list:
 * belong 表示该信息是谁发的,值为用户id
 * type  表示信息的类型，分为voice（语音），text（文字），image（图片)，file（文件）
 */
// { msg: String, type: String, belong: String, date: { type: Date, default: Date.now() } }
