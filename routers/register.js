const {register}  = require('../controllers/c_user');

module.exports = function(app){
    // 注册
    app.post('/register', function (req, res) {
        register(req.body,res)
    })
}
