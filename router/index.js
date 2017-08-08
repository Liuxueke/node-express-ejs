/**
 * Created by yangxiaoyang on 2017/5/12.
 */
const express = require('express');
const router = express.Router();
const renderPage = require('../controllers/renderPage/index');
const checkUserInfo = require('../middlewares/checkUserInfo');
const checkLogin = require('../middlewares/checkLogin');
const routerControl = require('../middlewares/routerControl');
const borrowerRedirect = require('../middlewares/borrowerRedirect');

//官网路由
router.get('/',renderPage.index);
router.get('/list',renderPage.list);
router.get('/detail/:id',renderPage.detail);//产品详情页
router.get('/member',checkLogin.notLogined,renderPage.member);//个人中心首页
router.get('/member/account/recharge',checkLogin.notLogined,checkUserInfo.checkVerify,checkUserInfo.checkBindCard,renderPage.recharge);//充值，判断登录，判断是否实名开户,判断是否绑卡
router.get('/member/account/netRecharge',renderPage.netRecharge);//网银充值
router.get('/member/account/rechargeSuccess/:order',checkLogin.notLogined,renderPage.rechargeSuccess);//充值成功
router.get('/member/account/:from/openAccount',checkLogin.notLogined,renderPage.openAccount);//开户页面
router.get('/member/account/openAccountSuccess/:orderNo',renderPage.openAccountSuccess);//开户成功
router.get('/member/account/withdrawal',checkLogin.notLogined,checkUserInfo.checkVerify,checkUserInfo.checkBindCard,renderPage.withdrawal);//提现，判断登录，判断是否实名开户,判断是否绑卡
router.get('/member/account/withdrawalSuccess',renderPage.withdrawalSuccess);//提现成功
router.get('/member/transact',checkLogin.notLogined,renderPage.transact);//资金明细
router.get('/member/transact/history',checkLogin.notLogined,renderPage.transactHistory);//资金明细历史账单
router.get('/member/transact/detail/:orderNo',checkLogin.notLogined,renderPage.transactDetail);//资金明细详情
router.get('/member/prepaid',checkLogin.notLogined,renderPage.prepaid);//充值提现记录
router.get('/member/investment',checkLogin.notLogined,renderPage.investment);//我的投资
router.get('/member/investment/detail',checkLogin.notLogined,renderPage.investmentDetail);//投资详情
router.get('/member/coupon',checkLogin.notLogined,renderPage.coupon);
router.get('/member/account/bankCard',checkLogin.notLogined,renderPage.bankCard);//银行卡页面,判断登录
router.get('/member/memberCenter',checkLogin.notLogined,renderPage.memberCenter);//会员中心
router.get('/member/growth',checkLogin.notLogined,renderPage.growth);
router.get('/member/invitation',renderPage.invitation);
router.get('/member/message',checkLogin.notLogined,renderPage.message);//消息中心
router.get('/member/message/:messageType/detail',checkLogin.notLogined,renderPage.messageDetail);//消息详情
router.get('/member/security',checkLogin.notLogined,renderPage.security);//安全中心
router.get('/payment/:id',checkLogin.notLogined,renderPage.payment);//支付页
router.get('/paymentSuccess/:orderNo',renderPage.paymentSuccess);
router.get('/login',checkLogin.logined,renderPage.login);//登录页面
router.get('/register',checkLogin.logined,renderPage.register);//注册页面
router.get('/register/success',renderPage.registerSuccess);//注册成功
router.get('/findLoginPassword',renderPage.findPassword);//找回登录密码
router.get('/findLoginPassword/step',routerControl.findLoginPwdStep,renderPage.findPasswordStep);//找回登录密码第二步
router.get('/findLoginPassword/success',routerControl.findLoginPwdSuccess,renderPage.findPasswordSuccess);//找回登录密码第三步
router.get('/findPayPassword',checkLogin.notLogined,checkUserInfo.findPayPwdCheckVerify,renderPage.findPayPassword);//找回交易密码
router.get('/findPayPassword/step',checkLogin.notLogined,checkUserInfo.findPayPwdCheckVerify,routerControl.findPayPasswordStep,renderPage.findPayPasswordStep);//找回交易密码第二步
router.get('/findPayPassword/success',checkLogin.notLogined,checkUserInfo.findPayPwdCheckVerify,routerControl.findPayPasswordSuccess,renderPage.findPayPasswordSuccess);//找回交易密码第三步
router.get('/agree',renderPage.agree);
router.get('/agree/product',renderPage.productAgree);
router.get('/agree/openAccount',renderPage.openAccountAgree);//开户协议
router.get('/agree/pay',renderPage.payAgree);
router.get('/land',renderPage.landPage);

//借款人路由
const borrowerPage = require('../controllers/borrowerPage/index');
router.get('/borrower/',checkLogin.borrowerNotLogin,borrowerPage.index);//账户管理
router.get('/borrower/detail/tenderDetail/:id',checkLogin.borrowerNotLogin,borrowerPage.tenderDetail);//标的详情页
router.get('/borrower/detail/projectDetail/:id',checkLogin.borrowerNotLogin,borrowerPage.projectDetail);//项目详情页
router.get('/borrower/accountDetail',checkLogin.borrowerNotLogin,borrowerPage.accountDetail);//账户流水
router.get('/borrower/repaymentSuccess',checkLogin.borrowerNotLogin,borrowerPage.repaymentSuccess);//标的还款成功
router.get('/borrower/serviceFeePaySuccess',checkLogin.borrowerNotLogin,borrowerPage.serviceFeePaySuccess);//标的还款成功
router.get('/borrower/account/index',checkLogin.borrowerNotLogin,borrowerPage.personalInfor);//个人信息
router.get('/borrower/account/changePassword',checkLogin.borrowerNotLogin,borrowerPage.changePassword);//修改密码
router.get('/borrower/recharge',checkLogin.borrowerNotLogin,borrowerPage.recharge);//充值
router.get('/borrower/rechargeSuccess',checkLogin.borrowerNotLogin,borrowerPage.rechargeSuccess);//充值成功
router.get('/borrower/eBankRecharge',checkLogin.borrowerNotLogin,borrowerPage.eBankRecharge);//网银充值
router.get('/borrower/withdraw',checkLogin.borrowerNotLogin,borrowerPage.withdraw);//提现
router.get('/borrower/withdrawSuccess',checkLogin.borrowerNotLogin,borrowerPage.withdrawSuccess);//提现成功
router.get('/borrower/login',checkLogin.borrowerLogin,borrowerPage.login);//登录
router.get('/borrower/findLoginPassword/index',borrowerPage.surePhone);//找回登录密码-确认手机号
router.get('/borrower/findLoginPassword/resetPassword',borrowerRedirect.loginStep,borrowerPage.resetPassword);//找回登录密码-重置密码
router.get('/borrower/findLoginPassword/findPasswordSuccess',borrowerPage.findPasswordSuccess);//找回登录密码-重置密码成功
router.get('/borrower/findPayPassword/index',checkLogin.borrowerNotLogin,borrowerPage.sureIdentity);//找回交易密码-重置密码成功
router.get('/borrower/findPayPassword/resetPayPassword',checkLogin.borrowerNotLogin,borrowerRedirect.payStep,borrowerPage.resetPayPassword);//找回交易密码-重置密码成功
router.get('/borrower/findPayPassword/findPayPasswordSuccess',checkLogin.borrowerNotLogin,borrowerPage.findPayPasswordSuccess);//找回交易密码-重置密码成功

module.exports = router;
