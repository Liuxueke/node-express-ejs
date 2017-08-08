const express = require('express');
const router = express.Router();
const requestCatalog = require('../utils/requestCatalog');
const requests=require('../utils/requests');
const checkLoginStatus = require('../utils/checkLoginStatus');
const refreshSessionId = require('../utils/refreshSessionId');
const promise = require('bluebird');
const city = require('../utils/city');
const borrowerRequest = require('../utils/borrower/request');
const refreshBorrowerSessionId = require('../utils/borrower/refreshBorrowerSessionId');//刷新借款人sessionId
const request = require('request');
const config = require('../config');

/*登录*/
router.post('/login',function (req,res,next){
  requests(req,{
    url:'/login/user/login',
    type:'post',
    data:req.body
  }).then(function (result){
    //登录成功
    if(!result['error_code']){
      var updateTime = new Date().getTime();
      req.session.loginInfo = Object.assign(result,{updateTime: updateTime});
      //判断登录页入口 start
      var src = '/';
      if(!req.session.nextUrl){
        src = '/'
      }else{
        if(req.session.nextUrl.indexOf("member") == 1){//从个人中心进入
          src = '/member'
        }else if(req.session.nextUrl.indexOf("findPayPassword") == 1){//从修改交易密码进入
          src = '/findPayPassword'
        }else if(req.session.nextUrl.indexOf("payment") == 1){//从下单页进入
          var productID = req.session.nextUrl.replace(/[^\d]/g, '');
          src = '/detail/'+productID
        }
      }
    /*  console.log(req.cookie('sessionid_cook_key'))*/
      res.cookie('sessionid_cook_key',result.sessionId);
      //判断登录页入口 end
      res.json({'code': 'iss.success', 'src': src,"mobile":result.mobile.substr(0,3)+"****"+result.mobile.substr(7,4)});
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function (err){
    res.json({'code': 'iss.error', 'msg': '接口错误'});
  });
});
/*判断登录状态*/
router.post('/check_login',function (req,res,next){
    checkLoginStatus.checkLogin(req,res,next).then(function (result) {
      if(result){
        res.json({"code":"iss.success","msg":"已登录"});
      }else{
        res.json({"code":"iss.error","msg":"未登录"})
      }
    }).catch(function (err) {
      res.json({"code":"iss.error","msg":"未登录"})
    });
});
/*登录-判断手机号是否已注册*/
router.post('/username/valid',function(req,res,next){
  requests(req,{
    url:'/login/username/valid',
    type:'get',
    data:req.body
  }).then(function(result){
    if(result.error_code == '000000'){
      res.json({ 'code': 'iss.success', 'msg': '成功'});
    }else{
      res.json({ 'code': 'isv.username-not-exist', 'msg': result.error_msg});
    }
  })
});
/*退出登录*/
router.post('/login_out',function (req,res,next){
  if(req.session && req.session.loginInfo){
    requests(req,{
      url:'/login/user/logout',
      type:'get',
      data:{
        sessionid:req.session.loginInfo.sessionId
      }
    }).then(function (result){
      if(!result.isLogin || result['error_code']=='000000'){
        req.session.destroy();
        res.clearCookie('sessionid_cook_key');
        res.json({"code":"iss.success","msg":"请求成功"});
      }else{
        res.json({"code":"iss.error","msg":result['error_msg']});
      }
    }).catch(function (err){
      res.json({"code":"iss.error","msg":"系统错误","err":err});
    })
  }else{
    req.session.destroy();
    res.json({"code":"iss.success","msg":"请求成功"});
  }

});
/*获取未读消息数*/
router.post('/get_message_number',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/message/message/private_count',
      type:'get',
      data:{
        sessionid:req.session.loginInfo.sessionId,
        type:0
      }
    });
  }).then(function (result){
    if(!result['error_code']){
      req.session.loginInfo.messages=result.privateCount;
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      req.session.loginInfo.messages=0;
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    req.session.loginInfo.messages=0;
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*注册验证手机号*/
router.post('/register/valid_mobile',function (req,res,next){
  requests(req,{
    url:'/register/register/valid_mobile',
    type:'get',
    data:req.body
  }).then(function (result){
    if(result['error_code'] == '000000'){
      res.json({"code":"iss.success","msg":"请求成功"})
    }else{
      res.json({"code":"isv.mobile-register-exist","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json(err)
  });
});
/*注册获取短信验证码*/
router.post('/register/send',function (req,res,next){
  var data = {
    mobile:req.body.mobile
  };
  requests(req,{
    url:'/register/register/get_checkcode_web',
    type:'get',
    data:data
  }).then(function (result){
    if(result['error_code'] == '000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":err});
  });
});
/*注册验证短信验证码完成注册*/
router.post('/register/signup',function (req,res,next){
  var data = {
    mobile:req.body.username,
    password:req.body.password,
    checkcode:req.body.captcha,
    referee:req.body.recommondPersonTel
  };
  requests(req,{
    url:'/register/register/set_pwd_web',
    type:'post',
    data:data
  }).then(function (result){
    if(result.orderNo){
      req.session.registerSuccessUrl=true;
      req.session.orderNo=result.orderNo;
      req.session.registerInfo={
        username:req.body.username,
        password:req.body.password
      };
      res.json({"code":"iss.success","orderNo":result.orderNo});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']})
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"网络出错啦","err":err});
  });
});
/*注册异步状态查询*/
router.post('/check_status',function (req,res,next){
  requests(req,{
    url:'/general/user/state_query',
    type:'get',
    data:{order_no:req.body.order_no}
  }).then(function (result){
    if(!result['error_code']){
      if(result.state==4){
        res.json({"code":"iss.success","state":result.state,"registerInfo":req.session.registerInfo});
      }else{
        res.json({"code":"iss.success","state":result.state});
      }
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*订单号状态查询*/
router.post('/check_state',function (req,res,next) {
  requests(req,{
    url:'/general/user/state_query',
    type:'get',
    data:req.body
  }).then(function (result) {
    if(!result['error_code']){
      res.json({"code":"iss.success","state":result.state});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err) {
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*快捷充值获取短信验证码*/
router.post('/order/get_order_no',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/deposit/order/get_order_no',
      type:'get',
      data:{
        sessionid:req.session.loginInfo.sessionId
      }
    });
  }).then(function (result){
    if(!result['error_code']){
      var data=Object.assign(req.body,{
        order_no:result.noOrder,
        sessionid:req.session.loginInfo.sessionId
      });
      return requests(req,{
        url:'/deposit/shop_deposit/prepare',
        type:'get',
        data:data
      });
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","orderNo":result.noOrder})
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']})
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err})
  })
});
/*快捷充值确认充值*/
router.post('/quickRecharge_confirm',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:'/deposit/shop_deposit/confirm',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","orderNo":result.orderNo,"status":result.status});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*网银预充值*/
router.post('/net_recharge/prepare',function (req,res,next){
  var orderNo='';
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/deposit/order/get_order_no',
      type:'get',
      data:{
        sessionid:req.session.loginInfo.sessionId
      }
    })
  }).then(function (result){
    if(!result['error_code']){
      var data=Object.assign(req.body,{
        order_no:result.noOrder,
        sessionid:req.session.loginInfo.sessionId
      });
      orderNo=result.noOrder;
      return requests(req,{
        url:'/deposit/online_deposit/prepare',
        type:'get',
        data:data
      });
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).then(function (result){
    if(!result['error_code']){
      req.session.netRechargeInfo=result;
      req.session.netRechargeInfo.orderNo=orderNo;
      req.session.netRechargeInfo.amt=req.body.amount;
      res.json({"code":"iss.success","msg":"请求成功"})
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":'系统错误',"err":err});
  });
});
/*查询充值状态*/
router.post('/check/recharge_status',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data={
      sessionid:req.session.loginInfo.sessionId,
      order_no:req.body.orderNo
    };
    return requests(req,{
      url:'/deposit/shop_deposit/status',
      type:'get',
      data:data
    })
  }).then(function (result){
      if(!result['error_code']){
        res.json({"code":"iss.success","status":result.status,"orderNo":result.orderNo});
      }else{
        res.json({"code":"iss.error","msg":result['error_msg']});
      }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*绑卡验证银行卡号*/
router.post('/bank_card_bin/check',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:'/deposit/bank_card/bin',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","netBankLogo":result.netBankLogo,"bankName":result.bankName});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*绑卡获取短信验证码*/
router.post('/bind_card/message_code',function (req,res,next){
  /*请求后台预绑卡接口*/
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/deposit/order/get_order_no',
      type:'get',
      data:{
        sessionid:req.session.loginInfo.sessionId
      }
    });
  }).then(function (result){
    if(!result['error_code']){
      var idCode='';
      var name = '';
      var data = {
        order_no:result.noOrder,
        bank_card_no:req.body.bank_card_no,
        mobile:req.body.mobile,
        id_code:req['body']['id_code'],
        name:req.body.name,
        sessionid:req.session.loginInfo.sessionId
      };
      console.log(data)
      return requests(req,{
        url:'/deposit/card_bind/prepare',
        type:'post',
        data:data
      });
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).then(function (result){
    console.log(result)
    if(!result['error_code']){
      res.json({"code":"iss.success","msg":"验证码已发送","status":result.status,"orderNo":result.noOrder});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","err":err,"msg":"系统错误"})
  });

});
/*绑卡确认*/
router.post('/bind_card/confirm',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:'/deposit/card_bind/confirm',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","orderNo":result['noOrder'],"status":result.status});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*支付预校验*/
router.post('/pre_pay',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/pay/pay/prepay',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json(Object.assign(result,{"code":"iss.success"}));
    }else{
      res.json(Object.assign(result,{"code":"iss.error"}));
    }
  }).catch(function (err){
    res.json({"code":"iss.error","err_code":0,"err_msg":"系统错误","err":err});
  })
});
//支付页面-获取用户信息
router.get('/user/base_info', function(req, res, next){
  refreshSessionId(req).then(function (){
    var sessionid = req.session.loginInfo.sessionId;
    return promise.all([requests(req,{
      url:'/security/user/base_info',
      type:'get',
      data:{
        sessionid:sessionid
      }
    }),requests(req,{
      url:'/wallet/wallet/balance_list',
      type:'get',
      data:{
        sessionid:sessionid
      }
    })]);
  }).then(function (result){
    if(!result[0]['error_code'] && !result[1]['error_code']){
      res.json({
        "code":"iss.success",
        "verify": result[0].verify,
        "bindPayPassword": result[0].bindPayPassword,
        "riskGrade": result[0].riskGrade,
        "startAmount": req.session.productDetails.partInvestAmount,
        "leftInvest": req.session.productDetails.surplusInvestAmount,
        "availableBalance": result[1].totalAmount,
        "discount": req.session.productDetails.passbookType,
      });
    }else if(!result[0]['error_code'] && result[1]['error_code']){
      if(result[1]['error_code'] == 400016){
        res.json({
          "code":"iss.success",
          "verify": result[0].verify,
          "bindPayPassword": result[0].bindPayPassword,
          "riskGrade": result[0].riskGrade,
          "startAmount": req.session.productDetails.partInvestAmount,
          "leftInvest": req.session.productDetails.surplusInvestAmount,
          "availableBalance": 0,
          "discount": req.session.productDetails.passbookType,
        });
      }else{
        res.json({"code":"iss.error","msg":result[1]['error_msg']});
      }
    }else if(result[0]['error_code'] && !result[1]['error_code']){
      res.json({"code":"iss.error","msg":result[0]['error_msg']});
    }else{
      res.json({"code":"iss.error","msg":result[0]['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
//支付页面-投资支付
router.post('/pay/pay', function(req, res, next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/pay/pay/pay',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","partId":result.partId,"status":result.status});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*支付成功*/
router.post('/pay/success',function (req,res,next) {
  refreshSessionId(req).then(function () {
    return requests(req,{
      url:'/pay/pay/asyn_search',
      type:'get',
      data:{
        part_id:req.body.orderNo,
        session_id:req.session.loginInfo.sessionId
      }
    });
  }).then(function (result) {
    if(!result['error_code']){
      res.json({"code":"iss.success","remainDayNum":result.remainDayNum,"paySuccessTime":result.paySuccessTime})
    }else{
      res.json({"code":"iss.error","msg":result['error_code']});
    }
  }).catch(function (err) {
    res.json({"code":"iss.error","msg":"系统错误","err":err})
  })
})
/*获取产品列表*/
router.post('/product/sale_list',function (req,res,next){
  requestCatalog.getProductList(req).then(function (result){
    res.json(Object.assign(result,{"code":"iss.success"}));
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*获取售罄产品列表*/
router.post('/product/sell_well',function (req,res,next){
  requests(req,{
    url:'/product/product/sold_list',
    type:'get',
    data:req.body
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*提现申请*/
router.post('/withdraw/apply',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/withdrawal/cash/apply',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json(Object.assign({"code":"iss.success"},result))
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*提现确认*/
router.post('/withdraw/confirm',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/withdrawal/cash/confirm',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      req.session.withDrawStatus=true;
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*更换手机号获取验证码*/
router.post('/changeTel/getCode',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/security/smscode/get_code_old_mobile',
      type:'get',
      data:{sessionid:req.session.loginInfo.sessionId,mobile:req.body.mobile}
    })
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*更换手机号验证验证码*/
router.post('/changeTel/checkCode',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:'/security/smscode/valid_old_mobile',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*更换手机号新手机号获取短信验证码*/
router.post('/changeTel/getCode_new',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/smscode/get_code_new_mobile',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"})
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*更换手机号新手机号验证短信验证码*/
router.post('/changeTel/checkCode_new',function (req,res,next){
  var mobile='';
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    mobile=req.body.mobile;
    return requests(req,{
      url:'/security/smscode/valid_new_mobile',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      req.session.loginInfo.mobile=mobile;
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*修改登录密码*/
router.post('/change_pwd/login_pwd',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/user/change_pwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*修改交易密码*/
router.post('/change_pwd/pay_pwd',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/user/change_paypwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误"});
  })
});
/*设置交易密码获取短信验证码*/
router.post('/setPayPwd/getCode',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/security/smscode/get_code_set_paypwd',
      type:'get',
      data:{sessionid:req.session.loginInfo.sessionId}
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置交易密码验证短信验证码*/
router.post('/setPayPwd/checkCode',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/smscode/valid_set_paypwd',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置交易密码*/
router.post('/setPayPwd',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/user/web_first_set_paypwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置交易密码（无需短信验证码）*/
router.post('/setPayPwd/web_first',function (req,res,next) {
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/user/first_set_paypwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*忘记登录密码获取短信验证码*/
router.post('/find_login_pwd/get_message_code',function (req,res,next){
  requests(req,{
    url:'/security/smscode/get_code_find_pwd',
    type:'get',
    data:req.body
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","verify":result.verify});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*忘记登录密码验证短信验证码*/
router.post('/find_login_pwd/check_message_code',function (req,res,next){
  requests(req,{
    url:'/security/smscode/valid_find_pwd',
    type:'post',
    data:req.body
  }).then(function (result){
    if(result['error_code']=='000000'){
      req.session.findLoginPwd={
        step:1,
        mobile:req.body.mobile
      };
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置新登录密码*/
router.post('/find_login_pwd/get_new_pwd',function (req,res,next){
  requests(req,{
    url:'/security/user/set_new_password',
    type:'post',
    data:{
      password:req.body.password,
      mobile:req.session.findLoginPwd.mobile
    }
  }).then(function (result){
    if(result['error_code']=='000000'){
      req.session.findLoginPwd.step=2;
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*找回交易密码获取短信验证码*/
router.post('/find_pay_pwd/get_message_code',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/smscode/get_code_find_paypwd',
      type:'get',
      data:data
    })
  }).then(function (result){
    if(result['error_code']=='000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*找回交易密码验证短信验证码*/
router.post('/find_pay_pwd/check_message_code',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/security/smscode/valid_find_paypwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      req.session.findPayPwd={
        step:1,
        mobile:req.body.mobile
      };
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置新的交易密码*/
router.post('/find_pay_pwd/set_new_pwd',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data={
      password:req.body.password,
      sessionid:req.session.loginInfo.sessionId
    };
    return requests(req,{
      url:'/security/user/set_new_paypwd',
      type:'post',
      data:data
    });
  }).then(function (result){
    if(result['error_code']=='000000'){
      req.session.findPayPwd.step=2;
      res.json({"code":"iss.success","msg":"请求成功"})
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*资金明细分页*/
router.post('/get_account_flow',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/wallet/wallet/account_flow',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  });
});
/*资金明细历史账单分页*/
router.post('/get_account_flow/history',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data=Object.assign(req.body,{
      sessionid:req.session.loginInfo.sessionId
    });
    return requests(req,{
      url:'/wallet/wallet/old_balance_list',
      type:'get',
      data:data
    });
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*充值记录列表--------------------------------------------------------------------------------充值记录总条数*/
router.post('/recharge_list',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data = Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:"/wallet/recharge/list",
      type:'get',
      data:data
    })
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalSize":10});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*提现记录列表--------------------------------------------------------------------------------提现记录总条数*/
router.post('/withdrawal_list',function (req,res,next){
  refreshSessionId(req).then(function (){
    var data = Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    return requests(req,{
      url:'/withdrawal/cash/list',
      type:'get',
      data:data
    })
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalSize":10});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置用户名*/
router.post('/edit_userName',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/security/user/set_username',
      type:'get',
      data:{sessionid:req.session.loginInfo.sessionId,username:req.body.username}
    })
  }).then(function (result){
    if(result['error_code'] === '000000'){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"success":false,"err":err})
  })
});
/*获取消息列表*/
router.post('/get_message_list',function (req,res,next){
  var type = req.query.type;
  if(type == 0){
    requests(req,{
      url:'/message/message/notice_list',
      type:'get',
      data:req.body
    }).then(function (result){
      if(!result['error_code']){
        res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage})
      }else{
        res.json({"code":"iss.error","msg":result['error_msg']})
      }
    }).catch(function (err){
      res.json({"code":"iss.error","err":err,"msg":"系统错误"})
    });
  }else{
    refreshSessionId(req).then(function (){
      var data = Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId,type:req.query.type});
      return requests(req,{
        url:'/message/message/private_list',
        type:'get',
        data:data
      })
    }).then(function (result){
      res.json({"code":"iss.success","list":result.list});
    }).catch(function (err){
      res.json({"code":"iss.error","err":err,"msg":"系统错误"})
    });
  }
});
/*我的投资*/
router.post('/my_investment',function (req,res,next){
  var type = req.body.type;
  refreshSessionId(req).then(function (){
    var data = Object.assign(req.body,{sessionid:req.session.loginInfo.sessionId});
    if(type == 0 || type == 1){
      return requests(req,{
        url:'/wallet/wallet/part_list',
        type:'get',
        data:data
      })
    }else{
      return requests(req,{
        url:'/wallet/wallet/hold_acccount_list',
        type:'get',
        data:data
      })
    }
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }

  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*获取图片验证码*/
router.get('/getImg',requestCatalog.getCodeImg);
/*验证图片验证码*/
router.post('/checkImg',function (req,res,next){
  var data = {
    uuid:req.session.imgUuid,
    captcha:req.body.captcha
  };
  requestCatalog.checkImg(req,data).then(function (result){
    if(result['error_code'] == "000000"){
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']})
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"图片验证码验证失败","err":err})
  });
});
//优惠券
router.post('/passbook/list', function(req, res, next){
  refreshSessionId(req).then(function (){
    var data = Object.assign(req.body, { sessionid: req.session.loginInfo.sessionId });
    return requests(req,{
      url:'/wallet/passbook/list_web',
      type:'get',
      data:data
    })
  }).then(function(result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list,"totalPage":result.totalPage});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function(err){
    res.json({ 'code': 'iss.error', 'msg': '系统错误',"err":err});
  })
});
/*成长值获取记录翻页*/
router.post('/growth_list',function (req,res,next){
  refreshSessionId(req).then(function (){
    return requests(req,{
      url:'/member/user/grow_list',
      type:'get',
      data:Object.assign(req.body,{
        sessionid:req.session.loginInfo.sessionId
      })
    })
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","list":result.list});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err){
    res.json({"code":"iss.error","msg":"系统错误","err":err});
  })
});
/*设置交易密码*/
router.post("/user/first_pay_password",function (req,res,next) {
  refreshSessionId(req).then(function () {
    return requests(req,{
      url:'/security/user/first_set_paypwd',
      type:'post',
      data:{
        sessionid:req.session.loginInfo.sessionId,
        password:req.body.password
      }
    })
  }).then(function (result) {
    if(!result['error_code']){
      res.json({"code":"iss.success","msg":"设置交易密码成功"})
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function (err) {
    res.json({"code":"iss.error","msg":"系统错误","err":err})
  })
});


//借款人项目
//登录
router.post('/borrower_login', function(req,res,next){
  borrowerRequest(req,{
    type: 'post',
    url: '/login/user/login',
    data: req.body
  }).then(function(result){
    if(!result['error_code']){
      var updateTime = new Date().getTime();
      req.session.borrowerLoginInfo = Object.assign(result,{updateTime: updateTime});
      res.json({'code': 'iss.success', 'msg': '请求成功'})
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']})
    }
  }).catch(function(){
    res.json({'code': 'iss.error', 'msg': '接口出错'});
  });
});
//登出
router.post('/borrower/user/logout', function(req,res,next){
  borrowerRequest(req,{
    type: 'get',
    url: '/login/user/logout',
    data: {
      sessionid: req.session.borrowerLoginInfo.sessionId
    }
  }).then(function(result){
    if(result['error_code'] == '000000'){
      if(req.session.borrowerLoginInfo){
        req.session.destroy();
      }
      res.json({"code":"iss.success","msg":"请求成功"});
    }else{
      res.json({"code":"iss.error","msg":result['error_msg']});
    }
  }).catch(function(){
    res.json({'code': 'iss.error', 'msg': '接口出错'});
  })
});

//标的管理
router.post('/bid/bid_list',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/product/bid/bid_list',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//标的确认支付
router.post('/repayment/pay', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/pay/repayment/pay',
      data: {
        bid_id: req.body.bid_id,
        sessionid: req.session.borrowerLoginInfo.sessionId
      }
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json({'code': 'iss.success','orderNo': result['orderNo']});
      req.session.bid_idOrderNo = result['orderNo'];
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//项目服务费支付确认
router.post('/pay_charge/pay', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/pay/pay_charge/pay',
      data: {
        project_id: req.body.project_id,
        sessionid: req.session.borrowerLoginInfo.sessionId
      }
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json({'code': 'iss.success','orderNo': result['orderNo']});
      req.session.projectOrderNo = result['orderNo'];
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});

//项目管理
router.post('/project/project_list', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/product/project/project_list',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//个人信息
router.post('/borrower/base_info', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/product/borrower/base_info',
      data: {
        sessionid: req.session.borrowerLoginInfo.sessionId
      },
      type: 'get'
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//快捷充值-预充值
router.post('/shop_deposit_finance/prepare',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/deposit/shop_deposit_finance/prepare',
      type: 'get',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code'] == null){
      res.json({'code':'iss.success','noOrder': result.noOrder, 'status': result.status});
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//快捷充值-确认充值
router.post('/shop_deposit/finance/confirm',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/deposit/shop_deposit_finance/confirm',
      type: 'post',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result["error_code"] == null){
      req.session.borrowerRecharge_orderNo = result.orderNo;
      res.json({'code': 'iss.success', 'orderNo': result.orderNo, 'status': result.status});
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//充值状态查询
router.post('/borrower/state_query', function(req, res, next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/general/user/state_query',
      type: 'get',
      data: Object.assign(req.body)
    });
  }).then(function(result){
    if(result["error_code"] == null){
      res.json({'code': 'iss.success', "status": result.state});
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']})
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});

//网银充值-预充值
router.post('/online_deposit_finance/prepare',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/deposit/online_deposit_finance/prepare',
      type: 'get',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code'] == null){
      req.session.eBank = result;
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//修改登录密码
router.post('/user/change_pwd', function(req, res, next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req, {
      type: 'post',
      url: '/security/user/change_pwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    res.json({ 'code': result['error_code'], 'msg': result['error_msg']});
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});

//设置交易密码--获取短信验证码
router.post('/borrower/smscode/get_code_set_paypwd', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
  return borrowerRequest(req,{
    type: 'get',
    url: '/security/smscode/get_code_set_paypwd',
    data:{
      sessionid: req.session.borrowerLoginInfo.sessionId
    }
  });
  }).then(function(result){
    if(result['error_code']=='000000'){
      res.json({'code': 'iss.success','msg': result['error_msg']});
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//设置交易密码--验证短信码
router.post('/borrower/smscode/valid_set_paypwd', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/security/smscode/valid_set_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code']=='000000'){
      res.json({'code': 'iss.success','msg': result['error_msg']});
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//设置交易密码
router.post('/borrower/user/first_set_paypwd', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'post',
      url: '/security/user/first_set_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    res.json({ 'code': result['error_code'], 'msg': result['error_msg']});
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});

//修改交易密码
router.post('/borrower/user/change_paypwd', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'post',
      url: '/security/user/change_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    res.json({ 'code': result['error_code'], 'msg': result['error_msg']});
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//提现-提现申请
router.post('/borrower/finance_cash/apply', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/withdrawal/finance_cash/apply',
      type: 'get',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//提现-确认提现
router.post('/borrower/finance_cash/confirm', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      url: '/withdrawal/finance_cash/confirm',
      type: 'post',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(!result['error_code']){
      res.json(result);
    }else{
      res.json({'code':result['error_code'],'msg':result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//账户流水
router.post('/borrower/account_list', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req, {
      type: 'get',
      url:'/wallet/borrower/account_list',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result["error_code"]){
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }else{
      res.json(result);
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});

//忘记登录密码-获取短信验证码
router.post('/borrower/smscode/get_code_find_pwd', function(req,res,next){
  borrowerRequest(req,{
    type: 'get',
    url: '/security/smscode/get_code_find_pwd',
    data: req.body
  }).then(function(result){
    if(!result['code_error']){
      res.json({'code': 'iss.success', 'verify': result["verify"]});
    }else{
      res.json({'code': result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(){
    res.json({'code':'iss.error','msg':'接口出错'});
  });
});
//忘记登录密码--验证短信码
router.post('/borrower/smscode/valid_find_pwd',function(req,res,next){
  borrowerRequest(req,{
    type: 'post',
    url: '/security/smscode/valid_find_pwd',
    data: {
      mobile: req.body.mobile,
      check_code: req.body.check_code,
      identity_card: req.body.identity_card
    }
  }).then(function(result){
    if(result['error_code'] == '000000'){
      req.session.findLoginPassTel = req.body.mobile;
      req.session.step = 1;
      res.json({'code': 'iss.success', 'msg': result['error_msg']});
    }else{
      res.json({'code':result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(){
    res.json({'code':'iss.error','msg':'接口出错'});
  })
});
//忘记登录密码---设置新的登录密码
router.post('/borrower/user/set_new_password', function(req,res,next){
  borrowerRequest(req,{
    type: 'post',
    url: '/security/user/set_new_password',
    data: {
      mobile: req.session.findLoginPassTel,
      password: req.body.password
    }
  }).then(function(result){
    if(result['error_code'] == '000000'){
      req.session.step = null;
      res.json({'code': 'iss.success', 'msg': result['error_msg']});
    }else{
      res.json({'code':result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(){
    res.json({'code':'iss.error','msg':'接口出错'});
  })
});
//忘记交易密码---获取短信验证码
router.post('/borrower/smscode/get_code_find_paypwd', function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'get',
      url: '/security/smscode/get_code_find_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code'] == '000000'){
      res.json({'code': 'iss.success', 'msg': result['error_msg']});
    }else{
      res.json({'code':result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//忘记交易密码---验证短信码
router.post('/borrower/smscode/valid_find_paypwd',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'post',
      url: '/security/smscode/valid_find_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code'] == '000000'){
      req.session.PayStep = 1;
      res.json({'code': 'iss.success', 'msg': result['error_msg']});
    }else{
      res.json({'code':result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//忘记交易密码---设置新的交易密码
router.post('/borrower/user/set_new_paypwd',function(req,res,next){
  refreshBorrowerSessionId(req).then(function(){
    return borrowerRequest(req,{
      type: 'post',
      url: '/security/user/set_new_paypwd',
      data: Object.assign(req.body, { sessionid: req.session.borrowerLoginInfo.sessionId})
    });
  }).then(function(result){
    if(result['error_code'] == '000000'){
      req.session.PayStep = null;
      res.json({'code': 'iss.success', 'msg': result['error_msg']});
    }else{
      res.json({'code':result['error_code'], 'msg': result['error_msg']});
    }
  }).catch(function(err){
    res.json({'code':'iss.error','msg':'接口出错', 'err': err });
  });
});
//请求登录条html
router.post('/ajax_status',function (req,res,next){
  var messages=0;
  if(req.session.loginInfo){
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/message/message/private_count',
        type:'get',
        data:{
          sessionid:req.session.loginInfo.sessionId,
          type:0
        }
      });
    }).then(function (result){
      if(!result['error_code']){
        messages=result.privateCount;
      }else{
        messages=0;
      }
      renderFun({
        loginInfo:req.session.loginInfo,
        layout:false,
        messages:messages
      })
    }).catch(function (err){
      renderFun({
        loginInfo:req.session.loginInfo,
        layout:false,
        messages:messages
      })
    })
  }else{
    renderFun({
      loginInfo:null,
      layout:false,
      messages:0
    })
  }
  function renderFun(data){
    res.render('../views/site/common/loginBar',data);
  }

});
//首页登录框
router.post('/quick_login',function (req,res,next){
  var loginInfo='';
  (req.session.loginInfo)?(loginInfo=req.session.loginInfo):(loginInfo='');
  let renderData={
    loginInfo:loginInfo,
    layout:false
  };
  res.render('../views/site/common/indexLoginBox',renderData);
})
//首页请求产品列表
router.post('/product_list',function (req,res,next){
  requestCatalog.getProductList(req).then(function (result){
    let renderData = {
      activeIndex:0,
      newProductList:result.newProductList,
      productList:result.productList,
      layout:false
    };
    res.render('../views/site/common/productList',renderData);
  }).catch(function (err){

  })
});
//详情页募集进度条
router.post('/detail_invest',function (req,res,next){
 refreshSessionId(req).then(function (){
   return requests(req,{
     type:'get',
     url:'/product/product/detail',
     data:{product_id:req.body.productId}
   })
 }).then(function (result){
   if(!result['error_code']){
     let renderData = {
       page:{
         loginInfo: req.session.loginInfo,
         title:"产品详情"
       },
       activeIndex:1,
       productDetails: result,
       payment_id:req.body.productId,
       layout:false
     };
     res.render('../views/site/common/detailInvest',renderData)
   }else{
     res.render('../views/site/common/netWorkError',{layout:false});
   }
 }).catch(function (err){
   res.render('../views/site/common/netWorkError',{layout:false});
 })
});
//详情页投资记录
router.post('/detail_record',function (req,res,next){
  requests(req,{
    url:'/product/part/invest_list',
    type:'get',
    data:{
      product_id:req.body.productId
    }
  }).then(function (result){
    if(!result['error_code']){
      let renderData={
        layout:false,
        investRecord:result
      };
      res.render('../views/site/common/investRecord',renderData)
    }else{
      res.render('../views/site/common/netWorkError',{layout:false});
    }
  }).catch(function (err){
    res.render('../views/site/common/netWorkError',{layout:false});
  })

});
//首页数据披露
router.post('/getPlatformData',function (req,res,next){
  requests(req,{
    url:'/general/get_platform_data',
    type:'get',
    data:{},
  }).then(function (result){
    if(!result['error_code']){
      res.json({"code":"iss.success","cumulativeInvestment":result.cumulativeInvestment,"dividend":result.dividend,"registraters":result.registraters,"nowDate":result.nowDate})
    }else{
      res.json({"code":"iss.success","cumulativeInvestment":0,"dividend":0,"registraters":0,"nowDate":""});
    }
  }).catch(function (err){
    res.json({"code":"iss.success","cumulativeInvestment":0,"dividend":0,"registraters":0,"nowDate":""});
  });
});
/*活动接口*/
router.post('/specialtopic/invitation/baseInfo',function (req,res,next) {
  request({
    method:'post',
    url:config.activityServerUrl+'/specialtopic/invitation/baseInfo',
    data:{
      topicsecret:'43AD63AA972B2AA7EC73E8566BA3C5AB'
    },
    json:true
  },function (error,response,body){
    if(!error && response.statusCode == 200){
      if(body.code){
        res.json({"code":"iss.error","msg":body.message})
      }else{
        res.json({"code":"iss.success","invitate":body})
      }
    }else{
      res.json({"code":"iss.error","msg":"系统错误"})
    }
  });
});

module.exports = router;