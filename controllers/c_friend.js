const User = require('../model/userModel')
const Friend = require('../model/friendModel')
const { verifyToken } =  require('../dao/jwt')
const Apply = require('../model/applyModel')
const Notify = require('../model/notifyModel')

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

// 获取好友请求
exports.getRequire = function(token,data,res){
    let resToken = verifyToken(token);
    Apply.findOne({userID:resToken.id}, async function(err,result){
        console.log('result',result)
        // type 为 number 时获取的是请求的数量
        // type 为 details 时获取的是请求的详情
        if (data?.type == "number") {
            if (result) {
                res.send({status:200,result})
            } else {
                res.send({ status: 400, applyList: [] })
                // return {
                //     applyList: []
                // }
            }
        }else{
            if(result){
                let addRequire = {
                    userID: result.userID,
                    applyList: []
                }
                result.applyList.map(item => {
                    addRequire.applyList.push({
                        note: item.note,
                        applyId: item.applyId,
                        time: item.time
                    })
                })

                await Promise.all(addRequire.applyList.map(async item => {
                    let user = await User.findOne({ _id: item.applyId })
                    item.avatars = user.imgUrl
                    item.name = user.name
                    return item
                }))

                res.send({ status: 200, addRequire })
            }else{
                res.send({status:200, applyList: [] })
            }
        }
    })

}

// 处理好友请求
exports.deal = async function(token,data,res){
    let resToken = verifyToken(token)
    //通知
    let notifyResult = null;
    let notifyRes = await Notify.findOne({ userID:data.applyId})
    if (notifyRes) {
        // 更新通知表
        console.log('!')
        notifyResult = await Notify.updateOne({
            "userID": data.applyId
        }, { $push: { "notify_list": { "operaUser": resToken.id, "operation": data.operation, "genre": "application", "unRead": false, "date": new Date() } } })
    } else {
        console.log('?')
        // 创建通知表
        notifyResult = await Notify.create({
            userID: data.applyId,
            notify_list: [{ "operaUser": resToken.id, "operation": data.operation, "genre": "application", "unRead": false, "date": new Date() }]
        })
    }
    // 关于好友表的操作
    if(data.operation == 'agree'){
        let table = await Friend.findOne({userID:resToken.id})
        let applyTable = await Friend.findOne({userID:data.applyId})
        let answer = null;
        console.log('table',table)
        console.log('applytable',applyTable)
        if(table){

        }else{
            answer = await Friend.create({
                userID:resToken.id,
                friend_list:[{
                    "user":data.applyId,
                    "nickname":"?????"
                }]
            })
            console.log(answer)
            // if(answer){

            // }
        }
    }

}
