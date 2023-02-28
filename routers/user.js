const { findUser,getUserInfo } = require('../controllers/c_user');

module.exports = function (app) {
    // 查找用户
    app.get('/user/find', function (req, res) {
        let token = req.headers.authorization
        let data = req.query;
        findUser(token,data,res)
    })
    app.get('/user/info',function(req,res){
        let token = req.headers.authorization
        let data = req.query;
        getUserInfo(token, data, res)
    })
}
