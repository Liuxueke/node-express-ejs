$(function (){
  var checkNumebr=0,timer;
  var vender = {
    init:function (){
      this.checkStatus();
    },
    checkStatus:function (){
      var _this=this;
      if($('#registerStatus').val()==4){
        clearInterval(timer);
        _this.login({
          username:$('#mobile').val(),
          password:$('#password').val()
        });
      }else{
        var checkTime=2000;
        timer = setInterval(function (){
          checkNumebr ++;
          if(checkNumebr > 1){
            checkTime = 1000;
          }
          if(checkNumebr > 3) {
            clearInterval(timer);
            return false;
          }
          _this.getStatus($('#orderNo').val())
        },checkTime);
      }
    },
    getStatus:function (orderNo) {
      var _this=this;
      $.ajax({
        url:'/check_status',
        type:'post',
        data:{
          order_no:orderNo
        },
        success:function (result) {
          if(result.code == "iss.success"){
            if(result.state==3){
              $('.handle').text('注册处理中，请耐心等待......');
            }else if(result.state==4){
              //注册成功自动登录
              $('.handleRegister').addClass('hidden')
              $('.successOuterBox').removeClass('hidden');
              _this.login(result.registerInfo);
              clearInterval(timer);
            }else{
              $('.handle').text('注册失败');
            }
          }
        },
        error:function (err) {}
      })
    },
    login:function (data){
      var _this = this;
      $.ajax({
        url:'/login',
        type:'post',
        data:data,
        success:function (result){
          if(result.code=="iss.success"){
            _this.getLoginBar();
          }
        },
        error:function (err){}
      })
    },
    getLoginBar:function () {
      $.ajax({
        url:'/ajax_status',
        type:'post',
        data:{},
        dataType:'html',
        success:function (result) {
          $('.topBar-box').html(result);
        },
        error:function (err) {}
      });
    }
  };
  vender.init();
});