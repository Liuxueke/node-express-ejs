$(function (){
  var vender={
    init:function (){
      this.toMember();
    },
    toMember:function (){
      var cutTime=6;
      var timer=setInterval(function (){
        cutTime--;
        if(cutTime<0){
          clearInterval(timer);
          window.location.href='/member';
        }else{
          $('#time').text(cutTime);
        }
      },1000)
    }
  };
  vender.init();
});