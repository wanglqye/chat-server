var dbserver = require('../dao/dbserver')

// 登录
exports.signIn = function(req,res){
  console.log('喂喂喂')
  let {data,pwd} = req.body
  // res.send({status:200})
  dbserver.userMatch(data,pwd,res)
}