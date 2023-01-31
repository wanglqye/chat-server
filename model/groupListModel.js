const mongoose = require("mongoose")
const db = require('../config/db');
// 群列表
const GroupListSchema = new mongoose.Schema({
    userID: String,	//用户id
    group_list: [
        { "group": { type: mongoose.Schema.Types.ObjectId, ref: 'group' } }
    ],
})
module.exports = db.model("groupList", GroupListSchema);
