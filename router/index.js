var dbserver = require('../dao/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dao/emailserver')
// 注册页面服务
var signup = require('../server/signup')
var signin = require('../server/sign')
// 搜索
const search = require('../server/search')


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
  // 登录
  app.post('/signin/match',function(req,res)  {
    console.log('1////////////////')
    signin.signIn(req,res)
  })
  // 搜索用户
  app.post('/search/user', function (req, res) {
    search.searchUser(req, res)
  })
  // 判断是否为好友
  app.post('/search/isfriend', function (req, res) {
    search.isFriend(req, res)
  })
  app.post('/search/group', function (req, res) {
    search.searchGroup(req, res)
  })
  app.post('/search/isingroup', function (req, res) {
    search.isInGroup(req, res)
  })
}
