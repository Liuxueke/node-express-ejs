const refreshSessionId = require('../utils/refreshSessionId');
const borrowerRefreshSessionId = require('../utils/borrower/refreshBorrowerSessionId');
const promise = require('bluebird');

module.exports = {
  checkLogin: function(req, res, next){
    return new promise(function (resolve,reject) {
      if(req.session.loginInfo){
        refreshSessionId(req).then(function () {
          resolve(true);
        }).catch(function () {
          resolve(false)
        })
      }else{
        resolve(false);
      }
    });
  },
  //借款人判断登录状态
  borrowerCheckLogin: function(req, res, next){
    return new promise(function(resolve,reject){
      if(req.session.borrowerLoginInfo){
        //已登录
        borrowerRefreshSessionId(req).then(function(){
          resolve(true);
        }).catch(function(){
          resolve(false);
        })
      }else{
        //未登录
        resolve(false);
      }
    });
  },
};