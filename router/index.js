var dbserver = require('../dao/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dao/emailserver')



module.exports = function(app) {
  app.get('/est',(req,res) => {
    dbserver.findUser(res);
  })

  app.post('/mails',(req,res) => {
    // console.log('mail', req.body.mail)
    let mail = req.body.mail 
    emailserver.emailSignUp(mail,res)
  })
}