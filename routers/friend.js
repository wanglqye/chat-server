const { addApply } = require('../controllers/c_friend');

module.exports = function (app) {
    // 添加好友
    app.post('/friend/addFriend', function (req, res) {
        console.log(req.body)
        let token = req.headers.authorization
        let data = req.body;
        addApply(token, data, res)
    })
}
