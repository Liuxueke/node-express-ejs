$(function () {
  var timer;
  var vender = {
    init:function () {
      this.checkState();
    },
    checkState:function () {
      var checkTime = 0;
      var intervalTime = 2000;
      var orderNo = $('#orderNo').val();
      var initState = $('#state').val();
      if(initState != 4){
        timer = setInterval(function () {
          if(checkTime > 1){
            intervalTime = 1000;
          }
          if(checkTime>3){
            clearInterval(timer);
            return false;
          }
          $.ajax({
            url:'/check_state',
            type:'post',
            data:{
              order_no:orderNo
            },
            dataType:'json',
            success:function (result) {
              if(result.code == 'iss.success'){
                if(result.state == 4){
                  $('.waitHandleBox').addClass('hidden');
                  $('.containtSuccess').removeClass('hidden');
                  clearInterval(timer);
                }else if(result.state == 3){
                  $('.handle').text('开户处理中，请耐心等待......')
                }else{
                  $('.handle').text('开户失败')
                }
              }else{
                $('.handle').text(result.msg)
              }
            },
            error:function (err) {
              $('.handle').text('系统错误')
            }
          })
        },intervalTime)
      }

    }
  };
  vender.init();
});