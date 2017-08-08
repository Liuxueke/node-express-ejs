const refreshSessionId = require('../utils/refreshSessionId');
const requests=require('../utils/requests');

module.exports = {
  checkVerify:function (req,res,next){/*是否实名*/
    var param = 'recharge';
    (req.originalUrl == '/member/account/recharge')?(param='recharge'):((req.originalUrl == '/member/account/withdrawal')?(param='withdrawal'):(param='recharge'));
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/security/user/base_info',
        get:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      })
    }).then(function (result){
      req.session.userBaseInfo = result;
      if(result.verify == 0){
        //未实名
        res.redirect('/member/account/'+param+'/openAccount');
      }else{
        //已实名
        next();
      }
    }).catch(function (err){
      console.log(err);
    });
  },
  findPayPwdCheckVerify:function (req,res,next){
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/security/user/base_info',
        get:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      })
    }).then(function (result){
      if(result.verify == 0){
        //未实名
        res.redirect('/member/account/bankCard');
      }else{
        //已实名
        next();
      }
    }).catch(function (err){
      console.log(err);
    });
  },
  checkBindCard:function (req,res,next){
    var param = 'recharge';
    (req.originalUrl == '/member/account/recharge')?(param='recharge'):((req.originalUrl == '/member/account/withdrawal')?(param='withdrawal'):(param='recharge'));
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/security/user/base_info',
        get:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      })
    }).then(function (result){
      if(result.bindCard == 0){
        //未绑卡
        res.redirect('/member/account/'+param+'/openAccount');
      }else{
        //已绑卡
        next();
      }
    }).catch(function (err){
      console.log(err);
    });
  }
};