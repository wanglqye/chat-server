const { addApply, getRequire, deal, getFriends } = require('../controllers/c_friend');

module.exports = function (app) {
    // 添加好友
    app.post('/friend/addFriend', function (req, res) {
        console.log(req.body)
        let token = req.headers.authorization
        let data = req.body;
        addApply(token, data, res)
    })
    // 获取好友申请
    app.get('/friend/getFriendApply', function (req, res) {
        let token = req.headers.authorization
        let data = req.query;
        getRequire(token, data, res)
    })

    // 处理好友请求
    app.post('/friend/deal', function (req, res) {
        let token = req.headers.authorization
        let data = req.body;
        deal(token, data, res)
    })
    // 获取好友列表
    app.get('/friend/getFriendsList', function (req, res) {
        let token = req.headers.authorization
        let data = req.query;
        getFriends(token, data, res)
    })
}
