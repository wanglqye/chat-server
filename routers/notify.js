const dbserver = require('../dao/dbserver')

const { getNotice } = require('../controllers/')


module.exports = function(app) { 
  app.get('/notify/notice',(req,res) => {
    dbserver.getNotice(req,res)  
  })  
}