const promise = require('bluebird');
const requestCatalog = require('../../utils/requestCatalog');

module.exports = function(req){
  return new promise(function(resolve, reject){
    if(req.session.borrowerLoginInfo){
      var loginedTime = new Date().getTime() - req.session.borrowerLoginInfo.updateTime;
      if(loginedTime < req.session.borrowerLoginInfo.expiredTime){
        //session未过期
        req.session.borrowerLoginInfo.updateTime = new Date().getTime();
        resolve();
      }else{
        //session过期
        requestCatalog.refreshSession(req,{once_sessionid:req.session.borrowerLoginInfo.onceSessionId}).then(function(result){
          //判断刷新session接口是否请求成功
          if(!result['error_code'] || result['error_code'] == '000000'){
            req.session.borrowerLoginInfo = Object.assign(result,{updateTime: new Date().getTime()});
            resolve()
          }else{
            req.session.borrowerLoginInfo = null;
            reject()
          }
        }).catch(function(err){
          req.session.borrowerLoginInfo = null;
          reject(err)
        })
      }
    }else{
      resolve();
    }
  });
};