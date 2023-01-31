var dbserver = require('../dao/dbserver')
// 引入邮箱发送方法
var emailserver = require('../dao/emailserver')
// 注册页面服务
var signup = require('../server/signup')
var signin = require('../server/sign')
// 搜索
const search = require('../server/search')


module.exports = function(app) {

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
  /**,
   * @swagger
   * /login: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
   *    post:
   *      description: 应用登录接口
   *      tags: [用户登录]
   *      summary: 应用登录接口 #这个接口的提示
   *      produces:
   *      - application/json #返回类型
   *      requestBody:    #编写参数接收体
   *          required: true  #是否必传
   *          content:
   *              application/json:
   *                  schema:     #参数备注
   *                      type: object    #参数类型
   *                      properties:
   *                          username:
   *                                  type: string    #参数类型
   *                                  description: 用户名/邮箱     #参数描述
   *                          pwd:
   *                                  type: string    #参数类型
   *                                  description: 密码     #参数描述
   *                  example:        #请求参数样例。
   *                      username: "小王"
   *                      pwd: "123456"
   *      responses:
   *        200:
   *          description: successful operation
   *        400:
   *          description: Invalid ID supplied
   *        404:
   *          description: Order not found
   * */
  app.post('/login',function(req,res)  {
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
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


  /**,
   * @swagger
   * /hello: #一定要写完整路径 我使用路由中间件的时候 加了api前缀
   *    get:
   *      tags: #分类
   *      - 测试
   *      summary: 提交考试答案 #这个接口的提示
   *      produces:
   *      - application/json #返回类型
   *      parameters: #参数以及参数类型
   *      - name: name
   *        in: query
   *        description: 姓名
   *        required: false
   *        type: integer
   *      responses:
   *        200:
   *          description: successful operation
   *        400:
   *          description: Invalid ID supplied
   *        404:
   *          description: Order not found
   * */

  app.get("/hello", (req, res) => {
    const name = req.query.name;
    res.send({
      hello: `hello`
    });
  });


}
