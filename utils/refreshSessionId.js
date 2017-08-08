const promise = require('bluebird');
const requestCatalog = require('../utils/requestCatalog');
const requests=require('../utils/requests');

module.exports = function (req){
    return new promise(function (resolve, reject) {
      if(req.session.loginInfo) {
        var loginedTime = new Date().getTime() - req.session.loginInfo.updateTime;
        var expiredTime = req.session.loginInfo.expiredTime;
        ///var expiredTime = 6000;
        if (loginedTime < expiredTime) {
          //session未过期
          req.session.loginInfo.updateTime = new Date().getTime();
          resolve();
        } else {
          //session过期
          requestCatalog.refreshSession(req, {once_sessionid: req.session.loginInfo.onceSessionId}).then(function (result) {
            if(!result['error_code'] || result['error_code'] == '000000'){
              req.session.loginInfo = Object.assign(result, {updateTime: new Date().getTime()});
              return promise.all([requests(req, {
                url: '/security/user/base_info',
                type: 'get',
                data: {
                  sessionid: req.session.loginInfo.sessionId
                }
              }), requests(req, {
                url: '/message/message/private_count',
                type: 'get',
                data: {
                  sessionid: req.session.loginInfo.sessionId,
                  type: 0
                }
              })]);
            }else{
              req.session.loginInfo = null;
              reject()
            }
          }).then(function (result) {
            if (!result[0]['error_code']) {
              req.session.loginInfo.mobile = result[0].mobile;
              resolve();
            } else {
              req.session.loginInfo = null;
              reject()
            }
            if (!result[1]['error_code']) {
              req.session.loginInfo.messages = result[1].privateCount;
              resolve();
            } else {
              req.session.loginInfo = null;
              reject();
            }
          }).catch(function (err) {
            req.session.loginInfo = null;
            reject(err)
          });
        }
      }else{
        resolve();
      }
    })
};