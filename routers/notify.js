const { getNotice } = require('../controllers/c_notify')


module.exports = function(app) {
  app.get('/notify/notice',(req,res) => {
    let token = req.headers.authorization
    let data = req.query;
    getNotice(token,data,res)
  })
}
