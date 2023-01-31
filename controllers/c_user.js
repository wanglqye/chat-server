const bcrypt = require('../dao/bcrypt');
const User = require("../model/userModel")
const Friend = require("../model/friendModel")
const emailserver = require('../dao/emailserver')
const jwt = require('../dao/jwt')

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
                    emailserver.emailSignUp(data.email, res)
                    // res.send({ status: 200, msg: '注册成功' })
                }
            })
        }
    })
}


// 获取用户信息
exports.getUserInfo = function(data,res){
    let { id, token } = data;
    let tokenRes = verifyToken(token)
    let wherestr = { userID: tokenRes }
    let user = {}
    if(id){
        Friend.findOne(wherestr.populate("friend_list.user"),function(err,result){
            console.log('err',err)
            console.log('result',result)
            if(result){
                // 后续
            }
        })
    }
}


// 查找用户
exports.findUser = function(token,data,res){
    console.log('微为IE我IE')
    let resToken = jwt.verifyToken(token)
    console.log('toekn',resToken)
    console.log('data',data)
    let obj ={}
    // User.findOne({ email: data.email },function(err,result){
    //     if(result){
    //         console.log('result', result)
    //         obj ={
    //             _id: result._id,
    //             name: result.name,
    //             email: result.email,
    //             avatars: result.avatars,
    //             type: "user"
    //         }
    //     }
    // })
    let wherestr = { $or: [{ name: { $regex: data.searchval } }, { email: { $regex: data.searchval } }] }
    Friend.findOne({userID:resToken.id},function(err,result){
        if (result){
            let index = result.friend_list.findIndex(item => {
                console.log('查找好友',obj.id)
                return item.user == obj.id
            })
            if (index >= 0) {
                obj.isFriend = true
            } else {
                obj.isFriend = false
            }
        }else{
            obj.isFriend = false
        }
        // if (tokenUser.email == data.email) {
        //     obj.isFriend = true
        // }
    })
    let out = { name: 1, email: 1, imgUrl: 1 }
    User.find(wherestr,out,function(err,result){
        if (err) {
            res.send({ status: 500 })
        } else {
            let newRes = [...result]
            newRes.forEach(item => {
                item.isFriend = true
            })
            console.log('查找用户', newRes)


            res.send({ status: 200, data: newRes })
        }
    })
}
