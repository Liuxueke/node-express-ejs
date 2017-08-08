(function ($){
  //加载登录信息
  $.loading = {
    refresh:function (mobile){
      //快捷登录框
      var quickLoginHtmStr = '<div class="success-login-box"><h3>欢迎回到妙资金融！</h3><p class="user-info fs14">您当前登录的账户<span>'+mobile+'</span></p><a href="/member" class="enter-account fs20">进入我的账户</a><p class="quit-box clearfix"><a href="/member/investment" class="look-init-product fl">查看投资的项目</a><a href="javascript:;" class="safe-quit fr">安全退出</a></p></div>'
      var navBarHtmlStr = '<p class="login-box fs12 fl clr9">您好，<a href="/member" class="userName">'+mobile+'</a><a href="/member/message" class="information hasInfomation">消息<span>43</span> </a><a href="javascript:;" class="login">[安全退出]</a>';
      $(".quickLogin-box").html(quickLoginHtmStr);
      $('.login-box').html(navBarHtmlStr);
    }
  };
  $.graphcode = {
    refresh:function(imgCode){
      $(imgCode).attr('src', '/getImg?t=' + Math.random());
    }
  };
  $.errorHandler = function (form,name,msg){
    if(name){
      if($('#'+ name +'-error').length){
        $('#'+ name +'-error').text(msg).removeClass('valid').show();
        $('#'+ name +'').addClass('error');
      }else{
        var error =  $('<label id="'+ name +'-error" class="error" for="'+ name +'">'+msg +'</label>');
        $('#'+ name +'').addClass('error');
        error.appendTo($('#'+ name +'').parent());
      }
    }else{
      var elemError = $(form).find('div.error');
      if(elemError.length == 0){
        elemError = '<div class="error">'+msg+'</div>';
        $(form).find('input[type=submit]').before(elemError);
      }else{
        $(elemError).text(msg).show();
      }
    };
  }
})(jQuery);