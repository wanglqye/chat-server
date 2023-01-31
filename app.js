// 引入body-parser解析req
var bodyParser = require('body-parser');
const express = require('express')
const path = require('path');
const fs = require('fs')
// 引入token
const jwt = require('./dao/jwt')
const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// token判断
// app.use(function (req, res, next) {
//     let token = req.headers['authorization'];
//     // let tokenMatch = jwt.verifyToken(token)
//     if (token || req.url == '/login' || req.url == '/register' || req.url.includes('/upload')){
//       next();
//     }else{
//       res.send({ status: 401, msg: "非法请求" })
//     }
// })


// 配置跨域请求中间件(服务端允许跨域请求)
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", req.headers.origin); // 设置允许来自哪里的跨域请求访问（值为*代表允许任何跨域请求，但是没有安全保证）
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"); // 设置允许接收的请求类型
    res.header("Access-Control-Allow-Headers", "Content-Type,request-origin"); // 设置请求头中允许携带的参数
    res.header("Access-Control-Allow-Credentials", "true"); // 允许客户端携带证书式访问。保持跨域请求中的Cookie。注意：此处设true时，Access-Control-Allow-Origin的值不能为 '*'
    res.header("Access-control-max-age", 1000); // 设置请求通过预检后多少时间内不再检验，减少预请求发送次数
    next();
})



// 404
// app.use(function(req,res,next) {
//   let err = new Error('Not Found.~')
//   err.status =  404;
//   next(err)
// })

// // 出现错误处理
// app.use(function (req,res,next) {
//   res.status(err.status || 500)
//   res.send(err.message)
// })
const routesPath = path.join(__dirname, "routers")
const files = fs.readdirSync(routesPath)
for(let file of files){
  require('./routers/'+file)(app)
}

// require('./routers/index')(app);

app.listen(port, () => console.log('启动啦111'))
