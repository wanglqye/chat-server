var dbserver = require('../dao/dbserver')

// 用户注册
exports.signUp = function(req,res){
  let { name,mail,pwd } = req.body
  dbserver.buildUser(name,mail,pwd,res)
}

// 用户或邮箱是否被使用判断
exports.judgeValue = function(req,res){
  let {data,type} = req.body
  dbserver.countUserValue(data,type,res)
}