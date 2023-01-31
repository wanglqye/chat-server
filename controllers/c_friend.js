const User = require('../model/userModel')
const Friend = require('../model/friendModel')
const { verifyToken } =  require('../dao/jwt')
const Apply = require('../model/applyModel')

// 发送好友请求
exports.addApply = function(token,data,res) {
    let tokenRes = verifyToken(token);
    let { id,note } = data;
    let answer = null
    Apply.findOne({userID:id},function(err,result){
        if(result){
            let arr = result.applyList
            let bool = arr.map(item => {
                return item.applyId == tokenRes.id
            })
            // 存在的话则先删除
            if (bool) {
                Apply.updateOne({ userID: id }, { $pull: { applyList: { applyId: tokenRes.id } } })
            }
            Apply.updateOne({
                userID: id,
            }, {
                '$push': {
                    applyList: { note, applyId: tokenRes.id, time: new Date() }
                }
            },function(err,newres){
                console.log('newres',newres)
                answer = newres
            });
        } else{
            Apply.create({
                userID:id,
                applyList:[
                    {
                        applyId: tokenRes.id,
                        note:note,
                        time:new Date()
                    }
                ]
            })
        }
        if (answer?.nModified == 0) {
            res.send({
                status: 400,
                msg: "请求发送失败，请稍后再试"
            })
        } else {
            res.send({
                status: 200,
                msg: "发送成功"
            })
        }
    })
}
