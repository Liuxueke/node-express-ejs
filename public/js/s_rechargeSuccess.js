$(function (){
  var vender={
    init:function (){
      this.checkRechargeStatus();
    },
    checkRechargeStatus:function (){
      var checkTime=0;
      var intervalTime = 2000;
      if($('#rechargeStatus').val() != 4){
        var timer=setInterval(function (){
          if(checkTime > 0){
            intervalTime = 1000;
          }
          if(checkTime > 2){
            clearInterval(timer);
            return false;
          }
          $.ajax({
            url:'/check_state',
            type:'post',
            data:{
              order_no:$('#orderNumber').val()
            },
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                if(result.state == 4){
                  $('#rechargeHandel').addClass('hidden');
                  $('#rechargeSuccess').removeClass('hidden');
                }else if(result.state == 3){
                  $('#rechargeHandel').removeClass('hidden').find('p').text('充值处理中，请耐心等待......');
                  $('#rechargeSuccess').addClass('hidden');
                }else{
                  $('#rechargeHandel').removeClass('hidden').find('p').text('充值失败');
                  $('#rechargeSuccess').addClass('hidden');
                }
              }
            },
            error:function (err){}
          });
          checkTime ++ ;
        },intervalTime)
      }

    }
  };
  vender.init();
});