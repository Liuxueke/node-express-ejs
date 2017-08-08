const render404=require('../utils/render404');
module.exports = {
  findLoginPwdStep:function (req,res,next){
    if(!req.session.findLoginPwd && req.session.findLoginPwd.step != 1){
      return res.redirect('/findLoginPassword');
    }
    next();
  },
  findLoginPwdSuccess:function (req,res,next){
    if(!req.session.findLoginPwd && req.session.findLoginPwd.step != 2){
      return res.redirect('/findLoginPassword');
    }
    next();
  },
  findPayPasswordStep:function (req,res,next){
    if(!req.session.findPayPwd && req.session.findPayPwd.step != 1){
      return res.redirect('/findPayPassword');
    }
    next();
  },
  findPayPasswordSuccess:function (req,res,next){
    if(!req.session.findPayPwd && req.session.findPayPwd.step != 2){
      return res.redirect('/findPayPassword');
    }
    next();
  }

};