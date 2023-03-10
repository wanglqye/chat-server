const User = require('../model/userModel')
const Friend = require('../model/friendModel')
const { verifyToken } =  require('../dao/jwt')
const Apply = require('../model/applyModel')
const Notify = require('../model/notifyModel')
const {chineseToPinYin} = require('../tool/parseChinese')


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
// exports.deal = async function(token,data,res){
//     let tokenRes = verifyToken(token)
//     //通知
//     let notifyResult = null;
//     let notifyRes = await Notify.findOne({ userID:data.applyId})
//     if (notifyRes) {
//         // 更新通知表
//         notifyResult = await Notify.updateOne({
//             "userID": data.applyId
//         }, { $push: { "notify_list": { "operaUser": tokenRes.id, "operation": data.operation, "genre": "application", "unRead": false, "date": new Date() } } })
//     } else {
//         // 创建通知表
//         notifyResult = await Notify.create({
//             userID: data.applyId,
//             notify_list: [{ "operaUser": tokenRes.id, "operation": data.operation, "genre": "application", "unRead": false, "date": new Date() }]
//         })
//     }
//     // 关于好友表的操作
//     if(data.operation == 'agree'){
//         let table = await Friend.findOne({ userID: tokenRes.id})
//         let applyTable = await Friend.findOne({userID:data.applyId})
//         let answer = null;
//         if(table){
//             answer =  await Friend.updateOne({ userID: tokenRes.id},
//                 {$push:{"friend_list":{user:data.applyId,nickName:data.nickName}}})
//             if (answer.nModified){
//                 await Apply.updateOne({ userID: tokenRes.id }, { $pull: { applyList: { applyId:data.applyId } } })
//                 answer = {
//                     msg: "已同意该用户的好友请求",
//                     status: 400
//                 }
//             }
//         }else{
//             answer = await Friend.create({
//                 userID: tokenRes.id,
//                 friend_list:[{
//                     "user":data.applyId,
//                     "nickName":data.nickName
//                 }]
//             })
//             if(answer){
//                 await Apply.updateOne({ userID: tokenRes.id }, { $pull: {"applyList":data.applyId}})
//                 answer = {
//                     msg:"已同意该用户的好友申请",
//                     status:200
//                 }
//             }
//         }
//         // 获取被申请者的用户资料，获取name属性，并将其作为nickName
//         let tokenUser = User.findOne({ userID: tokenRes.id})
//         if(applyTable){
//              await Friend.updateOne({ userID:data.applyId },{
//                 $push:{"friend_list":{user:tokenRes.id,nickName:tokenUser.name}},
//             })
//         }else{
//             await Friend.create({
//                 userID:data.applyId,
//                 friend_list:[{
//                     "user":tokenRes.id,
//                     "nickName":tokenUser.name
//                 }]
//             })
//         }
//         res.send(answer)
//     } else{
//         let res = await Apply.updateOne({ userID: tokenRes.id }, { $pull:{'applyList':data.applyId }})
//         res.send({
//             status:200,
//             msg:"已取消好友申请已经拒绝该用户的请求"
//         })
//     }

// }
exports.deal = async (token,data,res) => {
    let { applyId, operation, nickName } = data
    let tokenRes = verifyToken(token)
    // 通知
    let notifyRes = await Notify.findOne({ userID: applyId })
    let notifyResult = null
    if (notifyRes) {
        // 更新通知表
        notifyResult = await Notify.updateOne({
            "userID": applyId
        }, { $push: { "notify_list": { "operaUser": tokenRes.id, "operation": operation, "genre": "application", "unRead": false, "date": new Date() } } })
    } else {
        // 创建通知表
        notifyResult = await Notify.create({
            userID: applyId,
            notify_list: [{ "operaUser": tokenRes.id, "operation": operation, "genre": "application", "unRead": false, "date": new Date() }]
        })
    }
    // 关于好友表的操作
    if (operation == "agree") {
        let table = await Friend.findOne({ userID: tokenRes.id })
        let applyTable = await Friend.findOne({ userID: applyId })
        let answer = null
        if (table) {
            answer = await Friend.updateOne({
                userID: tokenRes.id
            }, { $push: { friend_list: { user: applyId, nickName } } })
            if (answer.nModified) {
                let sss = await Apply.updateOne({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
                answer = {
                    msg: "已同意该用户的好友请求",
                    status: 200
                }
            }
        } else {

            answer = await Friend.create({
                userID: tokenRes.id,
                friend_list: [{ "user": applyId, nickName }]
            });
            if (answer) {
                let sss = await Apply.updateOne({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
                answer = {
                    msg: "已同意该用户的好友请求",
                    status: 200
                }
            }
        }
        // 获取被申请者的用户资料，获取name属性，并将其作为nickName
        let tokenUser = await User.findOne({ _id: tokenRes.id })
        if (applyTable) {
            let applyResult = await Friend.updateOne({
                userID: applyId
            }, { $push: { friend_list: { user: tokenRes.id, nickName: tokenUser.name } } })
        } else {
            let c_s = await Friend.create({
                userID: applyId,
                friend_list: [{ "user": tokenRes.id, nickName: tokenUser.name }]
            });
        }
        res.send(answer)
    } else {
        let sss = await Apply.updateOne({ userID: tokenRes.id }, { $pull: { applyList: { applyId } } })
        res.send( {
            status: 400,
            msg: "已经拒绝该用户的请求"
        })
    }

}

// 获取好友列表
exports.getFriends = async function(token,data,res){
    let tokenRes = verifyToken(token);
    let friend = await Friend.findOne({ userID: tokenRes.id})

    if(friend){
        let result = await Friend.findOne({ userID: tokenRes.id }).populate("friend_list")
        let friendList = result.friend_list
        let val = {}
        // 生成大写字母并生成分组对象
        for (var i = 0; i < 26; i++) {
            let res = String.fromCharCode(65 + i);
            val[res] = []
        }
         // 将好友昵称文字转为拼音并将放入分组对象中
        for(let i =0;i<friendList.length;i++){
            let reg = new RegExp("^[a-zA-Z]")  //匹配备注是以字母开头的
            // let res = friendList[i].nickName.charAt(0).toUpperCase()
            let initial = null
            if(reg.test(friendList[i].nickName)){
                initial = friendList[i].nickName?.substr(0, 1)
            }else{  //备注是中文开头
                let pinyin = chineseToPinYin(friendList[i].nickName)
                initial = pinyin?.substr(0, 1)
            }
            initial = initial?.toUpperCase()
            val[initial]?.push(friendList[i])
            console.log(val)
        }
        res.send({
            status: 200,
            data: val,total:friendList.length,friend_list:friendList
        })
    }else{
        res.send({
            status:200,
            data:{},total:0
        })
    }


}
