const mongoose = require("mongoose")
const db = require('../config/db');

const FriendSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //用户id
    friendID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //好友id
    state: { type: Number }, //好友状态(0表示申请中,1表示已为好友，2表示申请发送方，对方还未同意）
    time: { type: Date }, //生成时间
})


module.exports = db.model('friend', FriendSchema)
