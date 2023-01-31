// 引入token
var jwt = require('jsonwebtoken')

const {secret} = require('../tool/common')

exports.generateToken = function(id,res) {
  let payload = {id:id,time:new Date()}
  //此方法会生成一个token，第一个参数是数据，第二个参数是签名,第三个参数是token的过期时间可以不设置
  let token = jwt.sign(payload,secret,{ expiresIn:60 * 60 * 24 * 120 })

  return token;
}

exports.verifyToken = function(e) {
  let payload = jwt.verify(e,secret)
  return payload;
}
