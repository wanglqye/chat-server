const bcrypt = require('../dao/bcrypt');
const User = require("../model/userModel")
const emailserver = require('../dao/emailserver')

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
