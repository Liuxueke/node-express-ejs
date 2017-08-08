const checkLoginStatus = require('../utils/checkLoginStatus');

module.exports = {
  notLogined:function (req,res,next){
    checkLoginStatus.checkLogin(req,res,next).then(function (result) {
      if(result){
        next();
      }else{
        req.session.nextUrl=req.url;
        return res.redirect('/login');
      }
    }).catch(function () {
      req.session.nextUrl=req.url;
      return res.redirect('/login');
    })
  },
  logined:function (req,res,next){
    checkLoginStatus.checkLogin(req,res,next).then(function (result) {
      if(result){
        return res.redirect('/');
      }else{
        next();
      }
    }).catch(function () {
      next();
    });
  },

  //借款人-----未登录
  borrowerNotLogin: function(req, res, next){
    checkLoginStatus.borrowerCheckLogin(req, res, next).then(function(result){
      if(result){
        next();
      }else{
        return res.redirect('/borrower/login');
      }
    }).catch(function(){
      next();
    });
  },
  //借款人-----已登录
  borrowerLogin: function(req, res, next){
    checkLoginStatus.borrowerCheckLogin(req, res, next).then(function(result){
      if(result){
        return res.redirect('/borrower/');
      }else{
        next();
      }
    }).catch(function(){
      next();
    });
  },
};