$(function (){
  var timer;
  var vender={
    init:function (){
      this.getMessageCode();
      this.checkMessageCode();
      this.removeErrorInfo();
    },
    getMessageCode:function (){
      var _this=this;
      $('#timer').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        $('#imgCodeBox').slideDown();
        var imgCode=$('#pictureCaptcha').val();
        var imgCodeReg=/^[0-9a-zA-Z]+$/;
        if(!imgCode){
          $.errorHandler('#find_form','pictureCaptcha','图片验证码不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!imgCodeReg.test(imgCode)){
          $.errorHandler('#find_form','pictureCaptcha','图片验证码格式错误');
          $(this).removeClass('disabled');
          return false;
        }
        if(imgCode.length != 4){
          $.errorHandler('#find_form','pictureCaptcha','验证码长度为4位');
          $(this).removeClass('disabled');
          return false;
        }
        _this.checkImgCode(imgCode,'#find_form','pictureCaptcha','#timer',function (){
          $.ajax({
            url:'/find_pay_pwd/get_message_code',
            type:'post',
            data:{
              mobile:$('#telNumber').val()
            },
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                $('#imgCodeBox').slideUp();
                _this.cutTimeDown('#timer',60);
              }else{
                $.errorHandler('#find_form','smsCheckCode',result.msg);
                $('#timer').removeClass('disabled');
              }
              $.graphcode.refresh('.img_code');
            },
            error:function (err){
              $.errorHandler('#find_form','smsCheckCode','系统错误');
              $.graphcode.refresh('.img_code');
              $('#timer').removeClass('disabled');
            }
          });


        });

      })
    },
    checkMessageCode:function (){
      $('#find_form').validate({
        rules:{
          smsCheckCode:{
            required:true,
            checkMessageCode:true,
            rangelength:[6,6]
          },
          identitycard:{
            required:true,
            checkIdentityLastNumber:true,
            rangelength:[8,8]
          }
        },
        messages:{
          smsCheckCode:{
            required:'短信验证码不能为空',
            rangelength:'验证码长度为6位'
          },
          identitycard:{
            required:'身份证后8位不能为空',
            rangelength:'长度为8位'
          }
        },
        focusCleanup:true,
        focusInvalid:false,
        debug: false,
        submitHandler:function (){
          if($('#find_form').find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $('#find_form').find('input[type=submit]').addClass('disabled');
          $.ajax({
            url:'/find_pay_pwd/check_message_code',
            type:'post',
            data:{
              mobile:$('#telNumber').val(),
              check_code:$('#smsCheckCode').val(),
              identity_card:$('#identitycard').val()
            },
            dataType:"json",
            success:function (result){
              $('#find_form').find('input[type=submit]').removeClass('disabled');
              if(result.code=='iss.success'){
                window.location.href='/findPayPassword/step';
              }else{
                $.errorHandler('#find_form','',result.msg);
              }
            },
            error:function (err){
              $.errorHandler('#find_form','','系统错误');
              $('#find_form').find('input[type=submit]').removeClass('disabled');
            }
          })
        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      })
    },
    checkImgCode:function (imgCode,form,inputName,codeBtn,callback){
      $.ajax({
        url:'/checkImg',
        type:'post',
        data:{
          captcha:imgCode
        },
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            callback();
          }else{
            $.errorHandler(form,inputName,result.msg);
            $(codeBtn).removeClass('disabled');
          }
        },
        error:function (err){
          $.errorHandler(form,inputName,'图片验证码验证失败');
          $(codeBtn).removeClass('disabled');
        }
      })
    },
    cutTimeDown:function (btn,cutTime){
      clearInterval(timer);
      $(btn).val(cutTime+'s后重新获取').addClass('disabled');
      timer=setInterval(function (){
        cutTime --;
        if(cutTime<=0){
          $(btn).val('重新获取').removeClass('disabled');
          clearInterval(timer);
        }else{
          $(btn).val(cutTime+'s后重新获取').addClass('disabled');
        }
      },1000);
    },
    removeErrorInfo:function (){
      $('input[type=text]').on('focus',function (){
        $('div.error').hide();
      });
    }
  };
  vender.init();
});