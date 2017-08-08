$(function (){
  var timer,btnText;
  var vender = {
    init:function (){
      this.showAttestation();
      this.changeTelphone();
      this.changeTelGetMessageCode();
      this.removeErrorInfo();
      this.changeLoginPassword();
      this.changePayPassword();
      this.setPayPassword();
      this.setPayPwdGetMessageCode()
    },
    showAttestation:function (){
      var _this = this;
      btnText = [""];
      $.each($(".edit-btn"),function (i,value){
        btnText.push($(value).text());
      });
      $(".edit-btn").on("click",function (){
        clearInterval(timer);
        if($(this).hasClass('setPayPwd')){
          //设置交易密码判断是否实名
          if($('#verify').val() == 1){
            //已实名
            showAtteste($(this));
          }else{
            //未实名
            if($(this).hasClass('changePwd')){
              _this.showModal('#changePayPwdWarmTip');
            }else{
              _this.showModal('#verifyWarmTip');
            }
          }
        }else{
          showAtteste($(this));
        }

      });
      function showAtteste($this){
        _this.index = $this.parents("li").index();
        if(!$this.hasClass("show")){
          _this.resetForm();
          $('label.error').hide();
          $('div.error').hide();
          $this.text("收起").parents("li").find(".edit-box").slideDown();
          $this.parents("li").siblings("li").find(".edit-box").slideUp().siblings(".top").find("a").removeClass("show");
          $.each($this.parents("li").siblings("li"),function (i,value){
            var arrIndex = $(value).index();
            $(value).find(".edit-btn").text(btnText[arrIndex]);
          });
          _this.resetForm();
          $("span.error").hide();
          $("div.error-box").hide();
          $this.addClass("show");
        }else{
          $this.text(btnText[_this.index]).removeClass("show").parents("li").find(".edit-box").slideUp();
        }
      };
      $('.cancel-btn').on('click',function (){
        var index = $(this).parents("li").index();
        $(this).parents(".edit-box").slideUp().siblings(".top").find(".edit-btn").text(btnText[index]).removeClass("show");
        clearInterval(timer);
      });
    },
    resetForm:function (){
      $(".get-message-code").text("获取验证码").removeClass("disabled");
      $("input[type='text']").val("");
      $("input[type='password']").val("");
      $("#set-question").find("select").val("");
      if(timer){
        clearInterval(timer);
      }
    },
    showModal:function (modal){
      $(modal).show();
      setTimeout(function (){
        $(modal).hide();
      },2000)
    },
    changeTelphone:function (){
      var _this=this;
      /*step1*/
      var rules={
        messageCode:{
          required:true,
          checkMessageCode:true,
          rangelength:[6,6]
        },
        idCard:{
          required:true,
          checkIdentityLastNumber:true,
          rangelength:[8,8]
        }
      };
      var messages={
        messageCode:{
          required:'短信验证码不能为空',
          rangelength:'验证码长度为6位'
        },
        idCard:{
          required:"身份证后8位不能为空",
          rangelength:"长度为8位"
        }
      };
      _this.validateForm('#tel-attestation',rules,messages,function (){
        var idCard='';
        if($('#idCard')){
          idCard=$('#idCard').val();
        };
        $.ajax({
          url:'/changeTel/checkCode',
          type:'post',
          data:{
            mobile:$("#phone").val(),
            check_code:$('#messageCode').val(),
            identity_card:idCard
          },
          dataType:'json',
          success:function (result){
            $('#tel-attestation').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              $('#changeTelImgCode').attr('src','/getImg');
              $('#tel-attestation').hide();
              $('#new-tel').show();
              clearInterval(timer);
            }else{
              $.errorHandler('#tel-attestation','',result.msg)
            }
          },
          error:function (err){
            $('#tel-attestation').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#tel-attestation','','系统错误')
          }
        });
      });
      /*step2*/
      var rulesNext={
        newPhone:{
          required:true,
          checkPhone:true,
          rangelength:[11,11]
        },
        smsCheckCode:{
          required:true,
          checkMessageCode:true,
          rangelength:[6,6]
        }
      };
      var messagesNext={
        newPhone:{
          required:'新手机号不能为空',
          rangelength:'手机号长度为11'
        },
        smsCheckCode:{
          required:'短信验证码不能为空',
          rangelength:'验证码长度为6位'
        }
      };
      _this.validateForm('#new-tel',rulesNext,messagesNext,function (){
        $.ajax({
          url:'/changeTel/checkCode_new',
          type:'post',
          data:{
            mobile:$('#newPhone').val(),
            check_code:$('#smsCheckCode').val()
          },
          dataType:'json',
          success:function (result){
            $('#new-tel').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              _this.correctSuccess();
            }else{
              $.errorHandler('#new-tel','',result.msg);
            }
          },
          error:function (err){
            $('#new-tel').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#new-tel','','系统错误');
          }
        })
      });
    },
    changeTelGetMessageCode:function (){
      var _this=this;
      var telReg=/^0?1[3|4|5|8|7][0-9]\d{8}$/;
      var imgCodeReg=/^[0-9a-zA-Z]+$/;
      $('#telGetCode').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        $('#telCodeBox').slideDown();
        var imgCode=$('#pictureCaptcha').val();
        if(!imgCode){
          $.errorHandler('#tel-attestation','pictureCaptcha','图片验证码不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!imgCodeReg.test(imgCode)){
          $.errorHandler('#tel-attestation','pictureCaptcha','图片验证码格式错误');
          $(this).removeClass('disabled');
          return false;
        }
        if(imgCode.length != 4){
          $.errorHandler('#tel-attestation','pictureCaptcha','验证码长度为4位');
          $(this).removeClass('disabled');
          return false;
        }
        _this.checkImgCode(imgCode,'#tel-attestation','pictureCaptcha','#telGetCode',function (){
          $.ajax({
            url:'/changeTel/getCode',
            data:{
              mobile:$('#phone').val()
            },
            type:'post',
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                $('#telCodeBox').slideUp();
                $.graphcode.refresh('#captchaImg');
                _this.cutTimeDown('#telGetCode',60);
              }else{
                $(this).removeClass('disabled');
                $.errorHandler('#tel-attestation','',result.msg);
              }
            },
            error:function (err){
              $(this).removeClass('disabled');
              $.errorHandler('#tel-attestation','','系统错误');
            }
          })

        });
      });
      $('#newTelGetCode').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        $('#changeTelNewImgCodeBox').slideDown();
        var changeTelNewTel=$('#newPhone').val();
        var changeTelNewImgCode=$('#pictureCode').val();
        if(!changeTelNewTel){
          $.errorHandler('#new-tel','newPhone','新手机号不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!telReg.test(changeTelNewTel)){
          $.errorHandler('#new-tel','newPhone','请正确填写手机号码');
          $(this).removeClass('disabled');
          return false;
        }
        if(changeTelNewTel.length != 11){
          $.errorHandler('#new-tel','newPhone','手机号长度为11');
          $(this).removeClass('disabled');
          return false;
        }
        if(!changeTelNewImgCode){
          $.errorHandler('#new-tel','pictureCode','图片验证码不能为空');
          $(this).removeClass('disabled');
          return false;
        }
        if(!imgCodeReg.test(changeTelNewImgCode)){
          $.errorHandler('#new-tel','pictureCode','图片验证码格式错误');
          $(this).removeClass('disabled');
          return false;
        }
        if(changeTelNewImgCode.length != 4){
          $.errorHandler('#new-tel','pictureCode','验证码长度为4位');
          $(this).removeClass('disabled');
          return false;
        }
        _this.checkImgCode(changeTelNewImgCode,'#new-tel','pictureCode','#newTelGetCode',function (){
          $.ajax({
            url:'/changeTel/getCode_new',
            type:'post',
            data:{
              mobile:$('#newPhone').val()
            },
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                $('#changeTelNewImgCodeBox').slideUp();
                _this.cutTimeDown('#newTelGetCode',60);
                $.graphcode.refresh('#changeTelImgCode');
              }else{
                $.errorHandler('#new-tel','',result.msg);
              }
            },
            error:function (err){
              $.errorHandler('#new-tel','','系统错误')
            }
          })

        })

      });
    },
    changeLoginPassword:function (){
      var _this=this;
      var changeLoginPwdRules={
        password:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        newPassword:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        confimPwd:{
          required:true,
          checkPassword:true,
          rangelength:[6,16],
          equalTo:'#newPassword'
        }
      };
      var changeLoginPwdMesssage={
        password:{
          required:'原登录密码不能为空',
          rangelength:'密码长度为6-16位'
        },
        newPassword:{
          required:'新登录密码不能为空',
          rangelength:'密码长度为6-16位'
        },
        confimPwd:{
          required:'请确认密码',
          rangelength:'密码长度为6-16位',
          equalTo:"两次密码不一致"
        }
      };
      _this.validateForm('#login-password',changeLoginPwdRules,changeLoginPwdMesssage,function (){
        $.ajax({
          url:'/change_pwd/login_pwd',
          type:'post',
          data:{
            password:$('#password').val(),
            new_password:$('#newPassword').val()
          },
          dataType:'json',
          success:function (result){
            $('#login-password').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              _this.correctSuccess();
            }else{
              $.errorHandler('#login-password','',result.msg);
            }
          },
          error:function (err){
            $('#login-password').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#login-password','','系统错误');
          }
        })
      });
    },
    changePayPassword:function (){
      var _this=this;
      var changePayPwdRules={
        paypwd:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        newpaypwd:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        confimPaypwd:{
          required:true,
          checkPassword:true,
          rangelength:[6,16],
          equalTo:'#newpaypwd'
        },
        payPwdIdentity:{
          required:true,
          checkIdentityLastNumber:true,
          rangelength:[8,8]
        }
      };
      var changePayPwdMessages={
        paypwd:{
          required:'原交易密码不能为空',
          rangelength:'密码长度为6-16位'
        },
        newpaypwd:{
          required:'新交易密码不能为空',
          rangelength:'密码长度为6-16位'
        },
        confimPaypwd:{
          required:'请确认交易密码',
          rangelength:'密码长度为6-16位',
          equalTo:'两次密码不一致'
        },
        payPwdIdentity:{
          required:'身份证后8位不能为空',
          rangelength:'长度为8位'
        }
      };
      _this.validateForm('#trade-password-m',changePayPwdRules,changePayPwdMessages,function (){
        $.ajax({
          url:'/change_pwd/pay_pwd',
          type:'post',
          data:{
            pay_password:$('#paypwd').val(),
            new_pwd:$('#newpaypwd').val(),
            identity_card:$('#payPwdIdentity').val()
          },
          dataType:'json',
          success:function (result){
            $('#trade-password-m').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              _this.correctSuccess();
            }else{
              $.errorHandler('#trade-password-m','',result.msg);
            }
          },
          error:function (err){
            $('#trade-password-m').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#trade-password-m','','系统错误');
          }
        })
      });
    },
    setPayPassword:function (){
      var _this=this;
      /*step1*/
      var setPaypwdRules={
        msgCode:{
          required:true,
          checkMessageCode:true,
          rangelength:[6,6]
        },
        identity:{
          required:true,
          checkIdentityLastNumber:true,
          rangelength:[8,8]
        }
      };
      var setPaypwdMessages={
        msgCode:{
          required:'短信验证码不能为空',
          rangelength:'验证码长度为6位'
        },
        identity:{
          required:'身份证后8位不能空',
          rangelength:'长度为8位'
        }
      };
      _this.validateForm('#setPayPasswordStep1',setPaypwdRules,setPaypwdMessages,function (){
        $.ajax({
          url:'/setPayPwd/checkCode',
          type:'post',
          data:{
            check_code:$('#msgCode').val(),
            identity_card:$('#identity').val()
          },
          dataType:'json',
          success:function (result){
            $('#setPayPasswordStep1').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              $('#setPayPasswordStep1').hide();
              $('#setPayPasswordStep2').show();
              clearInterval(timer);
            }else{
              $.errorHandler('#setPayPasswordStep1','',result.msg);
            }
          },
          error:function (err){
            $('#setPayPasswordStep1').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#setPayPasswordStep1','','系统错误');
          }
        })
      });
      /*step2*/
      var paypwdRules={
        payPassword:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        cofirmPayPassword:{
          required:true,
          checkPassword:true,
          rangelength:[6,16],
          equalTo:'#payPassword'
        }
      };
      var paypwdMessages={
        payPassword:{
          required:'交易密码不能为空',
          rangelength:'密码长度为6-16位'
        },
        cofirmPayPassword:{
          required:'请确认交易密码',
          rangelength:'密码长度为6-16位',
          equalTo:'两次密码不一致'
        }
      };
      _this.validateForm('#setPayPasswordStep2',paypwdRules,paypwdMessages,function (){
        $.ajax({
          url:'/setPayPwd',
          type:'post',
          data:{
            password:$('#payPassword').val()
          },
          dataType:'json',
          success:function (result){
            $('#setPayPasswordStep2').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              _this.correctSuccess();
            }else{
              $.errorHandler('#setPayPasswordStep2','',result.msg);
            }
          },
          error:function (err){
            $('#setPayPasswordStep2').find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#setPayPasswordStep2','','系统错误');
          }
        })
      });
    },
    setPayPwdGetMessageCode:function (){
      var _this=this;
      $('#payGetCodeBtn').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass("disabled");
        $.ajax({
          url:'/setPayPwd/getCode',
          type:'post',
          data:{},
          dataType:'json',
          success:function (result){
            if(result.code=='iss.success'){
              _this.cutTimeDown('#payGetCodeBtn',60);
            }else{
              $.errorHandler('#setPayPasswordStep1','msgCode',result.msg);
              $('#payGetCodeBtn').removeClass('disabled');
            }
          },
          error:function (err){
            $.errorHandler('#setPayPasswordStep1','msgCode','系统错误');
            $('#payGetCodeBtn').removeClass('disabled');
          }
        })
      });
    },
    correctSuccess:function (){
      $('#correctSuccess').show();
      setTimeout(function (){
        $(".modal-box").hide();
        location.reload();
      },1000)
    },
    cutTimeDown:function (getMessageCodeBtn,cutTime){
      $(getMessageCodeBtn).text(cutTime+'s后重新获取');
      timer=setInterval(function (){
        cutTime --;
        if(cutTime<0){
          $(getMessageCodeBtn).text('重新获取').removeClass('disabled');
          clearInterval(timer);
        }else{
          $(getMessageCodeBtn).text(cutTime+'s后重新获取').addClass('disabled');
        }
      },1000);
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
            $(codeBtn).removeClass('disabled');
            $.errorHandler(form,inputName,result.msg)
          }
        },
        error:function (err){
          $.errorHandler(form,inputName,'图片验证码验证失败')
        }
      })
    },
    validateForm:function (form,rules,messages,callback){
      $(form).validate({
        rules:rules,
        messages:messages,
        debug:false,
        focusCleanup:true,
        focusInvalid: false,
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        },
        submitHandler:function (){
          if($(form).find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $(form).find('input[type=submit]').addClass('disabled');
          callback();
        }
      })
    },
    removeErrorInfo:function (){
      $('input[type=text]').on("focus",function (){
        $('div.error').hide();
      });
      $('input[type=password]').on('focus',function (){
        $('div.error').hide();
      });
    }
  };
  vender.init();
});