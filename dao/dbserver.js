// 引入加密文件
var bcrypt = require('./bcrypt')

var dbmodel = require('../model/dbmodel');
var User = dbmodel.model('User');

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
exports.userMatch = function(data,pwd,res) {
  let wherestr = {$or:[{'name':data},{'email':data}]}
  let out = { 'name':1,imgUrl:'1',psw:1}
  User.find(wherestr,out,function(err,result){
    if(err){
      res.send({status:500})
    }else{
      if(!result){
        res.send({ status: 400 })
      }
      result.map(function(e){
        console.log(e)
        const pwdMatch = bcrypt.verification(pwd,e.psw)
        if(pwdMatch){
          let token = jwt.generateToken(e._id)
          console.log('token',token)
          let back = {
            id:e._id,
            name:e.name,
            imgUrl:e.imgUrl,
            token
          }
           res.send({ status: 200,back })
        }else{
          res.send({ stauts:400})
        }
      })
    }
  })
}