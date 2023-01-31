//引用发送youjian插件
var nodemailer = require('nodemailer');
// 引入证书
var credentials = require('../config/credentials')

// 创建传输方式
var transpoter = nodemailer.createTransport({
  service:'qq',
  auth:{
    user:credentials.qq.user,
    pass:credentials.qq.pass
  }
})

// 注册发送邮件给用户
exports.emailSignUp = function(email,res){
  // 发送信息
  let options = {
    from:'931606284@qq.com',
    to:email,
    subject:'感谢注册哈哈哈',
    html:'<span>欢迎你嘻嘻嘻</span><a href="http://www.baidu.com">点击看看</a>'
  }
  // 发送邮件
  transpoter.sendMail(options,function(err,msg){
    // if(err){
    //    res.send(err)
    // }else{
    //   res.send('邮箱发送成功了哦!')
    //   console.log('邮箱发送成功')
    // }
    if (err) {
      return "邮件发送失败"
    } else {
      res.send({ status: 200, msg: '注册成功,邮件已发送到邮箱，请注意查收' })

      // return "邮件已发送到邮箱，请注意查收"
    }
  })
}
