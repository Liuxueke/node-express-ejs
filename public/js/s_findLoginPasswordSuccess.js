$(function (){
  var vender={
    init:function (){
      this.toLogin();
    },
    toLogin:function (){
      var cutTime=5;
      var timer=setInterval(function (){
        cutTime --;
        if(cutTime<=0){
          clearInterval(timer);
          window.location.href='/login';
        }
        $('#second').text(cutTime);
      },1000)
    }
  };
  vender.init();
});