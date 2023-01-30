// 引入加密文件
var bcrypt = require('./bcrypt')

var dbmodel = require('../model/dbmodel');
var User = dbmodel.model('User');
let Friend = dbmodel.model('Friend')
let Group = dbmodel.model('Group')
let GroupMember = dbmodel.model('GroupMember')

var jwt = require('../dao/jwt')



// 新建用户
exports.buildUser = function(name,mail,pwd,res) {
  // 密码加密
  let password = bcrypt.encryption(pwd);
  let data = {
    name:name,
    email:mail,
    psw:password,
    time:new Date(),
  }
  let user = new User(data);
  user.save(function(err,result){
    if(err){
      res.send({ status: 500 })
    }else{
      res.send({status:200})
    }
  })
}

// 匹配用户表元素个数
exports.countUserValue = function(data,type,res){
  let wherestr = {};
  wherestr[type] = data;

  User.countDocuments(wherestr,function(err,result){
    if(err){
      res.send({ status: 500 })
    }else{
      res.send({ status: 200 })
    }
  })
}

// 用户验证
exports.userMatch = function(username,pwd,res) {
  let wherestr = { $or: [{ 'name': username }, { 'email': username }]}
  let out = { 'name':1,imgUrl:'1',psw:1}
  User.find(wherestr,out,function(err,result){
    // console.log('result1', result, err, pwd)
    if(err){
      res.send({status:500})
    }else{
      if(result && result.length > 0 ){
        result.map(function (e) {
          const pwdMatch = bcrypt.verification(pwd, e.psw)
          if(pwdMatch){
            let token = jwt.generateToken(e._id)
            // console.log('token',token)
            let back = {
              id:e._id,
              name:e.name,
              imgUrl:e.imgUrl,
              token
            }
             res.send({ status: 200,back })
          }else{
             res.send({ status: 400,error:"用户名或者密码错误" })
          }
        })
      }else{
        res.send({ status: 400, error: "用户名或者密码错误" })
      }
    }
  })
}

// 搜索用户
exports.searchUser = function(data,res){
  // console.log('data',data)
  let wherestr = {}
  if(data == 'hah'){
     wherestr = {};
  } else{
    wherestr = { $or: [{ name: { $regex: data } }, { email: { $regex: data } }] }
  }
  let out = {
    'name':1,
    'email':1,
    'imgUrl':1
  }
  User.find(wherestr,out,function(err,result){
    if(err){
      res.send({ status :500})
    }else{
      res.send({status:200,result})
    }
  })
}

// 判断是否为好友
exports.isFriend = function (uid,fid,res) {
  let wherestr = {'userId':uid,'friendID':fid,status:0}
  Friend.findOne(wherestr,function(err,result){
    if(err){
      res.send({ status:500 })
    } else{
      if(result){
        // 是好友
        res.send({status:200,tip:1})
      }else{
        // 不是好友
        res.send({status:400})
      }
    }

  })
}

// 搜索群
exports.searchGroup = function(data,res) {
    let wherestr = {}
    wherestr = { name: { $regex: data } }
    let out = {
      name: 1,
      imgUrl: 1,
    }
    Group.find(wherestr, out, function (err, result) {
      if (err) {
        res.send({ status: 500 })
      } else {
        res.send({ status: 200, result })
      }
    })
}

// 判断是否在群内
exports.isInGroup = function (uid, gid, res) {
  let wherestr = { userId: uid, groupID: gid }
  GroupMember.findOne(wherestr, function (err, result) {
    if (err) {
      res.send({ status: 500 })
    } else {
      if (result) {
        // 是在群内
        res.send({ status: 200, tip: 1 })
      } else {
        // 不在群内
        res.send({ status: 400 })
      }
    }
  })
}
