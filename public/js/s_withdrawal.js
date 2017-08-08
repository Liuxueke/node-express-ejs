$(function (){
  var cashId;
  var vender = {
    init:function (){
      this.chooseBankCard();
      this.withDrawFees();
      this.preWithdraw();
      this.withdrawConfirm();
      this.removeErrorInfo();
    },
    chooseBankCard:function (){
      $('#bankcard_ul li').on('click',function (){
        $(this).addClass('cur').siblings('li').removeClass('cur');
        var bankLogo=$(this).find('.bankLogo').attr('src');
        var bankLastNumber=$(this).find('.bankLastNumber').text();
        var withDrawAmount=parseFloat($(this).find('.cashAmount').text()).toFixed(2);
        $('#cashBank').attr('src',bankLogo);
        $('#cashBankCardNo').text(bankLastNumber);
        $('#cashAmount2').text(withDrawAmount)
      });
    },
    preWithdraw:function (){
      var _this=this;
      var rules={
        amount:{
          required:true,
          money:true
        }
      };
      var messages={
        amount:{
          required:'提现金额不能为空'
        }
      };
      _this.validateForm('#withdrawalForm',rules,messages,function (){
        if($('#amount').val()==0){
          $.errorHandler('#withdrawalForm','amount','提现金额不能为0');
          return false;
        }
        if($('#withdrawalForm').find('input[type=submit]').hasClass('disabled')){
          return false;
        }
        $('#withdrawalForm').find('input[type=submit]').addClass('disabled');
        $.ajax({
          url:'/withdraw/apply',
          type:'post',
          data:{
            amount:$('#amount').val(),
            card_id:$('li.cur').data('id')
          },
          dataType:'json',
          success:function (result){
            $('#withdrawalForm').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              $('#bank_icon').attr('src',result.netBankLogo);
              $('#amount2').text(result.amount);
              $('#cashFees').text(result.feesAmount);
              $('#moneyOrder').text(result.moneyOrder);
              _this.layer();
              cashId=result.cashId;
            }else{
              $.errorHandler('#withdrawalForm','',result.msg);
            }
          },
          error:function (err){
            $.errorHandler('#withdrawalForm','','系统错误');
            $('#withdrawalForm').find('input[type=submit]').removeClass('disabled');
          }
        })
      });

    },
    withdrawConfirm:function (){
      var _this=this;
      var confirmRule={
        payPassword:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        }
      };
      var confirmMessage={
        payPassword:{
          required:'交易密码不能为空',
          rangelength:'密码长度为6-16位'
        }
      };
      _this.validateForm('#withdrawConfirm',confirmRule,confirmMessage,function (){
        if(!cashId){
          $.errorHandler('#withdrawConfirm','','交易id为空');
          return false;
        }
        if($("#withdrawConfirm").find('input[type=submit]').hasClass('disabled')){
          return false;
        }
        $("#withdrawConfirm").find('input[type=submit]').addClass('disabled');
        $.ajax({
          url:'/withdraw/confirm',
          type:'post',
          data:{
            cash_id:cashId,
            pay_password:$('#payPassword').val()
          },
          dataType:'json',
          success:function (result){
            $("#withdrawConfirm").find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              window.location.href='/member/account/withdrawalSuccess';
            }else{
              $.errorHandler('#withdrawConfirm','',result.msg)
            }
          },
          error:function (err){
            $.errorHandler('#withdrawConfirm','','系统错误');
            $("#withdrawConfirm").find('input[type=submit]').removeClass('disabled');
          }
        })
      });
    },
    layer:function (){
      layer.open({
        title : '确认提现信息',
        type : 1,
        content : $('#withdrawConfirm'),
        closeBtn : 2,
        shadeClose : true,
        area : [ '650px', '500px' ],
        skin : 'layer_style1'
      });
    },
    withDrawFees:function (){
      $("#amount").on("keyup",function (){
        var amount = parseFloat($(this).val());

        if($('#withdrawNumber').val() == 0) {
          if (amount) {
            amount = amount.toFixed(2);
            if(amount <= 1000){
              $("#cashfee").text(3);
              if((amount-3)<0){
                $("#actualAmount").text("0元");
              }else{
                $("#actualAmount").text((amount-3).toFixed(2) + "元");
              }
            }else{
              var cashfee = (amount * ($('#withdrawFees').text()/100));
              var realAmount = (amount - cashfee);
              $("#cashfee").text(cashfee.toFixed(2));
              $("#actualAmount").text(realAmount.toFixed(2) + "元");
            }

          } else {
            $("#cashfee").text(0);
            $("#actualAmount").text("0元")
          }
        }else{
          if(amount){
            $("#actualAmount").text(amount.toFixed(2)+"元")
          }else{
            $("#actualAmount").text("0元")
          }
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
        submitHandler:function (){
          callback();
        }
      })
    },
    removeErrorInfo:function (){
      $('#payPassword').on('focus',function (){
        $('div.error').hide();
      });

    }
  };
  vender.init();

});