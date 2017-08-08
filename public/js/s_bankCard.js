$(function (){
  var timer;
  var orderNumber;
  var vender = {
    init:function (){
      this.addCard();
      this.getMessageCode();
      this.setPayPassword();
      this.closeModal();
      this.checkBankCard();
      this.removeErrorInfo();
      this.agree();
    },
    addCard:function (){
      $('.add-card-btn').on('click',function (){
        $('#add-card').show();
      });
      var _this=this;
      if($("#isVerity").val()==1){
        var rules={
          bankCard:{
            required:true,
            checkBankCard:true,
            maxlength : 20,

          },
          telNumber:{
            required:true,
            checkPhone:true,
            rangelength:[11,11],

          },
          messageCode:{
            required:true,
            checkMessageCode:true,
            rangelength:[6,6]
          }
        };
      }else{
        var rules={
          userName:{
            required:true
          },
          identity:{
            required:true,
            checkIdentity:true,
            rangelength:[18, 18]
          },
          bankCard:{
            required:true,
            checkBankCard:true,
            maxlength : 20,

          },
          telNumber:{
            required:true,
            checkPhone:true,
            rangelength:[11,11],

          },
          messageCode:{
            required:true,
            checkMessageCode:true,
            rangelength:[6,6]
          }
        };
      }

      var messages={
        userName:{
          required:"银行开户名不能为空"
        },
        identity:{
          required:"开户身份证号不能为空",
          rangelength:"请输入正确的身份证号码"
        },
        bankCard:{
          required:"银行卡号不能为空",
          maxlength:"请输入正确的银行卡号码"
        },
        telNumber:{
          required:"银行预留手机号码不能为空",
          rangelength:"请正确填写手机号码"
        },
        messageCode:{
          required:"短信验证码不能为空",
          rangelength:"验证码长度为6位"
        }
      };
      _this.validateForm('#account',rules,messages,function (){
        if(!orderNumber){
          $.errorHandler('#account','',"短信验证码错误");
          $("#account").find('input[type=submit]').removeClass('disabled');
          return false;
        };
        if(!$('#agree').attr('checked')){
          $.errorHandler('#account','',"请同意协议");
          $("#account").find('input[type=submit]').removeClass('disabled');
          return false;
        }
        var data = {
          "order_no":orderNumber,
          "verif_code":$("#messageCode").val()
        };
        $.ajax({
          type:'post',
          url:'/bind_card/confirm',
          data:data,
          dataType:'json',
          success:function (result){
            $("#account").find('input[type=submit]').removeClass('disabled');
            if(result.code=="iss.success"){
              $('.waitBox').show();
              _this.checkBindCardState(result.orderNo,function () {
                _this.showSuccessModal();
              });
            }else{
              $.errorHandler('#account','',result.msg);
            }
          },
          error:function (err){
            $("#account").find('input[type=submit]').removeClass('disabled');
            $.errorHandler('#account','','系统错误');
          }
        })
      });
    },
    checkBankCard:function (){
      $('#bankCard').on('blur',function (){
        var bankCardRule=/^[0-9]+$/;
        var bankCard=$('#bankCard').val();
        if(!$('#bankCard').val()){
          $.errorHandler('#account','bankCard','银行卡号不能为空');
          return false;
        }
        if(!bankCardRule.test(bankCard)){
          $.errorHandler('#account','bankCard','请输入正确的银行卡号');
          return false;
        }
        $.ajax({
          url:'/bank_card_bin/check',
          type:'post',
          data:{
            bank_card_no:bankCard
          },
          success:function (result){
            if(result.code=='iss.success'){
              $('.belongBankBox').slideDown().find('#belongBankLogo').attr('src',result.netBankLogo)
            }else{
              $('.belongBankBox').slideUp();
              $.errorHandler('#account','bankCard',result.msg)
            }
          },
          error:function (err){}
        })

      });
    },
    getMessageCode:function (){
      var _this = this;
      $('.messageCodeBtn').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }else{
          $(this).addClass('disabled');
          var userName = $('#userName').val();
          var identity = $('#identity').val();
          var bankCard = $('#bankCard').val();
          var telNumber = $('#telNumber').val();
          var identityeRule=/(^\d{18}$)|(^\d{17}(\d|X|x)+$)/;
          var bankCardRule=/^[0-9]+$/;
          var telNumberRule=/^0?1[3|4|5|8][0-9]\d{8}$/;
          if($('#isVerity').val() == 0){
            if(!userName){
              errorInfo('userName','银行开户名不能为空',$(this));
              return false;
            }
            if(!identity){
              errorInfo('identity','开户身份证号不能为空',$(this));
              return false;
            }
            if(!identityeRule.test(identity)){
              errorInfo('identity','请输入正确的身份证号',$(this));
              return false;
            }
          }
          if(!bankCard){
            errorInfo('bankCard','银行卡号不能为空',$(this));
            return false;
          }
          if(!bankCardRule.test(bankCard) || bankCard.length > 20){
            errorInfo('bankCard','请输入正确的银行卡号',$(this));
            return false;
          }
          if(!telNumber){
            errorInfo('telNumber','银行预留手机号码不能为空',$(this));
            return false;
          }
          if(telNumber.length != 11 || !telNumberRule.test(telNumber)){
            errorInfo('telNumber','请正确填写手机号码',$(this));
            return false;
          };
          if($('#bankCard').hasClass('error') || $("#userName").hasClass('error') || $('#userName').hasClass('error') || $('#telNumber').hasClass('error')){
            return false;
          }
          $.ajax({
            type:'post',
            url:'/bind_card/message_code',
            data:{
              'bank_card_no':bankCard,
              'mobile':telNumber,
              'id_code':identity,
              'name':userName
            },
            dataType:'json',
            success:function (result){
              if(result.code == 'iss.success'){
                _this.cutTimeDown(60);
                orderNumber = result.orderNo;
              }else{
                $(this).removeClass('disabled');
                $.errorHandler('#account','',result.msg);
              }
            }.bind(this),
            error:function (err){
              $(this).removeClass('disabled');
              $.errorHandler('#account','',"系统错误");
            }.bind(this)
          });
        }
      });
      function errorInfo(inputName,errorMsg,$this){
        $.errorHandler('#account',inputName,errorMsg);
        $this.removeClass('disabled');
      }
    },
    setPayPassword:function (){
      var _this=this;
      var rules = {
        tradePassword:{
          required:true,
          rangelength:[6,16]
        },
        confirmTradePassword:{
          required:true,
          equalTo:'#tradePassword',
          rangelength:[6,16]
        }
      };
      var messages = {
        tradePassword:{
          required:'交易密码不能为空',
          rangelength:"密码长度为6-16"
        },
        confirmTradePassword:{
          required:"确认密码不能为空",
          rangelength:"密码长度为6-16位",
          equalTo:"两次输入的密码不一致"
        }
      };
      _this.validateForm('#tradePasswordForm',rules,messages,function (){
        $.ajax({
          type:'post',
          url:'/setPayPwd/web_first',
          data:{password:$("#tradePassword").val()},
          dataType:'json',
          success:function (result){
            $('#tradePasswordForm').find('input[type=submit]').removeClass('disabled');
            if(result.code == 'iss.success'){
              $('.modal-box').hide();
              clearInterval(timer);
              $('#bindCardSuccess').show();
              setTimeout(function (){
                $('#bindCardSuccess').hide();
                window.location.reload();
              },2000)
            }else{
              $.errorHandler('#tradePasswordForm','',result.msg)
            }
          },
          error:function (err){
            $.errorHandler('#tradePasswordForm','','系统错误');
            $('#tradePasswordForm').find('input[type=submit]').removeClass('disabled');
          }
        })
      });

    },
    closeModal:function (){
      var _this = this;
      $('.close').on('click',function (){
        $(this).parents('.modal-box').hide();
        window.location.reload();
      });
    },
    cutTimeDown:function (cutTime){
      $(".messageCodeBtn").text('重新获取(60)').addClass('disabled');
      timer = setInterval(function (){
        cutTime --;
        if(cutTime < 0){
          //停止计时器
          clearInterval(timer);
          $(".messageCodeBtn").removeClass('disabled').text('重新获取');
        }else{
          $(".messageCodeBtn").text('重新获取('+cutTime+')').addClass('disabled');
        }
      },1000);
    },
    resetForm:function (){
      var username = $('#userName').val();
      var identitycard = $('#identity').val();
      $('input[type=text]').removeClass('error').removeClass('border-red').val('');
      $('label.error').remove();
      $('div.error').remove();
      if($("#isVerity").val()==1){
        $('#userName').val(username);
        $('#identity').val(identitycard);
      }
      $('.get-message-code').text('获取验证码').removeClass('disabled');
      $('.belong-bank').hide();
      clearInterval(timer);
    },
    validateForm:function (form,rules,messages,callback){
      $(form).validate({
        rules:rules,
        messages:messages,
        debug:false,
        focusCleanup:true,
        focusInvalid: false,
        submitHandler:function (){
          if($(form).find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $(form).find('input[type=submit]').addClass('disabled');
          callback();
        }
      });
    },
    showSuccessModal:function (){
      $('.modal-box').hide();
      if($('#isSetPayPwd').val() == 0){
        $('#setTradePassword').show();
      }else{
        clearInterval(timer);
        $('#bindCardSuccess').show();
        setTimeout(function (){
          $('#bindCardSuccess').hide();
          window.location.reload();
        },2000)
      }

    },
    agree:function (){
      $("#agreement").on('click',function (){
        var agreed=$('#agree').attr('checked');
        $(this).toggleClass('agreed');
        $("#agree").attr("checked",!agreed);
        if( $("#agree").attr("checked")){
          $('div.error').hide();
        }
      });
    },
    removeErrorInfo:function (){
      $('input[type=text]').on('focus',function (){
        $('div.error').hide();
      });
    },
    checkBindCardState:function (orderNo,callback) {
      var checkTime = 0;
      var intervelTime = 2000;
      timer = setInterval(function () {
        if(checkTime > 1){
          intervelTime = 1000;
        }
        if(checkTime > 3){
          clearInterval(timer);
          return false;
        }
        $.ajax({
          url:'/check_state',
          type:'post',
          data:{
            order_no:orderNo
          },
          success:function (result) {
            if(result.code == 'iss.success'){
              if(result.state == 4){
                $('.waitBox').hide();
                clearInterval(timer);
                callback();
              }else{
                $('.waitBox').show();
              }
            }else{
              $('.waitBox').show();
            }
          },
          error:function (err) {
            $('.waitBox').show();
          }
        });
        checkTime ++;
      },intervelTime)
    }


  };
  vender.init();
});