$(function(){
  var timer;
  var vender = {
    init: function(){
      this.changeLoginPassword();
      this.setPayPassword();
      this.changePayPassword();
      this.getMessageCode();
      this.proveDxCode();
    },
    //修改登录密码
    changeLoginPassword: function(){
      $("#changeLoginPassword").validate({
        rules: {
          oldPass: {
            required: true,
            rangelength: [6, 16]
          },
          newPass: {
            required: true,
            rangelength: [6, 16]
          },
          sureNewPass: {
            required: true,
            rangelength: [6, 16],
            equalTo: "#newPass"
          }
        },
        messages: {
          oldPass: {
            required: '原登录密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          newPass: {
            required: '新密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          sureNewPass: {
            required: '确认密码不能为空',
            rangelength: '密码长度为6-16位',
            equalTo:"两次输入的密码不一致"
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('div.error').remove();
          $('#changeLoginPassword').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/user/change_pwd',
            data: {
              password: $("#oldPass").val().trim(),
              new_password: $("#newPass").val().trim()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code == '000000'){
                $('.changeSuccess').show();
                setTimeout(function (){
                  window.location.reload();
                },1000);
              }else if(result.code == '300016'){
                $.errorHandler('#changeLoginPassword','oldPass',result.msg);
              }else{
                $.errorHandler('#changeLoginPassword','',result.msg);
              }
              $('#changeLoginPassword').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#changeLoginPassword','','接口错误，请刷新页面重试！');
            }
          });
        }
      });
    },
    //设置交易密码---验证短信验证吗
    proveDxCode: function(){
      $("#DxProve").validate({
        rules: {
          dxCode: {
            required: true,
            rangelength: [6,6]
          },
          dxId: {
            required: true,
            rangelength: [8,8],
            checkIdentityLastNumber: true
          }
        },
        messages: {
          dxCode: {
            required: '交易密码不能为空',
            rangelength: '密码长度为6位'
          },
          dxId: {
            required: '交易密码不能为空',
            rangelength: '密码长度为8位'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('div.error').remove();
          $('#DxProve').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/borrower/smscode/valid_set_paypwd',
            data: {
              check_code: $('#dxCode').val(),
              identity_card: $("#dxId").val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                $('.setPay_dx').hide();
                $('.setPay_main').show();
                $('.changePay_step').css('background','url(https://r.mzmoney.com/mz/img/hpimg/member/safeCenter/s_step2.png) no-repeat left bottom');
                $('.changePay_step li:eq(1)').addClass('on').siblings().removeClass('on');
                clearTimeout(timer);
                $('.getMesCode').removeClass('disabled').html('获取短信验证码');
              }else{
                $.errorHandler('#DxProve','',result.msg);
              }
              $('#DxProve').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#DxProve','','接口错误，请刷新页面重试！');
            }
          });
        }
      });
    },
    //设置交易密码
    setPayPassword: function(){
      $('#setPayPassword').validate({
        rules: {
          set_payPass: {
            required: true,
            rangelength: [6, 16],
            checkPassword: true
          },
          set_surePay: {
            required: true,
            rangelength: [6, 16],
            equalTo: "#set_payPass"
          }
        },
        messages: {
          set_payPass: {
            required: '交易密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          set_surePay: {
            required: '交易密码不能为空',
            rangelength: '密码长度为6-16位',
            equalTo:"两次输入的密码不一致"
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('div.error').remove();
          $('#setPayPassword').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/borrower/user/first_set_paypwd',
            data: {
              password: $("#set_payPass").val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code == '000000'){
                $('.changeSuccessMain').text('设置成功');
                $('.changeSuccess').show();
                setTimeout(function (){
                  window.location.reload();
                },1000);
              }else{
                $.errorHandler('#setPayPassword','',result.msg);
              }
              $('#setPayPassword').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#setPayPassword','','接口错误，请刷新页面重试！');
            }
          })
        }
      });
    },
    //修改交易密码
    changePayPassword: function(){
      $("#changePayPassword").validate({
        rules: {
          Pay_oldPass: {
            required: true,
            rangelength: [6, 16],
            checkPassword: true
          },
          Pay_newPass: {
            required: true,
            rangelength: [6, 16],
            checkPassword: true
          },
          Pay_sureNewPass: {
            required: true,
            rangelength: [6, 16],
            equalTo: "#Pay_newPass"
          },
          Pay_Id: {
            required: true,
            rangelength: [8, 8],
            checkIdentityLastNumber: true
          }
        },
        messages: {
          Pay_oldPass: {
            required: '原交易密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          Pay_newPass: {
            required: '新交易密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          Pay_sureNewPass: {
            required: '确认密码不能为空',
            rangelength: '密码长度为6-16位',
            equalTo:"两次输入的密码不一致"
          },
          Pay_Id: {
            required: '身份证后8位不能为空',
            rangelength: '密码长度为8位',
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('div.error').remove();
          $('#changePayPassword').find(":submit").attr("disabled", true);
          $.ajax({
            url:'/borrower/user/change_paypwd',
            data:{
              pay_password: $('#Pay_oldPass').val().trim(),
              new_pwd: $('#Pay_newPass').val().trim(),
              identity_card: $('#Pay_Id').val().trim()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              $('div.error').remove();
              if(result.code == '000000'){
                $('.changeSuccess').show();
                setTimeout(function (){
                  window.location.reload();
                },1000);
              }{
                $.errorHandler('#changePayPassword','',result.msg);
              }
              $('#changePayPassword').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#changePayPassword','','接口错误，请刷新页面重试！');
            }
          });
        }
      });
    },
    //获取短信验证码
    getMessageCode: function(){
      var _this = this;
      $('.getMesCode').on('click', function(){
        if($(this).hasClass('disabled')){
          return false;
        }
        $.ajax({
          url: '/borrower/smscode/get_code_set_paypwd',
          data: {},
          type: 'post',
          dataType: 'json',
          success: function(result){
            if(result.code=='iss.success'){
              $('.getMesCode').addClass('disabled');
              _this.count(60);
            }else{
              $.errorHandler('#getDx','',result.msg);
            }
          },
          error: function(){
            $.errorHandler('#getDx','','接口错误，请刷新页面重试！');
          }
        })
      });
    },
    //倒计时
    count: function(time){
      function countTime(){
        time--;
        if(time>=0){
          $('.getMesCode').html(time+'s');
          timer = setTimeout(countTime,1000);
        }else{
          clearTimeout(timer);
          $('.getMesCode').removeClass('disabled').html('重新获取短信验证码');
        }
      }
      countTime();
    }
  };
  vender.init();
});