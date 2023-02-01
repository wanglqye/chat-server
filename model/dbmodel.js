var mongoose = require('mongoose');
var db = require('../config/db');
var Schema = mongoose.Schema;


// 用户表
// var UserSchema = new Schema({
//   name: { type: String },
//   psw: { type: String },
//   email: { type: String },
//   sex: { type: String,default:'asexual' },   //性别
//   brith: { type: Date },
//   phone: { type: Number },
//   explain: { type: String }, //介绍
//   imgUrl: { type: String, default:'user.png'}, //头像
//   time: { type: Date },   //注册时间
// })

// 好友表
var FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, //好友id
  state: { type: Number }, //好友状态(0表示申请中,1表示已为好友，2表示申请发送方，对方还未同意）
  time: { type: Date }, //生成时间
})

// 一对一消息表
var MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
  friendID: { type: Schema.Types.ObjectId, ref: 'User' }, //好友id
  message: { type: String }, //消息内容
  types: { type: String }, //内容类型(0文字,1图片链接，2.音频链接...)
  time: { type: Date }, //发送时间
  state: { type: Number }, //消息状态(0已读，1，未读)
})

// 群表
var GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
  name: { type: String }, //群名称
  imgUrl: { type: String }, //群头像
  time: { type: Date }, //创建时间
  notice: { type: Number }, //群公告
})


// 群成员表
var GroupMemberSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, //群id
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
  name: { type: String }, //群内名称
  tip: { type: Number, default: 0 }, // 未读消息数
  time: { type: Date }, //加入时间
  shield: { type: Number }, //是否屏蔽群消息(0不屏蔽,1屏蔽)
})

// 群消息表
var GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' }, //群id
  userID: { type: Schema.Types.ObjectId, ref: 'User' }, //用户id
  message: { type: String }, //消息内容
  types: { type: String }, //内容类型(0文字,1图片链接，2.音频链接...),
  time: { type: Date }, //发送时间
})

// module.exports = db.model('User', UserSchema)
// module.exports = db.model('Friend', FriendSchema)
module.exports = db.model('Message', MessageSchema)
module.exports = db.model('Group', GroupSchema)
module.exports = db.model('GroupMember', GroupMemberSchema)
module.exports = db.model('GroupMsg', GroupMsgSchema)
