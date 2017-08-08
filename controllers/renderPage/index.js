const ajax = require('../../utils/ajax');
const promise = require('bluebird');
const requestCatalog = require('../../utils/requestCatalog');
const refreshSessionId = require('../../utils/refreshSessionId');
const render404 = require('../../utils/render404');
const requests=require('../../utils/requests');
const encrypt=require('../../utils/encrypt');
module.exports = {
  index:function (req,res,next){
      res.render('site/index',{
        layout:false
      });
  },
  list:function (req,res,next){
    requestCatalog.getProductList(req).then(function (result){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:'产品列表'
        },
        activeIndex:1,
        newProductList:result.newProductList,
        productList:result.productList
      };
      res.render('site/list',renderData);
    }).catch(function (err){

    })
  },
  //产品详情页
  detail:function (req,res,next){
    res.render('site/productDetail/'+req.params.id,{layout:false})
  },
  /*个人中心首页*/
  member:function (req,res,next){
    refreshSessionId(req).then(function (){
      var data = {
        sessionid:req.session.loginInfo.sessionId
      };
      return promise.all([requests(req,{
        url:'/security/user/base_info',
        type:'get',
        data:data
      },res),requests(req,{
        url:'/wallet/wallet/account',
        type:'get',
        data:data
      },res),requests(req,{
        url:'/wallet/wallet/invest_info',
        type:'get',
        data:data
      },res)]);
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        if(!result[0]['error_code'] && !result[1]['error_code'] && !result[2]['error_code']){
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"个人中心"
            },
            activeIndex:5,
            memberIndex:[0],
            userInfo:result[0],
            walletAccount:result[1],
            investInfo:result[2],
            error:false
          };
          res.render('site/member',renderData)
        }else{
          render404(res);
        }
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"个人中心"
        },
        activeIndex:5,
        memberIndex:[0],
        error:true
      };
      res.render('site/member',renderData)
    });
  },
  /*充值页面*/
  recharge:function (req,res,next){
    refreshSessionId(req).then(function (){
      return promise.all([requests(req,{
        url:'/wallet/bankcard/list',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId,type:0}
      }),requests(req,{
        url:'/deposit/bank/list',
        type:'get',
        data:{ebank:true}
      }),requests(req,{
        url:'/wallet/wallet/balance_list',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      }),requests(req,{
        url:'/security/user/base_info',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      })]);
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result[0]['error_code'] && !result[1]['error_code'] && !result[2]['error_code'] && !result[3]['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"充值"
          },
          activeIndex:5,
          memberIndex:[1,0],
          bankList:result[0],
          netBnakList:result[1],
          balance:result[2],
          userBaseInfo:result[3],
          error:isError
        };
        res.render('site/member/account/recharge',renderData)
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"充值"
        },
        activeIndex:5,
        memberIndex:[1,0],
        error:true
      };
      res.render('site/member/account/recharge',renderData)
    });
  },
  /*网银充值*/
  netRecharge:function (req,res,next){
    var isError=true;
    if(req.session.netRechargeInfo){
      isError=false;
    }
    let renderData={
      page:{
        title:"网银充值"
      },
      netRechargeInfo:req.session.netRechargeInfo,
      error:isError
    };
    res.render('site/member/account/netRecharge',renderData);
  },
  /*充值成功*/
  rechargeSuccess:function (req,res,next){
    requests(req,{
      url:'/general/user/state_query',
      type:'get',
      data:{
        order_no:req.params.order
      }
    }).then(function (result) {
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        if(result.state == 5){
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"充值遇到问题"
            },
            activeIndex:5,
            memberIndex:[1,0],
            rechargeStart:2,
            orderNo:req.params.order,
            error:false
          };
          res.render('site/member/account/rechargeError',renderData)
        }else{
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"充值成功"
            },
            activeIndex:5,
            memberIndex:[1,0],
            rechargeStart:result,
            orderNo:req.params.order,
            error:false
          };
          res.render('site/member/account/rechargeSuccess',renderData)
        }
      });
    }).catch(function (err) {
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"充值成功"
        },
        activeIndex:5,
        memberIndex:[1,0],
        orderNo:req.params.order,
        error:true
      };
      res.render('site/member/account/rechargeSuccess',renderData)
    });
  },
  /*开户页面*/
  openAccount:function (req,res,next){
    var from = req.params.from;
    requests(req,{
      url:'/deposit/bank/list',
      type:'get',
      data:{}
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var cooperativeBank=[];
        if(!result['error_code']){
          cooperativeBank=result.list;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"开户"
          },
          activeIndex:5,
          memberIndex:[1,0],
          userBaseInfo:req.session.userBaseInfo,
          cooperativeBank:cooperativeBank
        };
        if(from == 'recharge'){
          renderData.memberIndex=[1,0]
        }else if(from == 'withdrawal'){
          renderData.memberIndex=[1,1]
        }
        res.render('site/member/account/openAccount',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"开户"
        },
        activeIndex:5,
        memberIndex:[1,0],
        userBaseInfo:null,
        cooperativeBank:[]
      };
      res.render('site/member/account/openAccount',renderData)
    })

  },
  /*开户成功*/
  openAccountSuccess:function (req,res,next){
    refreshSessionId(req).then(function () {
      return requests(req,{
        url:'/general/user/state_query',
        type:'get',
        data:{
          order_no:req.params.orderNo
        }
      })
    }).then(function (result) {
      if(!result['error_code']){
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"开户成功"
          },
          activeIndex:5,
          memberIndex:[0,0],
          state:result.state,
          orderNo:req.params.orderNo
        };
        res.render('site/member/account/openAccountSuccess',renderData)
      }else{
        render404(res);
      }
    }).catch(function (err) {
      render404(res);
    });
  },
  /*提现*/
  withdrawal:function (req,res,next){
    refreshSessionId(req).then(function (){
      var data = {
        sessionid:req.session.loginInfo.sessionId
      };
      return promise.all([requests(req,{
        url:'/wallet/wallet/account',
        type:'get',
        data:data
      }),requests(req,{
        url:'/wallet/bankcard/list',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId,type:0}
      }),requests(req,{
        url:'/withdrawal/cash/detail',
        type:'get',
        data:data
      })]);
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var error=true;
        if(!result[0]['error_code'] && !result[1]['error_code'] && !result[2]['error_code']){
          error=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"提现"
          },
          activeIndex:5,
          memberIndex:[1,1],
          walletAccount:result[0],
          bankCardList:result[1],
          withdrawalDetail:result[2],
          error:error
        };
        res.render('site/member/account/withdrawal',renderData);
      })
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"提现"
        },
        activeIndex:5,
        memberIndex:[1,1],
        error:true
      };
      res.render('site/member/account/withdrawal',renderData)
    });

  },
  /*提现成功*/
  withdrawalSuccess:function (req,res,next){
    if(req.session.withDrawStatus){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"提现成功"
        },
        activeIndex:5,
        memberIndex:[1,1]
      };
      res.render('site/member/account/withdrawalSuccess',renderData)
    }else{
      render404(res);
    }

  },
  /*资金明细*/
  transact:function (req,res,next){
    refreshSessionId(req).then(function (){
      var data={
        sessionid:req.session.loginInfo.sessionId,
        page_no:1,
        page_size:20
      };
      return requests(req,{
        url:'/wallet/wallet/account_flow',
        type:'get',
        data:data
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"资金明细"
          },
          activeIndex:5,
          memberIndex:[1,2],
          accountFlowList:result,
          error:isError
        };
        res.render('site/member/transact/index',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"资金明细"
        },
        activeIndex:5,
        memberIndex:[1,2],
        error:true
      };
      res.render('site/member/transact/index',renderData);
    })

  },
  /*资金明细历史账单*/
  transactHistory:function (req,res,next){
    refreshSessionId(req).then(function (){
      var data={
        sessionid:req.session.loginInfo.sessionId,
        page_no:1,
        page_size:20
      };
      return requests(req,{
        url:'/wallet/wallet/old_balance_list',
        type:'get',
        data:data
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"资金明细历史账单"
          },
          activeIndex:5,
          memberIndex:[1,2],
          accountFlowList:result,
          error:isError
        };
        res.render('site/member/transact/history',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"资金明细历史账单"
        },
        activeIndex:5,
        memberIndex:[1,2],
        error:true
      };
      res.render('site/member/transact/history',renderData);
    });

  },
  /*资金明细详情*/
  transactDetail:function (req,res,next){
    var orderNo=req.params.orderNo;
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/wallet/wallet/old_balance_detail',
        type:'get',
        data:{
          sessionid:req.session.loginInfo.sessionId,
          no_order:orderNo
        }
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"交易记录详情"
          },
          activeIndex:5,
          memberIndex:[1,2],
          transactDetail:result,
          error:isError
        };
        res.render('site/member/transact/detail',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"交易记录详情"
        },
        activeIndex:5,
        memberIndex:[1,2],
        transactDetail:null,
        error:true
      };
      res.render('site/member/transact/detail',renderData);
    });
  },
  /*充值提现记录*/
  prepaid:function (req,res,next){
    refreshSessionId(req).then(function (){
      var rechargeListData = {
        page_no:1,
        page_size:10,
        sessionid:req.session.loginInfo.sessionId
      };
      return promise.all([requests(req,{
        url:'/wallet/wallet/account',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      }),requests(req,{
        url:'/wallet/recharge/list',
        type:'get',
        data:rechargeListData
      })]);
    }).then(function (result){
      console.log(result)
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"充值提现记录"
          },
          activeIndex:5,
          memberIndex:[1,3],
          walletAccount:result[0],
          rechargeList:result[1],
          error:false
        };
        res.render('site/member/prepaid',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"充值提现记录"
        },
        activeIndex:5,
        memberIndex:[1,3],
        error:true
      };
      res.render('site/member/prepaid',renderData);
    });
  },
  /*我的投资*/
  investment:function (req,res,next){
    refreshSessionId(req).then(function (){
      var type=req.query.type;
      var pageNo=1;
      var pageSize = 10;
      var sessionId = req.session.loginInfo.sessionId;
      var data={
        page_no:pageNo,
        page_size:pageSize,
        type:type,
        sessionid:sessionId
      };
      if(type == 2 || type == 3){
        return promise.all([requests(req,{
          url:'/wallet/wallet/account',
          type:'get',
          data:{
            sessionid:sessionId
          }
        }),requests(req,{
          url:'/wallet/wallet/hold_acccount_list',
          type:'get',
          data:data
        }),requests(req,{
          url:'/wallet/wallet/invest_info',
          type:'get',
          data:{
            sessionid:sessionId
          }
        })]);
      }else{
        return promise.all([requests(req,{
          url:'/wallet/wallet/account',
          type:'get',
          data:{
            sessionid:sessionId
          }
        }),requests(req,{
          url:'/wallet/wallet/part_list',
          type:'get',
          data:data
        }),requests(req,{
          url:'/wallet/wallet/invest_info',
          type:'get',
          data:{
            sessionid:sessionId
          }
        })]);
      }
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"我的投资"
          },
          activeIndex:5,
          memberIndex:[2],
          walletAccount:result[0],
          list:result[1],
          type:req.query.type,
          investInfo:result[2],
          error:false
        };
        res.render('site/member/investment/index',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"我的投资"
        },
        activeIndex:5,
        memberIndex:[2],
        type:req.query.type,
        error:true
      };
      res.render('site/member/investment/index',renderData);
    });

  },
  /*我的投资详情*/
  investmentDetail:function (req,res,next){
    var type,data,url;
    refreshSessionId(req).then(function (){
      if(req.query.holdId){
        type='holdId';
        data={
          hold_id:req.query.holdId,
          sessionid:req.session.loginInfo.sessionId
        }
      }else if(req.query.partId){
        type='partId';
        data={
          part_id:req.query.partId,
          sessionid:req.session.loginInfo.sessionId
        }
      }
      if(type=='holdId'){
        url='/wallet/wallet/hold_detail';
      }else if(type=='partId'){
        url='/wallet/wallet/purchase_detail'
      };
      return requests(req,{
        url:url,
        data:data,
        type:'get'
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"投资详情"
          },
          activeIndex:5,
          memberIndex:[2],
          investDetail:result,
          type:req.query.type,
          error:isError
        };
        res.render('site/member/investment/investmentDetail',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"投资详情"
        },
        activeIndex:5,
        memberIndex:[2],
        error:true,
        type:req.query.type
      };
      res.render('site/member/investment/investmentDetail',renderData);
    });
  },
  /*优惠券*/
  coupon:function (req,res,next){
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/wallet/passbook/list_web',
        type:'get',
        data:{
          page_no:1,
          page_size:12,
          type:1,
          status:1,
          sessionid:req.session.loginInfo.sessionId
        }
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"优惠券"
          },
          activeIndex:5,
          memberIndex:[3,0],
          couponList:result,
          error:isError
        };
        res.render('site/member/coupon',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"优惠券"
        },
        activeIndex:5,
        memberIndex:[3,0],
        error:true
      };
      res.render('site/member/coupon',renderData);
    });

  },
  /*银行卡*/
  bankCard:function (req,res,next){
    refreshSessionId(req,res,next).then(function (){
      var data = {
        sessionid:req.session.loginInfo.sessionId
      };
      return promise.all([requests(req,{
        url:'/security/user/base_info',
        type:'get',
        data:data
      }),requests(req,{
        url:'/wallet/bankcard/list',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId,type:0}
      }),requests(req,{
        url:'/deposit/bank/list',
        type:'get',
        data:{}
      })]);
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true,cooperativeBank=[];
        if(!result[2]['error_code']){
          cooperativeBank=result[2].list
        }
        if(!result[0]['error_code'] && !result[1]['error_code'] || result[1]['error_code'] == 300038){
          isError=false;
        }
        if(result[1]['error_code'] == 300038){
          result[1].list=[]
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"银行卡"
          },
          activeIndex:5,
          memberIndex:[3,1],
          userBaseInfo:result[0],
          bankList:result[1],
          cooperativeBank:cooperativeBank,
          error:isError
        };
        res.render('site/member/account/bankCard',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"银行卡"
        },
        activeIndex:5,
        memberIndex:[3,1],
        cooperativeBank:[],
        error:true
      };
      res.render('site/member/account/bankCard',renderData);
    })

  },
  /*会员中心*/
  memberCenter:function (req,res,next){
    refreshSessionId(req).then(function (){
      var data={
        sessionid:req.session.loginInfo.sessionId
      };
      return promise.all([requests(req,{//用户等级信息及特权信息
        url:'/member/user/user_privilege_info',
        type:'get',
        data:data
      }),requests(req,{//所需成长值
        url:'/member/user/upgrade_grow_need',
        type:'get',
        data:data
      }),requests(req,{//生日天数
        url:'/member/user/birthday_info',
        type:'get',
        data:data
      })])
    }).then(function (result){
      var isLogin;
      (!result[0].isLogin || !result[1].isLogin || !result[2].isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var birthday=0,isError=true;
        if(!result[2]['error_code']){
          birthday=result[2].days
        }
        if(!result[0]['error_code'] && !result[1]['error_code']){
          isError=false;
        }

        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"会员中心"
          },
          activeIndex:5,
          memberIndex:[4],
          memberInfo:result[0],
          growthInfo: result[1],
          birthday:birthday,
          error:isError
        };
        res.render('site/member/memberCenter',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"会员中心"
        },
        activeIndex:5,
        memberIndex:[4],
        birthday:0,
        error:true
      };
      res.render('site/member/memberCenter',renderData);
    });
  },
  growth:function (req,res,next){
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/member/user/grow_list',
        type:'get',
        data:{
          page_no:1,
          page_size:30,
          sessionid:req.session.loginInfo.sessionId
        }
      })
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        if(!result['error_code']){
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"我的成长值"
            },
            activeIndex:5,
            memberIndex:[0],
            growth:result,
          };
          res.render('site/member/growth',renderData);
        }else{
          render404(res);
        }
      });
    }).catch(function (err){
      render404(res);
    })

  },
  invitation:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"邀请送"
      },
      activeIndex:5,
      memberIndex:[5],
      telNumber:encrypt(req.session.loginInfo.mobile)
    };
    res.render('site/member/invitation',renderData)
  },
  //消息列表页
  message:function (req,res,next){
    requests(req,{
      url:'/message/message/notice_list',
      type:'get',
      data:{page_no:1,page_size:10}
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"通知中心"
          },
          activeIndex:5,
          memberIndex:[6],
          noticeList:result,
          error:isError
        };
        res.render('site/member/message/index',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"通知中心"
        },
        activeIndex:5,
        memberIndex:[6],
        error:true
      };
      res.render('site/member/message/index',renderData);
    });
  },
  //消息详情
  messageDetail:function (req,res,next){
    var messageType='系统公告';
    var type=req.params.messageType;
    var messageId = req.query.messageId;
    (type=='notice')?(messageType='系统公告'):((type=='trade')?(messageType='交易消息'):(messageType='活动消息'));
    var data={}
    if(type != 'notice'){
      data = {
        msg_uuid:messageId,
        sessionid:req.session.loginInfo.sessionId
      };
    }else{
      data = {
        message_id:messageId
      }
    }
    var url='/message/message/notice_detail';
    (type=='notice')?(url='/message/message/notice_detail'):(url='/message/message/private_detail');
    var messageDetail,isError;
    requests(req,{
      url:url,
      type:'get',
      data:data
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      if(!result['error_code']){
        messageDetail=result;
        isError=false;
        return requests(req,{
          url:'/message/message/private_count',
          type:'get',
          data:{
            sessionid:req.session.loginInfo.sessionId,
            type:0
          }
        })
      }
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        if(!result['error_code']){
          req.session.loginInfo.messages=result.privateCount;
        }else{
          req.session.loginInfo.messages=0;
        }
        isError=false;
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"消息详情"
          },
          activeIndex:5,
          memberIndex:[6],
          messageDetail:messageDetail,
          messageType:messageType,
          error:isError
        };
        res.render('site/member/message/messageDetail',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"消息详情"
        },
        activeIndex:5,
        memberIndex:[6],
        error:true
      };
      res.render('site/member/message/messageDetail',renderData);
    })

  },
  /*安全中心*/
  security:function (req,res,next){
    refreshSessionId(req).then(function (){
      return requests(req,{
        url:'/security/user/base_info',
        type:'get',
        data:{sessionid:req.session.loginInfo.sessionId}
      });
    }).then(function (result){
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        var isError=true;
        if(!result['error_code']){
          isError=false;
        }
        let renderData = {
          page:{
            loginInfo:req.session.loginInfo,
            title:"安全中心"
          },
          activeIndex:5,
          memberIndex:[7],
          userBaseInfo:result,
          error:isError
        };
        res.render('site/member/security',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page:{
          loginInfo:req.session.loginInfo,
          title:"安全中心"
        },
        activeIndex:5,
        memberIndex:[7],
        error:true
      };
      res.render('site/member/security',renderData);
    });
  },
  //余额支付
  payment:function (req,res,next){
    var productDetail={};
    var agreement=[];
    var cardCanUse=[];
    var isError=true;
    refreshSessionId(req).then(function (){
      var sessionID='';
      (req.session.loginInfo)?(sessionID=req.session.loginInfo.sessionId):(sesessionID='');
      return requests(req,{
        url:'/product/product/detail',
        type:'get',
        data:{
          product_id: req.params.id,
          sessionid:sessionID
        }
      })
    }).then(function (result){
      if(!result['error_code']){
        productDetail=result;
        isError=false;
        req.session.productDetails=result;
        return requests(req,{
          url:'/wallet/passbook/usable_list',
          type:'get',
          data:{
            category_id:result.categoryId,
            sessionid:req.session.loginInfo.sessionId
          }
        });
      }else{
        isError=true
      }
    }).then(function (result){
      if(!result['error_code']){
        isError=false;
        cardCanUse=result.list;
        return requests(req,{
          url:'/product/product/agree_list',
          type:'get',
          data:{
            product_id:req.params.id
          }
        });
      }else{
        isError=true;
      }

    }).then(function (result){
      var isLogin;
      if(!result['error_code']){
        agreement=result.list;
        isError=false;
      }
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        let renderData = {
          page: {
            loginInfo: req.session.loginInfo,
            title: "余额支付"
          },
          productDetails: productDetail,
          cardCanUse:cardCanUse,
          agreement:agreement,
          error:isError
        };
        res.render('site/payment',renderData);
      });
    }).catch(function (err){
      let renderData = {
        page: {
          loginInfo: req.session.loginInfo,
          title: "余额支付"
        },
        error:true
      };
      res.render('site/payment',renderData);
    });
  },
  //支付成功
  paymentSuccess:function (req,res,next){
   /* let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"支付成功"
      },
      remainDayNum:'',
      payTime:'',
      state:3,
      orderNo:req.params.orderNo
    };
    res.render('site/paymentSuccess',renderData);*/
    requests(req,{
      url:"/general/user/state_query",
      type:'get',
      data:{
        order_no:req.params.orderNo
      }
    }).then(function (result) {
      if(!result['error_code']){
        if(result.state == 4){
          return refreshSessionId(req);
        }else{
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"支付成功"
            },
            remainDayNum:'',
            payTime:'',
            state:result.state,
            orderNo:req.params.orderNo
          };
          res.render('site/paymentSuccess',renderData);
        }
      }else{
        render404(res)
      }
    }).then(function () {
      var data={
        part_id:req.params.orderNo,
        sessionid:req.session.loginInfo.sessionId
      };
      return requests(req,{
        url:'/pay/pay/asyn_search',
        type:'get',
        data:data
      });
    }).then(function (result) {
      var isLogin;
      (!result.isLogin)?(isLogin=false):(isLogin=true);
      renderPage(req,res,isLogin,function (){
        if(!result['error_code']){
          let renderData = {
            page:{
              loginInfo:req.session.loginInfo,
              title:"支付成功"
            },
            remainDayNum:result.remainDayNum,
            payTime:result.paySuccessTime,
            state:4,
            orderNo:req.params.orderNo
          };
          res.render('site/paymentSuccess',renderData);
        }else{
          render404(res);
        }
      });
    }).catch(function (err) {
      render404(res);
    });
  },
  /*登录*/
  login:function (req,res,next){
    let renderData = {
      page:{
        loginInfo: req.session.loginInfo,
        title:"登录"
      },
      activeIndex:0
    };
    res.render('site/login',renderData);
  },
  /*注册页面*/
  register:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"注册"
      },
      activeIndex:0
    };
    res.render('site/register',renderData);
  },
  registerSuccess:function (req,res,next){
    requests(req,{
      url:'/general/user/state_query',
      type:'get',
      data:{order_no:req.session.orderNo}
    }).then(function (result){
      if(!result['error_code']){
        let renderData = {
          page:{
            title:"注册成功"
          },
          activeIndex:0,
          registerStatus:result.state,
          orderNo:req.session.orderNo,
          registerInfo:req.session.registerInfo
        };
        res.render('site/registerSuccess',renderData)
      }else{
        render404(res);
      }
    }).catch(function (err){
      render404(res)
    });

  },
  /*找回登录密码*/
  findPassword:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回登录密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findLoginPassword/index',renderData);
  },
  findPasswordStep:function(req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回登录密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findLoginPassword/step',renderData);
  },
  findPasswordSuccess:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回登录密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findLoginPassword/success',renderData);
  },
  /*找回交易密码*/
  findPayPassword:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回交易密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findPayPassword/index',renderData);
  },
  findPayPasswordStep:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回交易密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findPayPassword/step',renderData);
  },
  findPayPasswordSuccess:function (req,res,next){
    let renderData = {
      page:{
        loginInfo:req.session.loginInfo,
        title:"找回交易密码-安全设置-个人信息-妙资金融"
      },
      activeIndex:0
    };
    res.render('site/member/findPayPassword/success',renderData);
  },
  /*首页协议*/
  agree:function (req,res,next){
    let renderData={
      page:{
        title:'妙资金融网站服务协议'
      },
      layout:false
    };
    res.render('site/agree/agree',renderData)
  },
  /*产品协议*/
  productAgree:function (req,res,next){
    if(req.session.loginInfo){
      refreshSessionId(req).then(function (){
        return requests(req,{
          url:'/product/product/agree_detail',
          type:'get',
          data:{
            product_id:req.query.productId,
            agree_id:req.query.agreeId,
            sessionid:req.session.loginInfo.sessionId,
            part_id:req.query.partId
          }
        });
      }).then(function (result){
        if(!result['error_code']){
          let renderData={
            page:{
              title:result.title
            },
            content:result.agreement
          };
          res.render('site/agree/productAgree',renderData)
        }else{
          render404(res);
        }
      }).catch(function (err){
        render404(res);
      })
    }else{
      requests(req,{
        url:'/deposit/product/agree_detail',
        type:'get',
        data:{
          product_id:req.query.productId,
          agree_id:req.query.agreeId,
          sessionid:'',
          part_id:req.query.partId
        }
      }).then(function (result){
        if(!result['error_code']){
          let renderData={
            page:{
              title:result.title
            },
            content:result.agreement
          };
          res.render('/site/agree/productAgree',renderData)
        }
      }).catch(function (err){
        render404(res);
      })
    }
  },
  /*开户协议*/
  openAccountAgree:function (req,res,next){
    let renderData={
      page:{
        title:'开户协议'
      },
      layout:false
    };
    res.render('site/agree/openAccountAgree',renderData)
  },
  /*支付服务协议*/
  payAgree:function (req,res,next){
    let renderData={
      page:{
        title:'支付服务协议'
      },
      layout:false
    };
    res.render('site/agree/payAgree',renderData)
  },
  /*着陆页*/
  landPage:function (req,res,next) {
    res.render('site/land',{layout:false})
  }
};
function renderPage(req,res,errCode,callback){
  if(!errCode){
    res.redirect('/login');
  }else{
    callback();
  }
};
