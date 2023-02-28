const bcrypt = require('../dao/bcrypt');
const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const emailserver = require('../dao/emailserver')
const jwt = require('../dao/jwt')
const { deepClone } = require('../tool/loadsh')
const _ = require('lodash')

// 注册用户
exports.register = function(data,res){
    let wherestr = {'email':data.email}
    User.findOne(wherestr,function(err,result){
        if (result) {
            res.send({
                status: 400,
                msg: "该邮箱已经注册，请更换邮箱"
            })
        }else{
            // 密码加密
            let pwd = bcrypt.encryption(data.pwd)
            let result = {
                name: data.name,
                email: data.email,
                pwd: pwd
            }

            let user = new User(result);
            user.save(function (err, result) {
                if (err) {
                    res.send({ status: 400,msg:'注册失败' })
                } else {
                    // emailserver.emailSignUp(data.email, res)
                    res.send({ status: 200, msg: '注册成功' })
                }
            })
        }
    })
}


// 获取用户信息
exports.getUserInfo = async function(token,data,res){
    console.log('data',data)
    let resToken = jwt.verifyToken(token)
    let wherestr = { userID: resToken }
    let user = await User.findOne(wherestr,function(err,result){
        console.log('err',err,result)
        if(result){
            res.send({
                status:200,
                data:result
            })
        }else{
            res.send({
                status: 400,
                data: {msg:'用户不存在'}
            })
        }
    })
}


// 查找用户
exports.findUser = async function(token,data,res){
    let resToken = jwt.verifyToken(token)
    let obj ={}
    let userFriendList = []
    let wherestr = { $or: [{ name: { $regex: data.searchval } }, { email: { $regex: data.searchval } }] }
    // 获取用户的好友列表
    let userFriendMsg =  await Friend.findOne({userID:resToken.id})
    // userFriendList = userFriendMsg?.friend_list
    userFriendMsg?.friend_list.map(item => {
        userFriendList.push(item.user)
    })


    let out = { name: 1, email: 1, imgUrl: 1 }
    // 获取搜索结果返回的用户，判断是否为当前用户好友
    let otherFriends =  await User.find(wherestr,out)
    let cloneUserList = JSON.parse(JSON.stringify(userFriendList))
    let cloneSearchRes = JSON.parse(JSON.stringify(otherFriends))
    cloneSearchRes.map(item => {
        item.isFriend = 0
        cloneUserList.map(item2 => {
            console.log(item._id)
            console.log(item2)
            if(item._id.toString() == item2){
                item.isFriend =1
            }
        })
        return item
        // if (userFriendList.toString() === item._id.toString()){
        //     item.isFriend = 1
        // }
        // return item;
    })
    console.log('otherFriends', cloneSearchRes)

    // console.log(userFriendList)
    if(data.searchval){
        res.send({
            status: 200,
            data: cloneSearchRes
        })
    }else{
        res.send({
            status: 200,
            data: []
        })
    }

}
