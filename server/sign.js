var dbserver = require('../dao/dbserver')

// 登录
exports.signIn = function(req,res){
  let {username,pwd} = req.body
  // res.send({status:200})
  dbserver.userMatch(username,pwd,res)
}
