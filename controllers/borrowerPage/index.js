const ajax = require('../../utils/ajax');
const promise = require('bluebird');
const borrowerRequest = require('../../utils/borrower/request');
const refreshBorrowerSessionId = require('../../utils/borrower/refreshBorrowerSessionId');
const render404 = require('../../utils/render404');
const redirectLogin = require('../../utils/borrower/redirectLogin');

// 渲染页面
module.exports = {
    //账户管理
    index:function(req, res, next){
      console.log('322222222')
      refreshBorrowerSessionId(req).then(function(){
        console.log('33333333')
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          }),
          borrowerRequest(req,{
            type: 'get',
            url: '/wallet/borrower/account',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code'] && !result[1]['error_code']){
          let renderData = {
            page: {
              title: '账户管理'
            },
            menuActive: [0,0],
            baseInfo: {
              name: result[0].name,
              style: result[0].loanPrincipal
            },
            accountInfo: result[1]
          };
          res.render('borrower/', renderData);
        }else {
          console.log('44444444')
          redirectLogin(result, res);
        }
      }).catch(function(err){
        console.log('11111111')
        render404(res)
      });
    },
    //账户流水
    accountDetail:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']) {
          let renderData = {
            page: {
              title: '账户流水'
            },
            menuActive: [0, 1],
            baseInfo: {
              name: result[0].name,
              style: result[0].loanPrincipal
            }
          };
          res.render('borrower/accountDetail', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //个人信息
    personalInfor:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page:{
              title:'个人信息'
            },
            menuActive: [1,0],
            baseInfo: {
              name: result[0].name,
              style: result[0].loanPrincipal
            },
            userInfo: {
              "mobile": result[0].mobile,
              "loanPrincipal": result[0].loanPrincipal,
              "name": result[0].name,
              "company": result[0].company,
              "registerNo": result[0].registerNo,
              "idNo": result[0].idNo,
              "cardNo": result[0].cardNo,
              "branch": result[0].branch,
              "profile": result[0].profile,
              "cers": result[0].cers
            }
          };
          res.render('borrower/account/index', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //修改密码
    changePassword:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then( function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page:{
              title:'修改密码'
            },
            menuActive: [1,1],
            baseInfo: {
              "name": result[0].name,
              "style": result[0].loanPrincipal,
              "isPayPass": result[0].bindPayPassword,
              "uTel": result[0].mobile.substr(0, 3) +'****' +result[0].mobile.substr(7, 11)
            }
          };
          res.render('borrower/account/changePassword', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function (err){
        render404(res)
      });
    },
    //标的详情页
    tenderDetail:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            type: 'get',
            url: '/product/bid/bid_detail',
            data: {
              id: req.params.id,
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '标的详情页'
            },
            detail: result[0]
          };
          res.render('borrower/detail/tenderDetail', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    },
    //项目详情页
    projectDetail:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            type: 'get',
            url: '/product/project/project_detail',
            data: {
              id: req.params.id,
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '项目详情页'
            },
            detail: result[0]
          };
          res.render('borrower/detail/projectDetail', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    },
    //标的还款成功
    repaymentSuccess:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            type: 'get',
            url: '/pay/repayment/asyn_search_result',
            data: {
              order_no: req.session.bid_idOrderNo,
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '标的还款申请成功'
            },
            info:{
              "status": result[0].status,
              "amount": result[0].amount,
              "project": result[0].project,
              "orderNo": result[0].orderNo
            }
          };
          res.render('borrower/repaymentSuccess', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    },
    //项目缴纳服务费成功
    serviceFeePaySuccess: function(req,res,next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            type: 'get',
            url: '/pay/pay_charge/asyn_search_result',
            data: {
              order_no: req.session.projectOrderNo,
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '项目服务费支付申请成功'
            },
            info:{
              "status": result[0].status,
              "amount": result[0].amount,
              "project": result[0].project,
              "orderNo": result[0].orderNo
            }
          };
          res.render('borrower/serviceFeePaySuccess', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //充值
    recharge:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all(
          [
            borrowerRequest(req,{
              url: '/wallet/bankcard/list',
              type: 'get',
              data: {
                sessionid: req.session.borrowerLoginInfo.sessionId,
                type: 1
              }
            }),
            borrowerRequest(req,{
              url: '/deposit/order/get_order_no',
              type: 'get',
              data: {
                sessionid:req.session.borrowerLoginInfo.sessionId
              }
            }),
            borrowerRequest(req,{
              url: '/product/borrower/base_info',
              data: {
                sessionid: req.session.borrowerLoginInfo.sessionId
              },
              type: 'get'
            }),
            borrowerRequest(req,{
              url: '/deposit/bank/list',
              type: 'get',
              data:{}
            })
          ]
        );
      }).then(function(result){
        if(!result[0]['error_code'] && result[1]['error_code'] == null && !result[2]['error_code'] && !result[3]['error_code']){
          let renderData = {
            page: {
              title: '充值'
            },
            bankCard: result[0].list,
            rechargeOrderNo: result[1].noOrder,
            userInfo: {
              "name": result[2].name,
              "idNo": result[2].idNo
            },
            bankList: result[3]
          };
          res.render('borrower/recharge', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    },
    //充值成功
    rechargeSuccess: function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/general/user/state_query',
            type: 'get',
            data: {
              order_no: req.session.borrowerRecharge_orderNo
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              borrowerLoginInfo: req.session.borrowerLoginInfo,
              title: '充值成功'
            },
            orderNo: req.session.borrowerRecharge_orderNo,
            status: result[0].status
          };
          res.render('borrower/rechargeSuccess', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //网银充值
    eBankRecharge: function(req,res,next){
      refreshBorrowerSessionId(req).then(function(){
        let renderData = {
          page: {
            borrowerLoginInfo: req.session.borrowerLoginInfo,
            title: '网银充值'
          },
          eBankInfo: {
            "version": req.session.eBank.version,
            "oid_partner": req.session.eBank.oid_partner,
            "user_id": req.session.eBank.user_id,
            "sign_type": req.session.eBank.sign_type,
            "sign": req.session.eBank.sign,
            "busi_partner": req.session.eBank.busi_partner,
            "no_order": req.session.eBank.no_order,
            "dt_order": req.session.eBank.dt_order,
            "name_goods": req.session.eBank.name_goods,
            "info_order": req.session.eBank.info_order,
            "money_order": req.session.eBank.money_order,
            "notify_url": req.session.eBank.notify_url,
            "url_return": req.session.eBank.url_return,
            "userreq_ip": req.session.eBank.userreq_ip,
            "url_order": req.session.eBank.url_order,
            "valid_order": req.session.eBank.valid_order,
            "bank_code": req.session.eBank.bank_code,
            "pay_type": req.session.eBank.pay_type,
            "timestamp": req.session.eBank.timestamp,
            "risk_item": req.session.eBank.risk_item,
            "id_type": req.session.eBank.id_type,
            "id_no": req.session.eBank.id_no,
            "acct_name": req.session.eBank.acct_name,
            "flag_modify": req.session.eBank.flag_modify
          }
        };
        res.render('borrower/eBankRecharge', renderData);
      }).catch(function(err){
        render404(res)
      });
    },
    //提现
    withdraw:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/wallet/bankcard/list',
            type: 'get',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId,
              type: 1
            }
          }),
          borrowerRequest(req,{
            url: '/withdrawal/finance_cash/detail',
            type: 'get',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            }
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code'] && !result[1]['error_code']){
          let renderData = {
            page: {
              title: '提现'
            },
            fee: result[1],
            bankCard: result[0].list,
            balance: result[0].balance.toFixed(2)
          };
          res.render('borrower/withdraw', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //提现成功
    withdrawSuccess: function(req,res,next){
      let renderData = {
        page: {
          title: '提现成功'
        }
      };
      res.render('borrower/withdrawSuccess', renderData);
    },
    //登录
    login:function(req, res, next){
      let renderData = {
        page: {
          borrowerLoginInfo: req.session.borrowerLoginInfo,
          title: '登录'
        }
      };
      res.render('borrower/login', renderData);
    },
    //找回登录密码——确认手机号码
    surePhone:function(req, res, next){
      let renderData = {
        page: {
          borrowerLoginInfo: req.session.borrowerLoginInfo,
          title: '找回登录密码——确认手机号码'
        }
      };
      res.render('borrower/findLoginPassword/index', renderData);
    },
    //找回登录密码——重置密码
    resetPassword:function(req, res, next){
      let renderData = {
        page: {
          borrowerLoginInfo: req.session.borrowerLoginInfo,
          title: '找回登录密码——重置密码'
        },
        phone: req.session.findLoginPassTel
      };
      res.render('borrower/findLoginPassword/resetPassword', renderData);
    },
    //找回登录密码——重置密码成功
    findPasswordSuccess:function(req, res, next){
      console.log(req.session.step)
      let renderData = {
        page: {
          title: '找回登录密码——重置密码成功'
        }
      };
      res.render('borrower/findLoginPassword/findPasswordSuccess', renderData);
    },
    //找回交易密码——确认身份
    sureIdentity:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '找回交易密码——确认身份'
            },
            baseInfo: {
              "uTel": result[0].mobile
            }
          };
          res.render('borrower/findPayPassword/index', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(err){
        render404(res)
      });
    },
    //找回交易密码——重置交易密码
    resetPayPassword: function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '找回交易密码——重置交易密码'
            },
            baseInfo: {
              "uTel": result[0].mobile
            }
          };
          res.render('borrower/findPayPassword/resetPayPassword', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    },
    //找回交易密码——重置交易密码成功
    findPayPasswordSuccess:function(req, res, next){
      refreshBorrowerSessionId(req).then(function(){
        return promise.all([
          borrowerRequest(req,{
            url: '/product/borrower/base_info',
            data: {
              sessionid: req.session.borrowerLoginInfo.sessionId
            },
            type: 'get'
          })
        ]);
      }).then(function(result){
        if(!result[0]['error_code']){
          let renderData = {
            page: {
              title: '找回交易密码——重置交易密码成功'
            },
            baseInfo: {
              "uTel": result[0].mobile
            }
          };
          res.render('borrower/findPayPassword/findPayPasswordSuccess', renderData);
        }else{
          redirectLogin(result,res);
        }
      }).catch(function(){
        render404(res)
      });
    }
};
