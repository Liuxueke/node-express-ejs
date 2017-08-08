$(function (){
  var vender={
    init:function (){
      this.setNewLoginPassword();
      this.removeErrorInfo();
    },
    setNewLoginPassword:function (){
      $("#form").validate({
        rules:{
          password:{
            required:true,
            checkPassword:true,
            rangelength:[6,16]
          },
          passwordConfirm:{
            required:true,
            checkPassword:true,
            rangelength:[6,16],
            equalTo:'#password'
          }
        },
        messages:{
            password:{
              required:'登录密码不能为空',
              rangelength:'密码长度为6-16位'
            },
            passwordConfirm:{
              required:'请确认密码',
              rangelength:'密码长度为6-16位',
              equalTo:'两次密码不一致'
            }
        },
        focusCleanup:true,
        focusInvalid:false,
        debug: false,
        submitHandler:function (){
          if($("#form").find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $("#form").find('input[type=submit]').addClass('disabled');
          $.ajax({
            url:'/find_login_pwd/get_new_pwd',
            type:'post',
            data:{
              password:$('#password').val()
            },
            dataType:'json',
            success:function (result){
              $("#form").find('input[type=submit]').removeClass('disabled');
              if(result.code=='iss.success'){
                window.location.href='/findLoginPassword/success';
              }else{
                $.errorHandler('#form','',result.msg);
              }
            },
            error:function (err){
              $.errorHandler('#form','','系统错误');
              $("#form").find('input[type=submit]').removeClass('disabled');
            }
          })
        }
      })
    },
    removeErrorInfo:function (){
      $("input[type=password]").on('focus',function (){
        $("div.error").hide();
      });
    }
  };
  vender.init();
});