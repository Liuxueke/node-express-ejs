$(function (){
  var timer;
  var vender={
    init:function (){
      this.getMessageCode();
      this.checkMessageCode();
      this.removeErrorInfo();
    },
    checkMessageCode:function (){
      $('#form').validate({
        rules: {
          mobile: {
            required: true,
            checkPhone: true,
            rangelength: [11, 11]
          },
          captcha: {
            required: true,
            checkGraphCode: true,
            rangelength: [6, 6]
          },
        },
        messages:{
          mobile:{
            required:'手机号不能为空',
            rangelength:'手机号长度为11位'
          },
          captcha:{
            required:'短信验证码不能为空',
            rangelength:'验证码长度为6位'
          }
        },
        debug:false,
        focusCleanup:true,
        focusInvalid:false,
        submitHandler:function (){
          if($('#form').find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $('#form').find('input[type=submit]').addClass('disabled');
          var identity=$("#identity").val();
          var identityReg=/(^\d{8}$)|(^\d{7}(\d|X|x)+$)/;
          if($('#identityBox').hasClass('verify')){
            if(!identity){
              $.errorHandler('#form','identity','身份证后8位不能为空');
              $('#form').find('input[type=submit]').removeClass('disabled');
              return false;
            }
            if(!identityReg.test(identity)){
              $.errorHandler('#form','identity','请输入正确的身份证后8位');
              $('#form').find('input[type=submit]').removeClass('disabled');
              return false;
            }
            if(identity.length != 8){
              $.errorHandler('#form','identity','长度为8位');
              $('#form').find('input[type=submit]').removeClass('disabled');
              return false;
            }
          }
          $.ajax({
            url:'/find_login_pwd/check_message_code',
            type:'post',
            data:{
              mobile:$('#mobile').val(),
              check_code:$('#captcha').val(),
              identity_card:$("#identity").val()
            },
            dataType:'json',
            success:function (result){
              $('#form').find('input[type=submit]').removeClass('disabled');
              if(result.code=='iss.success'){
                window.location.href='/findLoginPassword/step';
              }else{
                $.errorHandler('#form','',result.msg);
              }
            },
            error:function (err){
              $.errorHandler('#form','','系统错误');
              $('#form').find('input[type=submit]').removeClass('disabled');
            }
          })

        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      })
    },
    getMessageCode:function (){
      var _this=this;
      $('#timer').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        $('#imgCodeBox').slideDown();
        var telNumber=$('#mobile').val();
        var graphCode=$('#graphCode').val();
        var telNumberReg=/^0?1[3|4|5|8|7][0-9]\d{8}$/;
        var graphCodeReg=/^[0-9a-zA-Z_]+$/;
        if(!telNumber){
          $.errorHandler('#form','mobile','手机号不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!telNumberReg.test(telNumber)){
          $.errorHandler('#form','mobile','请正确填写手机号码');
          $(this).removeClass('disabled');
          return false;
        }
        if(telNumber.length != 11){
          $.errorHandler('#form','mobile','手机号长度为11位');
          $(this).removeClass('disabled');
          return false;
        }
        if(!graphCode){
          $.errorHandler('#form','graphCode','图片验证码不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!graphCodeReg.test(graphCode)){
          $.errorHandler('#form','graphCode','图片验证码格式错误');
          $(this).removeClass('disabled');
          return false;
        }
        if(graphCode.length != 4){
          $.errorHandler('#form','graphCode','验证码长度为4位');
          $(this).removeClass('disabled');
          return false;
        }
        _this.checkImgCode(graphCode,'#form','graphCode','#timer',function (){
          $.ajax({
            url:'/find_login_pwd/get_message_code',
            type:'post',
            data:{
              mobile:telNumber
            },
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                $('#imgCodeBox').slideUp();
                _this.cutTimeDown('#timer',60);
                if(result.verify==1){
                  //已实名
                  $('#identityBox').slideDown().addClass('verify');
                }else{
                  $('#identityBox').slideUp().removeClass('verify');
                }
              }else{
                $.errorHandler('#form','captcha',result.msg);
                $('#timer').removeClass('disabled');
              }
              $.graphcode.refresh('.img_code');
            },
            error:function (err){
              $.errorHandler('#form','captcha','系统错误');
              $('#timer').removeClass('disabled');
              $.graphcode.refresh('.img_code');
            }
          });

        });
      });
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
        if(cutTime<0){
          $(btn).val('重新获取').removeClass('disabled');
          clearInterval(timer);
        }else{
          $(btn).val(cutTime+'s后重新获取').addClass('disabled');
        }
      },1000)
    },
    removeErrorInfo:function (){
      $('input[type=text]').on('focus',function (){
        $('div.error').hide();
      })
    }
  };
  vender.init();
});