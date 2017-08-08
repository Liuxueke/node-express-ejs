$(function(){
  var timer;
  var vender= {
    init: function(){
      this.checkOrderStatus();
    },
    //查询订单状态
    checkOrderStatus: function(){
      var flag = $('.icon-dealing');
      if(flag){
        var checkNumebr = 0;
        setInterval(function(){
          checkNumebr++;
          if(checkNumebr > 3){
            clearInterval(timer);
            return false;
          }
          checkPort();
        },2000);
      }
      function checkPort(){
        $.ajax({
          url: '/borrower/state_query',
          data: {
            order_no: $('.dealWith').attr('data-order')
          },
          type: 'post',
          dataType: 'json',
          success: function(result){
            if(result.code=='iss.success'){
              if(result.status == 3){
                //处理中
                $('.dealWith').text('充值处理中，请耐心等待.....');
              }else if(result.status == 4){
                //充值成功
                $('.successTop').html('<i class="icon-success"></i><strong>充值成功</strong>');
                clearInterval(timer);
              }else if(result.status == 5){
                $('.successTop').html('<i class="icon-error"></i><strong>充值失败</strong>');
                clearInterval(timer);
              }
            }else{
              //接口请求失败
              alert('接口出错，请刷新页面重试！');
              clearInterval(timer);
            }
          },
          error: function(){
            alert('接口出错，请刷新页面重试！');
            clearInterval(timer);
          }
        });
      }
    }
  };
  vender.init();
});