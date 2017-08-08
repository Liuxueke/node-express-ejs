const path = require('path');

module.exports = {
  port: 5510,
  debug: true,
  session_secret: 'sessionid_cook_key',
  loggerOptions:{
    appenders: [{
      type: 'dateFile',
      filename: 'logs/access.log',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      category: 'access'
    }]
  },
  session:{
    secret:'mz_Dev',
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge:1000*60*60*24
    }
  },
  authSign:{
    appkey: '00001',
    secret: 'abcdeabcdeabcdeabcdeabcde'
  },
  commonHeader: {
    DEVICETYPE:'pc',
    SOURCECHANNEL: 'pc'
  },
  redisOptions: {
    host: '10.10.20.8',
    port: 6860,
    db: '',
    password:'',
    prefix: 'f_'
  },
  serverUrl:'http://10.10.20.189:6120',
  activityServerUrl:'https://w24.mzmoney.com',
  indexDateMoreUrl:'http://10.10.20.190:5110/topic/datashow2017/datashow2017.html',
  rechargeActions:'https://cashier.lianlianpay.com/payment/bankgateway.htm',
  withdrawTip:"自2017年1月17日起，每位投资者每日享有两笔免费提现的机会，超出两笔后按提现金额的0.3% (千分之三)收取手续费，最低3元/笔。",
  nav:[
    {'src':'/','content':'首页'},
    {'src':'/list','content':'我要投资'},
    {'src':'https://www.mzmoney.com/topic/lead1.html','content':'新手指引'},
    {'src':'https://www.mzmoney.com/topic/safereport/safereport.html','content':'安全保障'},
    {'src':'/news/mtzx/','content':'妙资风采'},
    {'src':'/member','content':'个人中心'}
  ],
  memberNav:[
    {
      'src':'/member',
      'menu':'账户总览'
    },
    {
      'src':'javascript:;',
      'menu':'资产管理',
      'containt':[{'src':'/member/account/recharge','menu':'充值'},{'src':'/member/account/withdrawal','menu':'提现'},{'src':'/member/transact','menu':'资金明细'},{'src':'/member/prepaid','menu':'充值提现记录'}]
    },
    {
      'src':'/member/investment?type=2',
      'menu':'我的投资'
    },
    {
      'src':'javascript:;',
      'menu':'我的账户',
      'containt':[{'src':'/member/coupon','menu':'优惠券','coupon':true},{'src':'/member/account/bankCard','menu':'银行卡'}]
    },
    {
      'src':'/member/memberCenter',
      'menu':'会员中心'
    },
    {
      'src':'/member/invitation',
      'menu':'邀请奖励'
    },
    {
      'src':'/member/message',
      'menu':'消息'
    },
    {
      'src':'/member/security',
      'menu':'安全中心'
    }
  ],
  //借款人栏目
  menu:[
    {
      firstMenu: { src: '/borrower/', firstMenuName: '账户中心' },
      secondMenu: [
        { src: '/borrower/', secondMenuName: '账户管理'},
        { src: '/borrower/accountDetail', secondMenuName: '账户流水'}
      ]
    },
    {
      firstMenu: { 'src': '/borrower/account/index', firstMenuName: '个人资料' },
      secondMenu: [
        { src: '/borrower/account/index', secondMenuName: '个人信息'},
        { src: '/borrower/account/changePassword', secondMenuName: '密码修改'}
      ]
    }
  ]
};
