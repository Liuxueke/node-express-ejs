module.exports = {
  loginStep: function(req,res,next){
    if(req.session.step!=1){
      return res.redirect('/borrower/findLoginPassword/index');
    }
    next();
  },
  //忘记支付密码
  payStep: function(req,res,next){
    if(req.session.PayStep!=1){
      return res.redirect('/borrower/findPayPassword/index');
    }
    next();
  }
};