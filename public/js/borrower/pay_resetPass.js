$(function(){
  var vender = {
    init: function(){
      this.resetPayPassword();
    },
    resetPayPassword: function(){
      $('#resetPayPassword').validate({
        rules: {
          newPass: {
            required: true,
            rangelength: [6,16],
            checkPassword: true
          },
          sureNewPass: {
            required: true,
            equalTo: '#newPass'
          }
        },
        messages: {
          newPass: {
            required: '新密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          sureNewPass: {
            required: '确认密码不能为空',
            equalTo: '两次输入的密码不一致'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#resetPayPassword').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/borrower/user/set_new_paypwd',
            data: {
              password: $('#newPass').val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                window.location.href = '/borrower/findPayPassword/findPayPasswordSuccess';
              }else{
                $.errorHandler('#resetPayPassword','',result.msg);
              }
              $('#resetPayPassword').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#resetPayPassword','','接口出错，请刷新页面重试！');
            }
          })
        }
      });
    }
  };
  vender.init();
});