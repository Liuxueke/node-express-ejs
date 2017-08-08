$(function () {
  var timer;
  var vender = {
    init:function () {
      this.checkState();
    },
    checkState:function () {
      var _this = this;
      if($('#state').val() != 4){
        var intervalTime = 2000;
        var checkTime = 0;
        timer = setInterval(function () {
          if(checkTime > 1){
            intervalTime = 1000;
          }
          if(checkTime > 3){
            clearInterval(timer);
            return false;
          };
          $.ajax({
            url:'/check_state',
            type:'post',
            data:{
              order_no:$('#orderNo').val()
            },
            success:function (result) {
              if(result.code == 'iss.success'){
                if(result.state == 4){
                  clearInterval(timer);
                  $('.waitBox').addClass('hidden');
                  $('.paySuccessBox').removeClass('hidden');
                  _this.getSuccessDate();
                }else{
                  $('.paySuccessBox').addClass('hidden');
                  $('.waitBox').removeClass('hidden').find('p').text('支付处理中，请耐心等待......');
                }
              }else{
                $('.paySuccessBox').addClass('hidden');
                $('.waitBox').removeClass('hidden').find('p').text(result.msg);
              }
            },
            error:function (err) {
              $('.paySuccessBox').addClass('hidden');
              $('.waitBox').removeClass('hidden').find('p').text('系统错误');
            }
          });
          checkTime ++ ;
        },intervalTime);
      }
    },
    getSuccessDate:function () {
      $.ajax({
        url:'/pay/success',
        type:'post',
        data:{
          orderNo:$('#orderNo').val()
        },
        success:function (result) {
          if(result.code == 'iss.success'){
            $('.paySuccessTime').text(result.paySuccessTime);
            $('.remainDay').text(result.remainDayNum);
          }
        },
        error:function (err) {}
      })
    }
  };
  vender.init();
});