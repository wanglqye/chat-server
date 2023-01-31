const dbserver  = require('../dao/dbserver')

// 用户搜索
exports.searchUser =  function(req,res){
  let token = req.headers.authorization
  let data = req.body.data;
  dbserver.searchUser(token,data,res);
}

// 判断是否为好友
exports.isFriend = function(req,res) {
  let {uid,fid} = req.body.data;
  dbserver.isFriend(uid, fid, res)
}

// 群搜索
exports.searchGroup = function (req, res) {
  let data = req.body.data
  dbserver.searchGroup(data, res)
}

// 判断是否为好友
exports.isInGroup = function(req,res) {
  let {uid,gid} = req.body.data;
  dbserver.isInGroup(uid, gid, res)
}
