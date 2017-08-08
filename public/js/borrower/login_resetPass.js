$(function(){
  const vender = {
    init: function(){
      this.resetLoginPassword();
    },
    resetLoginPassword: function(){
      $('#resetLoginPassword').validate({
        rules: {
          newPassword: {
            required: true,
            rangelength: [6,16],
            checkPassword: true
          },
          sureNewPassword: {
            required: true,
            equalTo: '#newPassword'
          }
        },
        messages: {
          newPassword: {
            required: '新密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          sureNewPassword: {
            required: '确认密码不能为空',
            equalTo: '两次输入的密码不一致'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#resetLoginPassword').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/borrower/user/set_new_password',
            data:{
              password: $('#newPassword').val(),
              mobile: $('#userTel').val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code == 'iss.success'){
                window.location.href = '/borrower/findLoginPassword/findPasswordSuccess';
              }else{
                $.errorHandler('#resetLoginPassword','',result.msg);
              }
              $('#resetLoginPassword').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#resetLoginPassword','','接口出错，请刷新页面重试！');
            }
          })
        }
      });
    }
  };
  vender.init();
});