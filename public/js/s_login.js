$(function (){
  var vender = {
    init:function (){
      this.login();
      this.errorPass();
    },
    errorPass: function(){
      var flag = localStorage.getItem("errorPass");
      if(flag){
        $('.input-box:eq(3)').removeClass('hidden');
      }
    },
    login:function (){
      var _this=this;
      $("#login").validate({
        rules:{
          username:{
            required : true,
            remote: {
              url: '/username/valid',
              type: 'post',
              dataType: "json",
              data: {
                username: function(){
                  return $("#username").val().trim();
                }
              }
            }
          },
          password:{
            required:true,
            rangelength:[6,16],
            checkPassword: true
          },
          graphCode:{
            required:true,
            rangelength:[4,4],
            checkGraphCode: true
          }
        },
        messages:{
          username:{
            required:"用户名不能为空"
          },
          password:{
            required:'密码不能为空',
            rangelength:"密码长度为6-16位"
          },
          graphCode:{
            required:"验证码不能为空",
            rangelength:"验证码长度为4位"
          }
        },
        debug:false,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler : function() {
          if($("#login").find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $("#login").find('input[type=submit]').addClass('disabled');
          var username = ($('#username').val()).trim();
          var password = ($('#password').val()).trim();
          var checkcode = ($('#graphCode').val()).trim();

          //判断是否需要输入验证码
          var isNeed = localStorage.getItem("errorPass");
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
                $("#login").find('input[type=submit]').removeClass('disabled');
                if(data.code == 'iss.success'){
                  judgmentLogin();
                }else{
                  $.errorHandler('#login','graphCode',data.msg);
                  $.graphcode.refresh('.img-code');
                }
              },
              error: function(){
                $("#login").find('input[type=submit]').removeClass('disabled');
              }
            })
          }
          //判断密码
          function judgmentLogin(){
            $.ajax({
              url: '/login',
              data: {
                username: username,
                password: password,
                checkcode: checkcode
              },
              type: 'post',
              dataType: 'json',
              success: function(result){
                $("#login").find('input[type=submit]').removeClass('disabled');
                if(result.code == 'iss.success'){
                  if(localStorage.getItem("errorPass")){
                    localStorage.removeItem('errorPass');
                  }
                  _this.getMessagesNumber(result.src)
                }else{
                  $.graphcode.refresh('.img-code');
                  if(result.code == '300016' || result.code == '300017' || result.code == '300015'){//密码错误
                    $.errorHandler('#login','password',result.msg);
                    /*密码错误展示图片验证码*/
                    $('.input-box:eq(3)').removeClass('hidden');
                    localStorage.setItem('errorPass','1');
                  }else{
                    $.errorHandler('#login','',result.msg);
                  }
                }
              },
              error: function(){
                $("#login").find('input[type=submit]').removeClass('disabled');
              }
            });
          }
        }
      })
    },
    getMessagesNumber:function (src){
      $.ajax({
        url:'/get_message_number',
        type:'post',
        data:'',
        success:function (result){
          window.location.href=src
        },
        error:function (err){
          window.location.href=src
        }
      })
    }
  };
  vender.init();
});