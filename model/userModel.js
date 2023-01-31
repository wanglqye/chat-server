const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String },
    psw: { type: String },
    email: { type: String },
    sex: { type: String, default: '男' },   //性别
    brith: { type: Date, default:"2000-1-1" },
    phone: { type: Number },
    explain: { type: String }, //介绍
    imgUrl: { type: String, default: 'https://www.apizl.com/uploads/apizl/image/2017/12/12/1513058537415773.jpg' }, //头像
    time: { type: Date },   //注册时间
})

module.exports = mongoose.model('user', UserSchema)
