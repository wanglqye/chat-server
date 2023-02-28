const { verifyToken } = require("../dao/jwt");
const User = require('../model/userModel')
const Chat = require('../model/chatModel')
const Dialogue = require('../model/dialogueModel')
const GroupChat = require('../model/groupChatModel')


// 存储聊天记录
exports.saveChat = async data => {
    let { id,message,img,token,type,chatType,duration } = data;
    console.log('存储聊天记录',data)
    let tokenRes = verifyToken(token)
    let user = User.find({_id:tokenRes.id})
    // 私聊
    if(chatType == 'private'){
        let tokenChat = await Chat.findOne({ fromUser:tokenRes.id, toUser:id })
        let chatRes = ""
        if(tokenChat){
            let msg_list = tokenChat.msg_list

              // 防抖 删除录音和图片（超过指定存储时间将自动删除）
            // clearTimeout(timer)
            // timer = setTimeout(async () => {
            //     let basePath = "http://localhost:3000"
            //     // let basePath = "http://yemengs.cn"
            //     if (msg_list.length > 0) {
            //         msg_list.forEach(element => {
            //             if (element.type == "image") {
            //                 let distance = (new Date().getTime() - new Date(element.date).getTime())
            //                 if (distance > imgStorageTime) { //删除图片
            //                     let path = element.message.replace(basePath, "public")
            //                     if (fs.existsSync(path)) {
            //                         fs.unlinkSync(path);
            //                     }
            //                     path = element.img.replace(basePath, "public")
            //                     if (fs.existsSync(path)) {
            //                         fs.unlinkSync(path);
            //                     }
            //                     element.message = basePath + "/common/overdue.svg"
            //                     element.message = basePath + "/common/overdue.svg"
            //                 }
            //             } else if (element.type == "voice") { //删除录音
            //                 let distance = (new Date().getTime() - new Date(element.date).getTime()) / 1000
            //                 if (distance > voiceStorageTime) {
            //                     let path = element.message.replace(basePath, "public")
            //                     if (fs.existsSync(path)) {
            //                         fs.unlinkSync(path);
            //                     }
            //                     element.message = "过期已删除"
            //                 }
            //             }

            //         });
            //         chatRes = await Chat.updateOne({
            //             fromUser: tokenRes.id, toUser: id
            //         }, {
            //             $set: { msg_list }
            //         })
            //     }
            // }, time)

            msg_list.unshift({message,img,type,duration,belong:tokenRes.id,date:new Date()})
            chatRes = await Chat.updateOne({
                fromUser:tokenRes.id, toUser:id
            },{
                $set:{ msg_list}
            })
        }else{
            chatRes = await Chat.create({
                fromUser: tokenRes.id,
                toUser: id,
                msg_list:[
                    { message, img, type, duration, belong: tokenRes.id, date: new Date() }
                ]
            })
        }
        // 存储到好友的聊天表
        let friendChat = await Chat.findOne({ fromUser:id,toUser:tokenRes.id })
        if (friendChat){
            let msg_list = friendChat.msg_list
            msg_list.unshift({ message, img, type, duration, belong: tokenRes.id, date: new Date() })
            chatRes = await Chat.updateOne({
                fromUser:id,toUser:tokenRes.id
            },{
                $set: { msg_list }
            })
        }else{
            chatRes = await Chat.create({
                fromUser: id,
                toUser: tokenRes.id,
                msg_list: [
                    { message, img, type, duration, belong: tokenRes.id, date: new Date() }
                ]

            })
        }

        // 更新对话信息(token用户)
        let dialogRes = null
        let dialogToken = await Dialogue.findOne({ userID:tokenRes.id})
        if(dialogToken){
            let chat_list = dialogToken.chat_list
            let index = chat_list.findIndex(item => {
                return item.id == id
            })
            if (index >= 0) {
                chat_list[index].message = message
                chat_list[index].date = new Date()
                chat_list[index].msgType = type
                dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
            } else {
                chat_list.unshift({
                    id, type: chatType, msgType: type, message, date: new Date(), unRead: 0
                })
                dialogRes = await Dialogue.updateOne({ "userID": tokenRes.id }, { $set: { "chat_list": chat_list } })
            }
        }else{
            dialogRes = await Dialogue.create({
                "userID": tokenRes.id,
                "chat_list": [{ "id": id, "type": chatType, "msgType": type, "message": message, "date": new Date(), "unRead": 0 }]
            })
        }
        // 更新对话信息（好友）
        let dialogID = await Dialogue.findOne({ userID: id })
        if (dialogID) {
            let chat_list = dialogID.chat_list
            let index = chat_list.findIndex(item => {
                return item.id == tokenRes.id
            })
            if (index >= 0) {
                chat_list[index].message = message
                chat_list[index].date = new Date()
                chat_list[index].msgType = type
                chat_list[index].unRead = chat_list[index].unRead + 1
                dialogRes = await Dialogue.updateOne({ "userID": id }, { $set: { "chat_list": chat_list } })
            } else {
                chat_list.unshift({
                    id: tokenRes.id, type: chatType, msgType: type, message, date: new Date(), unRead: 1
                })
                dialogRes = await Dialogue.updateOne({ "userID": id }, { $set: { "chat_list": chat_list } })
            }
        } else {
            dialogRes = await Dialogue.create({
                "userID": id,
                "chat_list": [{ "id": tokenRes.id, "msgType": type, "type": chatType, "message": message, "date": new Date(), "unRead": 1 }]
            })
        }
    }else{
        // 群聊
        // let group_chat = await GroupChat.findOne({ groupID: id })
        // let chatRes = null
        // if (group_chat) {
        //     let msg_list = group_chat.msg_list
        //     msg_list.unshift({ message, img, duration, type, belong: tokenRes.id, date: new Date() })
        //     chatRes = await GroupChat.updateOne({
        //         groupID: id
        //     }, {
        //         $set: { msg_list }
        //     })
        // } else {
        //     chatRes = await GroupChat.create({
        //         "groupID": id,
        //         "msg_list": [{ message, img, duration, type, "belong": tokenRes.id, "date": new Date() }]
        //     })
        // }

        // if (chatRes.groupID || chatRes.nModified) {
        //     // 更新对话信息
        //     let group = await Group.findById(id)
        //     let user_list = group.user_list
        //     let mapRes = await Promise.all(user_list.map(async item => {

        //         let dialogRes = null
        //         let dialogToken = await Dialogue.findOne({ userID: item.user })
        //         if (dialogToken) {
        //             let chat_list = dialogToken.chat_list
        //             let index = chat_list.findIndex(item => {
        //                 return item.id == id
        //             })
        //             if (index >= 0) {
        //                 chat_list[index].message = message
        //                 chat_list[index].date = new Date()
        //                 chat_list[index].msgType = type
        //                 chat_list[index].from = user._id
        //                 if (tokenRes.id != item.user) {
        //                     chat_list[index].unRead = chat_list[index].unRead + 1
        //                 }
        //                 dialogRes = await Dialogue.updateOne({ "userID": item.user }, { $set: { "chat_list": chat_list } })
        //             } else {
        //                 chat_list.unshift({
        //                     id, from: user._id, type: chatType, msgType: type, message: message, date: new Date(), unRead: 1
        //                 })
        //                 dialogRes = await Dialogue.updateOne({ "userID": item.user }, { $set: { "chat_list": chat_list } })
        //             }
        //         } else {
        //             dialogRes = await Dialogue.create({
        //                 "userID": item.user,
        //                 "chat_list": [{ "id": id, "from": user._id, "type": chatType, "msgType": type, "message": message, "date": new Date(), "unRead": 1 }]
        //             })
        //         }
        //         return item
        //     }))

        // }
    }
}


// 排序的方法
function listSort(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
}
