const Notify  = require('../model/notifyModel')
const { verifyToken } = require('../dao/jwt')

// 获取通知
exports.getNotice = async (token,res) =>{
    let tokenRes = verifyToken(token)
    let tokenNotify = await Notify.findOne({ userID:tokenRes.id})
    console.log(tokenNotify)
    if (tokenNotify && tokenNotify.notify_list.length > 0 ){
        // let result = await Notify.findOne({ userID: tokenRes.id }).populate("notify_list.operaUser")
        let result = await Notify.findOne({ userID: tokenRes.id }).populate("notify_list.operaUser")
        // res.send({status:200,result})
    }
}
