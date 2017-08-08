$(function (){
  var vender={
    init:function (){
      this.setNewPayPassword();
      this.removeErrorInfo();
    },
    setNewPayPassword:function (){
      $('#newPayPwdForm').validate({
        rules:{
          payPassword1:{
            required:true,
            checkPassword:true,
            rangelength:[6,16]
          },
          payPassword2:{
            required:true,
            checkPassword:true,
            rangelength:[6,16],
            equalTo:'#payPassword1'
          }
        },
        messages:{
          payPassword1:{
            required:'交易密码不能为空',
            rangelength:'密码长度为6-16位'
          },
          payPassword2:{
            required:'请确认密码',
            rangelength:'密码长度为6-16位',
            equalTo:'两次密码不一致'
          }
        },
        focusCleanup:true,
        focusInvalid:false,
        debug: false,
        submitHandler:function (){
          if($('#newPayPwdForm').find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $('#newPayPwdForm').find('input[type=submit]').addClass('disabled');
          $.ajax({
            url:'/find_pay_pwd/set_new_pwd',
            type:'post',
            data:{
              password:$('#payPassword1').val()
            },
            dataType:'json',
            success:function (result){
              $('#newPayPwdForm').find('input[type=submit]').removeClass('disabled');
              if(result.code=='iss.success'){
                window.location.href='/findPayPassword/success';
              }else{
                $.errorHandler('#newPayPwdForm','',result.msg);
              }
            },
            error:function (err){
              $.errorHandler('#newPayPwdForm','','系统错误');
              $('#newPayPwdForm').find('input[type=submit]').removeClass('disabled');
            }
          })
        }
      })
    },
    removeErrorInfo:function (){
      $('input[type=password]').on('focus',function (){
        $('div.error').hide();
      })
    }
  };
  vender.init();
});