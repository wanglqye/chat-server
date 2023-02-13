const dbserver = require('../dao/dbserver')

const { getNotice } = require('../controllers/c_notify')


module.exports = function(app) {
  app.get('/notify/notice',(req,res) => {
    let token = req.headers.authorization
    let data = req.query;
    dbserver.getNotice(token,data,res)
  })
}
