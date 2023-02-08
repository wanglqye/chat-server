const { verifyToken } = require("../dao/jwt");
const UserSocket = require('../model/userSocketModel')
const User = require('../model/userModel')




exports.socketFun = function(io,socket){
    // 将io和socket保存到全局变量
    global.io = io;
    global.socket = socket;

    // 登录链接
    socket.on('submit',async (data) => {
        let { id } = verifyToken(data)
        let result = await UserSocket.findOne({userId:id})
        if(result){
            await UserSocket.updateOne({userId:id},{socketId:socket.id})
        }else{
            await UserSocket.create({userId:id,socketId:socket.id})
        }
    })
    // 发送好友申请
    socket.on("sendDemand",async (data) => {
        let { id } = data
        let socketUser = await UserSocket.findOne({userId:id})
        io.to(socketUser.socketId).emit('receiveDemand')
    })

    // 好友申请通知
    socket.on("deal",async data => {
        let { applyId, operation, token } = data
        let tokenRes = verifyToken(token)
        let user = await User.findOne({_id:tokenRes.id})
        let socketUser = await UserSocket.findOne({userId:applyId})
        let name = user.name
        let opera = operation == 'agree' ? "同意" : "拒绝"
        io.to(socketUser.socketId).emit('notification',{
            msg:"用户" + name + opera +"添加你为好友！",
            date: new Date()
        })
    })

    // 发送消息
    socket.on('sendMsg', async (data) => {
        let { id,token,type,chatType,date,message } = data
        let tokenRes = verifyToken(token)
        let tokenUser = await User.findOne({_id:tokenRes.id})
        if(type == 'text' || type == 'location'){
            // 存储聊天记录
            let res = await saveChat(data)
        }

    })
}
