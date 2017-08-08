$(function(){
  var vender = {
    init: function(){
        this.login();
        this.errorPass();
    },
    errorPass: function(){
      var flag = localStorage.getItem("errorPass_borrower");
      if(flag){
        $('.input-box:eq(2)').show();
      }
    },
    login: function(){
      $("#login").validate({
        rules: {
          username: {
            required: true,
            rangelength: [11,11],
            checkPhone: true
          },
          password: {
            required : true,
            rangelength : [6,16],
            checkPassword: true
          },
          graphCode: {
            required : true,
            rangelength : [4,4],
            checkGraphCode: true
          }
        },
        messages: {
          username: {
            required: '用户名不能为空',
            rangelength: '请输入正确的手机号'
          },
          password: {
            required : "登录密码不能为空",
            rangelength:'密码长度为6-16位',
          },
          graphCode: {
            required : "验证码不能为空",
            rangelength:'验证码长度为4位'
          }
        },
        debug:true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('div.error').remove();
          $('#login').find(":submit").attr("disabled", true);
          var username = $('#username').val().trim();
          var password = $('#password').val().trim();
          var checkcode = $('#graphCode').val().trim();
          //判断是否需要输入验证码
          var isNeed = localStorage.getItem("errorPass_borrower");
          if(isNeed){
            judgmentImgCode();
          }else{
            judgmentLogin();
          }
          //判断图形验证码
          function judgmentImgCode(){
            $.ajax({
              url: '/checkImg',
              type: 'post',
              dataType: "json",
              data: {
                captcha: checkcode
              },
              success: function(data){
                if(data.code == 'iss.success'){
                  judgmentLogin();
                }else{
                  $.errorHandler('#login','graphCode',data.msg);
                  $.graphcode.refresh('.img-code');
                }
                $('#login').find(":submit").attr("disabled", false);
              },
              error: function(){
                $.errorHandler('#login','graphCode','接口出错，情刷新页面重试！');
              }
            })
          }
          //判断密码
          function judgmentLogin(){
            $.ajax({
              url: '/borrower_login',
              data: {
                username: username,
                password: password,
                checkcode: checkcode,
                login_type: 1
              },
              type: 'post',
              dataType: 'json',
              success: function(result){
                if(result.code == 'iss.success'){
                  window.location.href = '/borrower/';
                  if(localStorage.getItem("errorPass_borrower")){
                    localStorage.removeItem('errorPass_borrower');
                  }
                }else{
                  $.graphcode.refresh('.img-code');
                  if(result.code == '300016' || result.code == '300017' || result.code == '300015'){//密码错误
                    $.errorHandler('#login','password',result.msg);
                    /*密码错误展示图片验证码*/
                    $('.input-box:eq(2)').show();
                    localStorage.setItem('errorPass_borrower','1');
                  }else{
                    $.errorHandler('#login','',result.msg);
                  }
                }
                $('#login').find(":submit").attr("disabled", false);
              },
              error: function(){
                $.errorHandler('#login','','接口出错，请刷新页面重试');
              }
            });
          }
        }
      });
    }
  };
  vender.init();
});