var dbserver = require('../dao/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dao/emailserver')
// 注册页面服务
var signup = require('../server/signup')


module.exports = function(app) {
  app.get('/est', (req, res) => {
    dbserver.findUser(res)
  })

  app.post('/mails', (req, res) => {
    // console.log('mail', req.body.mail)
    let mail = req.body.mail
    emailserver.emailSignUp(mail, res)
  })

  // 注册
  app.post('/signup/add', function (req, res) {
    signup.signUp(req, res)
  })
  // 用户名或邮箱是否被注册
  app.post('/signup/judge', function (req, res) {
    signup.judgeValue(req, res)
  })
}
