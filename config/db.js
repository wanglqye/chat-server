var mongoose = require('mongoose')

var db = mongoose.createConnection('mongodb://localhost:27017/chat',{useNewUrlParser:true,useUnifiedTopology:true})

db.on('error', console.error.bind(console, 'connection error:数据库连接失败'))
db.once('open', function () {
  // we're connected!
  console.log('数据库连接成功')
})

module.exports = db;
console.log('???')