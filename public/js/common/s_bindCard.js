$(function (){
  var timer;
  var orderNumer;
  var vender = {
    init:function (){
      this.bindCard();
      this.getMessageCode();
      this.removeErrorInfo();
      this.checkBankCard();
      this.agree();
    },
    bindCard:function (){
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
        if(!orderNumer){
          $.errorHandler('#account','',"订单号不能为空");
          $('#account').find('input[type=submit]').removeClass('disabled');
          return false;
        };
        if(!$('#agree').attr('checked')){
          $.errorHandler('#account','',"请同意协议");
          $('#account').find('input[type=submit]').removeClass('disabled');
          return false;
        }
        var data = {
          "order_no":orderNumer,
          "verif_code":$("#messageCode").val()
        };
        $.ajax({
          type:'post',
          url:'/bind_card/confirm',
          data:data,
          dataType:'json',
          success:function (result){
            if(result.code=="iss.success"){
              window.location.href = '/member/account/openAccountSuccess/'+result.orderNo;
            }else{
              $.errorHandler('#account','',result.msg);
            }
            $('#account').find('input[type=submit]').removeClass('disabled');
          },
          error:function (err){
            $.errorHandler('#account','','系统错误');
            $('#account').find('input[type=submit]').removeClass('disabled');
          }
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
          if($('#isVerity').val()==0){
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
                orderNumer = result.orderNo;
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
    cutTimeDown:function (cutTime){
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
    validateForm:function (form,rules,messages,callback){
      $(form).validate({
        rules:rules,
        messages:messages,
        debug:false,
        focusInvalid:false,
        focusCleanup:true,
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
      });
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
    }
  };
  vender.init();
});