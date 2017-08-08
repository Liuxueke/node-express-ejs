module.exports = function(imitator) {
  //刷新session
  imitator({
    'type':'json',
    'url':'/refresh/token',
    'result':{
      "sessionId":"2788e8568s8ga779e21a32t4",
      "mobile":131239536265,
      "onceSessionId":"2788e8568s8ga779e21a32t4dre",
      "userId":56898,
      "expiredTime":180000
    }
  });
  //登录
  imitator({
    type:"json",
    url:"/user/login",
    result:{
      "sessionId":"2788e8568s8ga779e21a32t4",
      "mobile":131239536265,
      "onceSessionId":"2788e8568s8ga779e21a32t4dre",
      "userId":56898,
      "expiredTime":180000
    }
  });
  //登出
  imitator({
    type:'json',
    url:'/user/logout',
    result:{
      "code":true
    }
  });
  //用户基本信息
  imitator({
    type:'post',
    url:'/user/base_info',
    result:{
      "username":"婆婆丁",
      "realname":"王洁意",
      "mobile":"13123953626",
      "bindPayPassword":0,//0未设置交易密码，1设置了
      "bindCard":1,//0未绑定银行卡，1绑定了
      "grade":3,
      "riskGrade":0,//0未风险测评，1保守型，2稳健型，3积极型
      "star":3,
      "userId":32388,
      "type":1,
      "verify":0,//0未实名认证，1已认证
      "identitycard":"330424199309302622"
    }
  });
  //预绑卡
  imitator({
    type:'post',
    url:'/card_bind/prepare',
    result:{
      "order_no":"123455",
      "status":1
    }
  });
	/*绑卡确认*/
  imitator({
    'type':'post',
    'url':'/card_bind/confirm',
    'result':{
      "order_no":"123455"
    }
  });
	/*设置交易密码*/
  imitator({
    "type":"post",
    "url":"/user/first_set_paypwd",
    "result":{
      "success":true
    }
  });
  /*首页banner*/
  imitator({
    type:'json',
    url:'/ad/list' +
    '' +
    '',
    result:{
      "adList":[
        {
          "adName":"限惠盈",
          "link":"https://m.mzmoney.com/topic/history/app-history.html",
          "url":"https://r.mzmoney.com/mzuploads/p_a_dadvertising/201703/845fc64a2da84cfcba6fda8560160aa0.png"
        },
        {
          "adName":"合规",
          "link":"https://www.mzmoney.com/specialtopics/xhy2017spring/app-xhy2017spring.html",
          "url":"https://r.mzmoney.com/mzuploads/p_a_dadvertising/201701/4406e975e63d45ecb003d3885f21b0c2.jpg"
        },
        {
          "adName":"互联网金融",
          "link":"https://www.mzmoney.com/specialtopics/vipday2017/app-vipday2017.html",
          "url":"https://r.mzmoney.com/mzuploads/p_a_dadvertising/201705/10025cc2676547c6ac4fd31fa6d53e8e.jpg"
        }
      ]
    },
    timeout:2000,
  });
  /*钱包账户信息*/
  imitator({
    'type':'json',
    'url':'/wallet/account',
    'result':{
      "totalAssets":100000,
      "interestTotalAmount":5000,
      "recoveredInterest":3000,
      "expectInterest":2000,
      "expectPrincipal":20000,
      "cashFrozen":10000,
      "balance":1000,
      "bankcardCount":3,
      "usablePassbookCount":8,
      "usableRedPackageCount":2,
      "recoveredPrincipal":50000,
      "rechargeAmount":100000,
      "cashAmount":60000
    }
  });
  /*充值记录列表*/
  imitator({
    'type':'json',
    'url':'/recharge/list',
    'result':[
      {
        "createTime":"2017-06-01 12:59:37",
        "moneyOrder":6900,
        "noOrder":2201705313014346,
        "statusOrderName":"待付款"
      },
      {
        "createTime":"2017-06-01 12:59:37",
        "moneyOrder":500,
        "noOrder":2201705313014346,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-06-01 12:59:37",
        "moneyOrder":693,
        "noOrder":2201705313014346,
        "statusOrderName":"待付款"
      },
      {
        "createTime":"2017-06-01 12:59:37",
        "moneyOrder":6900,
        "noOrder":2201705313014346,
        "statusOrderName":"成功"
      }
    ]
  });
  /*提现记录列表*/
  imitator({
    'type':'json',
    'url':'/cash/list',
    'result':[
      {
        "createTime":"2017-05-18 15:02:53",
        "moneyOrder":2563,
        "noOrder":2201705182934481,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-04-23 16:37:55",
        "moneyOrder":"30,546.41",
        "noOrder":2201704232730251,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-05-18 15:02:53",
        "moneyOrder":2563,
        "noOrder":2201705182934481,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-04-23 16:37:55",
        "moneyOrder":"30,546.41",
        "noOrder":2201704232730251,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-05-18 15:02:53",
        "moneyOrder":2563,
        "noOrder":2201705182934481,
        "statusOrderName":"成功"
      },
      {
        "createTime":"2017-04-23 16:37:55",
        "moneyOrder":"30,546.41",
        "noOrder":2201704232730251,
        "statusOrderName":"成功"
      }
    ]
  });
  /*设置用户名*/
  imitator({
    'type':'json',
    'url':'/user/set_username',
    'result':{
      "code":200
    }
  });
  /*获取用户等级信息及特权信息*/
  imitator({
    'type':'json',
    'url':'/user/user_privilege_info',
    'result':{
      "grade":{
        "currentGrade":3,
        "gradeName":"白银二星会员"
      },
      "list":[
        {
          "name":"收益加成",
          "content":"等级越高，加息力度越大。"
        },
        {
          "name":"升级礼包",
          "content":"升级即可获得升级礼包一份。"
        },
        {
          "name":"生日礼包",
          "content":"生日当天可获得生日大礼包一份。"
        },
      ]
    }
  });
  /*我的投资待回款、已回款*/
  imitator({
    'type':'json',
    'url':'/wallet/hold_acccount_list',
    'result':{
      "list":[
        {
          "partId":0,
          "productId":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "receivedTime":"2018-01-04 00:00:00",
          "statusName":"待计息"
        },
        {
          "partId":1,
          "productId":"丰惠盈M596",
          "interestLimit":"90",
          "totalPrincipal":20000,
          "interest":1000,
          "receivedTime":"2018-01-04 00:00:00",
          "statusName":"计息中"
        },
        {
          "partId":2,
          "productId":"丰惠盈M596",
          "interestLimit":"15",
          "totalPrincipal":20000,
          "interest":1000,
          "receivedTime":"2018-01-04 00:00:00",
          "statusName":"待计息"
        },
        {
          "partId":3,
          "productId":"丰惠盈M596",
          "interestLimit":"15",
          "totalPrincipal":20000,
          "interest":1000,
          "receivedTime":"2018-01-04 00:00:00",
          "statusName":"计息中"
        }
      ]
    }
  });
  /*我的投资投标中、未成标*/
  imitator({
    'type':'json',
    'url':'/wallet/part_list',
    'result':{
      "list":[
        {
          "partId":0,
          "productName":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "dealTime":"2018-01-04 00:00:00",
          "statusName":"投标中"
        },
        {
          "partId":0,
          "productName":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "dealTime":"2018-01-04 00:00:00",
          "statusName":"投标中"
        },
        {
          "partId":0,
          "productName":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "dealTime":"2018-01-04 00:00:00",
          "statusName":"投标中"
        },
        {
          "partId":0,
          "productName":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "dealTime":"2018-01-04 00:00:00",
          "statusName":"投资失败"
        },
        {
          "partId":0,
          "productName":"丰惠盈M596",
          "interestLimit":"100",
          "totalPrincipal":20000,
          "interest":1000,
          "dealTime":"2018-01-04 00:00:00",
          "statusName":"投资失败"
        }
      ]
    }
  });
  /*银行卡列表*/
  imitator({
    'type':'json',
    'url':'/bankcard/list',
    'result':{
      "list":[
        {
          "bankCardId":0,
          "bankCardNo":"201547842185451258953",

          "bankName":"中国农业银行",
          "netBankLogo":"https://r.mzmoney.com/mzuploads/bank/201701/8ed07514b7fc4b71994f77db8c325e5b.png",
          "phone":13125478462,
          "bankBranch":"",
          "def":1
        },
        {
          "bankCardId":1,
          "bankCardNo":"201547842185451257275",
          "bankName":"中国工商银行",
          "netBankLogo":"https://r.mzmoney.com/mzuploads/bank/201701/8ed07514b7fc4b71994f77db8c325e5b.png",
          "phone":13125478462,
          "bankBranch":"",
          "def":0
        }
      ]
    }
  });

  imitator({
    type:'json',
    url:'/data_time',
    result:{
      "dataTime":"2017-05-13",
      "platFormData":{"cumulativeInvestment":"7716191004","dividend":"113993448","registraters":776580}
    },
    timeout:2000
  });
  imitator({
    type:'json',
    url:'/product/recommend_list',
    result:{
      "list": [
						{"productId":1025,"productName":"新手标M1063","sell":0,"interestLimitDes":"7天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"80%","partInvestAmount":1000,"countDown":0,"tip":1,"activitys":{},"tags":{}},
						{"productId":1025,"productName":"金包赢","sell":0,"interestLimitDes":"1天","minYearIncome":"14.8%","maxYearIncome":"14.5%","interestLimitName":"体验虚拟投资本金我出，利息归您","partInvestAmount":1000,"countDown":0,"tip":2,"activitys":{},"tags":{}},
						{"productId":1025,"productName":"招财宝M604","sell":0,"interestLimitDes":"30天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"90%","partInvestAmount":1000,"countDown":0,"tip":0,"activitys":{"activity_title":"新手复投送现金加息券","activity_url":"https://www.mzmoney.com/specialtopics/summernew/app-summernew.html"},"tags":{}},
						{"productId":1025,"productName":"丰惠盈","sell":-1,"interestLimitDes":"7天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"80%","partInvestAmount":1000,"countDown":3000,"tip":0,"activitys":{},"tags":{}},
						{"productId":1025,"productName":"限惠盈M26841","sell":1,"interestLimitDes":"60天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"100%","partInvestAmount":1000,"countDown":0,"tip":0,"activitys":{},"tags":{}},
			]
		},
    timeout:2000
  });
  imitator({
    type:"json",
    url:"/product/sale_list",
    result:{
      "productType": "0",//5：金包类产品
      "passbookType": "1",//0.不支持 1.金包 2.抵价券 3.优惠券 默认为0
      "list": [
        {"productId":1025,"productName":"新手标M1063","sell":0,"interestLimitDes":"7天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"80%","partInvestAmount":1000,"countDown":0,"tip":1,"activitys":{},"tags":{}},
        {"productId":1025,"productName":"金包赢","sell":0,"interestLimitDes":"1天","minYearIncome":"14.8%","maxYearIncome":"14.5%","interestLimitName":"体验虚拟投资本金我出，利息归您","partInvestAmount":1000,"countDown":0,"tip":2,"activitys":{},"tags":{}},
        {"productId":1025,"productName":"招财宝M604","sell":0,"interestLimitDes":"30天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"90%","partInvestAmount":1000,"countDown":0,"tip":0,"activitys":{"activity_title":"新手复投送现金加息券","activity_url":"https://www.mzmoney.com/specialtopics/summernew/app-summernew.html"},"tags":{}},
        {"productId":1025,"productName":"丰惠盈","sell":-1,"interestLimitDes":"7天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"80%","partInvestAmount":1000,"countDown":3000,"tip":0,"activitys":{},"tags":{}},
        {"productId":1025,"productName":"限惠盈M26841","sell":1,"interestLimitDes":"60天","minYearIncome":"10.2%","maxYearIncome":"14.5%","progress":"100%","partInvestAmount":1000,"countDown":0,"tip":0,"activitys":{},"tags":{}},
      ]
    },
    timeout:2000
  });

  imitator({
    type:"json",
    url:"/is_autonym",
    result:{
      "code":true
    }
  });
  //公告列表
  imitator({
    type:'json',
    url:'/message/notice_list',
    result:{
      "messageList":[
        {
          "messageId":56989,
          "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
          "messageContent":"会员专属加息0.8%！每期还送88元现金！",
          "time":"2017-05-23"
        },
        {
          "messageId":56989,
          "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
          "messageContent":"会员专属加息0.8%！每期还送88元现金！",
          "time":"2017-05-23"
        },
        {
          "messageId":56989,
          "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
          "messageContent":"会员专属加息0.8%！每期还送88元现金！",
          "time":"2017-05-23"
        },
        {
          "messageId":56989,
          "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
          "messageContent":"会员专属加息0.8%！每期还送88元现金！",
          "time":"2017-05-23"
        }
      ],
      "totalMessage":300
    }
  });//公告列表
  //公告详情
  imitator({
    type:'json',
    url:'/message/notice_detail',
    result:{
      "messageId":56989,
      "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
      "messageContent":"尊敬的用户，我们正在对客服呼叫系统进行系统维护，因此今天（5月20日）18点之前客服电话接听会收到一定影响，给您造成不便，敬请谅解！",
      "time":"2017-05-20 10:24:06"
    }
  });
  //私信列表
  imitator({
    type:'json',
    url:'/message/private_list',
    result:{
      "messageList":[
        {
          "messageId":56598,
          "messageTitle":"提现申请成功",
          "messageContent":"【妙资金融】尊敬的用户：您于2017-04-05",
          "time":"2017-05-18 15:02:53"
        },
        {
          "messageId":56598,
          "messageTitle":"充值成功",
          "messageContent":"【妙资金融】尊敬的用户：您于2017-04-05",
          "time":"2017-05-18 15:02:53"
        },
        {
          "messageId":56598,
          "messageTitle":"投资失败",
          "messageContent":"【妙资金融】尊敬的用户：您于2017-04-05",
          "time":"2017-05-18 15:02:53"
        }
      ],
      "totalMessage":300
    }
  });
  //私信详情
  imitator({
    type:'json',
    url:'/message/private_detail',
    result:{
      "messageId":56989,
      "messageTitle":"关于妙资金融9.5、9.6放假，9.7正常上班的通知",
      "messageContent":"尊敬的用户，我们正在对客服呼叫系统进行系统维护，因此今天（5月20日）18点之前客服电话接听会收到一定影响，给您造成不便，敬请谅解！",
      "time":"2017-05-20 10:24:06"
    }
  });
  //借款人
  imitator({
    type: 'json',
    url: '/login/validate.htm',
    result: {
      code: "isv.username-not-exist", msg: "用户名不存在", type: "frm.login"
    }
  });
  //用户名、类型
  imitator({
    type: 'json',
    url: '/borrower/user',
    result: {
      userName: '辰南', style: '企业'
    }
  });
  //账户管理-融资余额
  imitator({
    type: 'json',
    url: '/borrower/getFinance',
    result: {
      financeAmount: '10',
      beRepaidFinance: '20'
    }
  });
  //账户管理-服务费金额
  imitator({
    type: 'json',
    url: '/borrower/serviceCharge',
    result: {
      serviceChargeAmount: '30',
      beRepaidService: '40'
    }
  });
  //账户管理-标的管理
  imitator({
    type: 'json',
    url: '/borrower/tenderManager',
    result: [
      { id: '标的1', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的2', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的3', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的4', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的5', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的6', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的7', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的8', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的9', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '标的10', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'}
    ]
  });
  //账户管理-项目管理
  imitator({
    type: 'json',
    url: '/borrower/ProjectManager',
    result: [
      { id: '项目1', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目2', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目3', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目4', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目5', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目6', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目7', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目8', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目9', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'},
      { id: '项目10', state: '还款中', raiseAmount: '10', pendingAmount: '8', alreadyPaidAmount: '2', time: '2017-05-23 23:59:59'}
    ]
  });
  //优惠券管理
  imitator({
    "type": "json",
    "url": "/passbook/list",
    "result": {
      "pageMount": '25',
      "list": [
        { "type": "1", "name": "注册金包1", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "2", "name": "注册金包2", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "3", "name": "注册金包3", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "4", "name": "注册金包4", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "5", "name": "注册金包5", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "1", "name": "注册金包5", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "2", "name": "注册金包5", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "3", "name": "注册金包5", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "4", "name": "注册金包6", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"},
        { "type": "5", "name": "注册金包7", "money": "10,000.00", "expireTime": "2016-07-21", "status": '可使用', "description": '金包体验金，可用于投资指定产品，到期后收益归投资人所有', "quota": '1000元以上可使用', "takeTime": "2016-07-06 09:41:41"}
      ]
    }
  });
  //借款人-账户管理
  imitator({
    "type": "json",
    "url": "/borrower/manage",
    "result": {
      "pageMount": "30",
      "list": [
        { "trendId": "1", "id": '标的1', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "2", "id": '标的2', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "3", "id": '标的3', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "4", "id": '标的4', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "5", "id": '标的5', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "6", "id": '标的6', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "7", "id": '标的7', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "8", "id": '标的8', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "9", "id": '标的9', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'},
        { "trendId": "10", "id": '标的10', "state": '还款中', "raiseAmount": '10', "pendingAmount": '8', "alreadyPaidAmount": '2', "time": '2017-05-23 23:59:59'}
      ]
    }
  });
  //产品详情
  imitator({
    "type": "json",
    "url": "/product/detail",
    "result": {
      productName: '招财宝M631',
      maxYearIncome : '8.00',
      minYearIncome: '0.80',
      partInvestAmount: '1000',
      interestLimitDes: '60',
      comment: '补充说明补充说明补充说明',
      progress: '60',
      surplusInvestAmount: '758,000',
      investTotalAmount: '1000000',
      saleLimitName: '2017-05-16至2017-05-18',
      tip: "3",
      countDown: '10000',
      sell: '0',//-1预售，0热售中，1，已售罄
      productType: '0',//5:金包类产品
      passbookType: '0'//支持卡券类型 0.不支持卡券 1.金包 2.抵价券 3.优惠券，默认为0
    }
  });
  //获取余额记录接口
  imitator({
    type: "json",
    url: "/wallet/balance_list",
    result: {
      totalAmount: '0.28',
      cashFrozen: '1200',
      existOldBalance: ''
    }
  });
  //投资支付
  imitator({
    type: 'get',
    url: '/pay/pay',
    result: {
      status: '0'
    }
  });
  //借款人-账户流水
  imitator({
    type: 'post',
    url: '/borrower/accountDetail',
    result: {
      pageMount: '30',
      list: [
        { id: '1', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '2', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '3', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '4', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '5', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '6', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '7', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '8', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '9', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' },
        { id: '10', style: '充值', description: '充值到交易户', account: '融资账户', money: '10.00', time: '2017-06-01 16:22:20' }
      ]
    }
  });
};