$(function(){
  var vender = {
    init: function(){
      this.loginOut();
    },
    loginOut: function(){
      $('.loginOut').on('click',function(){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        $.ajax({
          url: '/borrower/user/logout',
          data: {},
          type: 'post',
          dataType: 'json',
          success: function(result){
            window.location.reload();
          },
          error: function(err){
            window.location.reload();
          }
        })
      })
    }
  };
  vender.init();
});