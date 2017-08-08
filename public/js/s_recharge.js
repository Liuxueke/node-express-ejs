$(function (){
  var timer,orderNumber,netBankId;
  var vender = {
    init:function (){
      this.changeTabs();
      this.chooseBankCard();
      this.quickRecharge();
      this.quickRechargeConfirm();
      this.netBankRecharge();
      this.removeErrorInfo();
      this.reGetMessageCode();
      this.agree();
    },
    changeTabs:function (){
      $('#tabBox>li').on("click",function (){
        var index=$(this).index();
        $(this).addClass('cur').siblings('li').removeClass('cur');
        $('.agreement').addClass('agreed');
        $('.agree').attr('checked',true);
        $('.banlList').eq(index).show().siblings('.banlList').hide();
        $('input[type=text]').val('');
        $('label.error').hide();
        $('div.error').hide();
      });

    },
    chooseBankCard:function (){
      $("#bankcard_ul > li").on('click',function (){
        $(this).addClass('cur').siblings('li').removeClass('cur');
        $("#paymentSingleLimit").text($(this).find('.paymentSingleLimit').val());
        $('#paymentLimit').text($(this).find('.paymentDayLimit').val());
        $('div.error').hide();
      });
      $('#ebank_ul>li').on('click',function (){
        $(this).addClass('cur').siblings('li').removeClass('cur');
        $('div.error').hide();
        netBankId=$(this).data('card');
      })
    },
    quickRecharge:function (){
      var _this = this;
      var rules = {
        rechargeMoney:{
          required:true,
          money:true
        }
      };
      var message = {
        rechargeMoney:{
          required:"充值金额不能为空"
        }
      };
      _this.validateForm('#form',rules,message,function (){
        var cardId = $('#bankcard_ul>li.cur').data('card');
        var amount = $("#rechargeMoney").val();
        if(!cardId){
          $.errorHandler("#form",'','请选择银行卡后再进行充值');
          return false;
        }
        if(!$('#form').find('.agree').attr('checked')){
          $.errorHandler('#form','',"请同意协议");
          return false;
        }
        if($('#form').find('input[type=submit]').hasClass('disabled')){
          return false;
        }
        $('#form').find('input[type=submit]').addClass('disabled');
        _this.rechargeGetMessageCode(cardId,amount,true);
      });

    },
    quickRechargeConfirm:function (){
      var _this = this;
      var rules = {
        bankCheckCode:{
          required:true,
          checkMessageCode:true,
          rangelength:[6,6]
        }
      };
      var messages = {
        bankCheckCode:{
          required:"短信验证码不能为空",
          rangelength:"验证码长度为6位"
        }
      };
      _this.validateForm("#messageCodeConfirmForm",rules,messages,function (){
        if(!orderNumber){
          $.errorHandler('#messageCodeConfirmForm','','订单号不能为空');
          return false;
        }
        if($('#messageCodeConfirmForm').find('input[type=submit]').hasClass('disabled')){
          return false;
        }
        $('#messageCodeConfirmForm').find('input[type=submit]').addClass('disabled');
        $.ajax({
          url:'/quickRecharge_confirm',
          type:'post',
          data:{
            order_no:orderNumber,
            verif_code:$('#bankCheckCode').val()
          },
          success:function (result){
            $('#messageCodeConfirmForm').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              window.location.href='/member/account/rechargeSuccess/'+result.orderNo;
            }else{
              $.errorHandler('#messageCodeConfirmForm','',result.msg)
            }
          },
          error:function (err){
            $.errorHandler('#messageCodeConfirmForm','','系统错误')
            $('#messageCodeConfirmForm').find('input[type=submit]').removeClass('disabled');
          }
        })
      });
    },
    netBankRecharge:function (){
      var _this=this;
      var rules={
        amount:{
          required:true,
          money:true
        }
      };
      var messages={
        amount:{
          required:'充值金额不能为空'
        }
      };
      _this.validateForm('#ebankFormData',rules,messages,function (){
        if(!netBankId){
          $.errorHandler('#ebankFormData','','请选择银行卡后再进行充值');
          return false;
        };
        if(!$('#form').find('.agree').attr('checked')){
          $.errorHandler('#ebankFormData','',"请同意协议");
          return false;
        }
        if($('#form').find('input[type=submit]').hasClass('disabled')){
          return false;
        }
        $('#form').find('input[type=submit]').addClass('disabled');
        $.ajax({
          url:'/net_recharge/prepare',
          data:{
            bank_id:netBankId,
            amount:$('#amount').val()
          },
          type:'post',
          dataType:'json',
          success:function (result){
            $('#form').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              window.location.href='/member/account/netRecharge';
            }else{
              $.errorHandler('#ebankFormData','',result.msg);
            }
          },
          error:function (err){
            $.errorHandler('#ebankFormData','','系统错误');
            $('#form').find('input[type=submit]').removeClass('disabled');
          }
        })
      });
    },
    removeErrorInfo:function (){
      $('input[type=text]').on('focus',function (){
        $('div.error').hide();
      });
    },
    cutDownTime:function (cutTime){
      timer = setInterval(function (){
        if(cutTime < 0){
          $('#timer').val("重新获取").removeClass('disabled');
          clearInterval(timer)
        }else{
          $('#timer').val(cutTime+"秒").addClass('disabled');
        }
        cutTime --;
      },1000)
    },
    reGetMessageCode:function (){
      var _this = this;
      $("#timer").on("click",function (){
        if($(this).hasClass('disabled')){
          return false;
        }else{
          $(this).addClass('disabled');
          var cardId = $('#bankcard_ul>li.cur').data('card');
          var amount = $("#rechargeMoney").val();
          _this.rechargeGetMessageCode(cardId,amount,false);
        }
      });
    },
    rechargeGetMessageCode:function (cardId,amount,isShowModal){
      var _this = this;
      $.ajax({
        type:'post',
        url:'/order/get_order_no',
        data:{
          card_id:cardId,
          amount:amount
        },
        dataType:'json',
        success:function (result){
          $('#form').find('input[type=submit]').removeClass('disabled');
          if(result.code == "iss.success"){
            var phone = $('#bankcard_ul>li.cur').find('input[name=bankCardPhone]').val().substr(0,3)+"****"+$('#bankcard_ul>li.cur').find('input[name=bankCardPhone]').val().substr(7,4);
            $('#bankCardPhone').text(phone);
            _this.cutDownTime(60);
            if(isShowModal){
              layer.open({
                title:null,
                type: 1,
                content: $('.get_code'),
                closeBtn:2,
                shadeClose:false,
                area: ['470px', '230px'],
                skin:'layer_style1',
                cancel:function (){
                  clearInterval(timer);
                }
              });
            }
            orderNumber = result.orderNo;
          }else{
            $("#timer").removeClass('disabled');
            if(isShowModal){
              $.errorHandler("#form",'',result.msg);
            }else{
              $.errorHandler("#messageCodeConfirmForm",'',result.msg);
            }
          }
        },
        error:function (err){
          $('#form').find('input[type=submit]').removeClass('disabled');
          $("#timer").removeClass('disabled');
          $.errorHandler("#form",'','系统错误');
        }
      })
    },
    agree:function (){
      $(".agreement").on('click',function (){
        var agreed=$('.agree').attr('checked');
        $(this).toggleClass('agreed');
        $(".agree").attr("checked",!agreed);
        if( $(".agree").attr("checked")){
          $('div.error').hide();
        }
      });
    },
    validateForm:function (form,rules,messages,callback){
      $(form).validate({
        rules:rules,
        messages:messages,
        debug:false,
        focusCleanup:true,
        focusInvalid: false,
        errorPlacement: function(error, element) {
          error.appendTo(element.closest('div'));
        },
        submitHandler:function (){
          callback();
        }
      });
    }

  };
  vender.init();
});