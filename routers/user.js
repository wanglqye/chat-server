const { findUser } = require('../controllers/c_user');

module.exports = function (app) {
    // 查找用户
    app.get('/user/find', function (req, res) {
        console.log(req.query)
        let token = req.headers.authorization
        let data = req.query;
        findUser(token,data,res)
    })
}
