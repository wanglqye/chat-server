const mongoose = require("mongoose")
const db = require('../config/db');

/**
 * chat_list
 * type:类型  private（私聊）  group（群聊）
 */
// 会话表
const DialogueSchema = new mongoose.Schema({
    "userID": String,
    "chat_list": []
    // { "id": String, "type": String,"msgType","message": String, "date": { "type": Date, "default": Date.now() }, "unRead": Number }
})

module.exports = db.model("dialogue", DialogueSchema);
