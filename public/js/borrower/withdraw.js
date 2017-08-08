$(function(){
  var cashId;
  var render = {
    init: function(){
      this.withDrawFees();
      this.applyWithdraw();
      this.confirmWithdraw();
      this.close();
      this.removeErrorInfo();
    },
    //计算手续费
    withDrawFees:function (){
      $("#amount").on("keyup",function (){
        var amount = parseFloat($(this).val());
        if($('#withdrawNumber').val() == 0) {
          if (amount) {
            amount = amount.toFixed(2);
            if(amount <= 1000){
              $("#cashfee").text(3);
              if((amount-3)<0){
                $("#actualAmount").text("0.00 元");
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
            $("#actualAmount").text("0.00 元")
          }
        }else{
          if(amount){
            $("#actualAmount").text(amount.toFixed(2)+"元")
          }else{
            $("#actualAmount").text("0.00 元")
          }
        }
      });
    },
    //提现申请
    applyWithdraw: function(){
      var exist = $('.changeTips').hasClass('add');
      if(exist){
        $("#withdrawForm").validate({
          debug: true,
          focusInvalid: false,
          onkeyup: false,
          success : "valid",
          submitHandler: function(){
            $.errorHandler('#withdrawForm','','请选择银行卡');
          }
        });
        return false;
      }
      $("#withdrawForm").validate({
        rules: {
          amount: {
            required:true,
            money:true
          }
        },
        messages: {
          amount: {
            required: '提现金额不能为空'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          if($('#amount').val()==0){
            $.errorHandler('#withdrawForm','amount','提现金额不能为0');
            return false;
          }
          $('#withdrawForm').find(":submit").attr("disabled", true);

          var amount = $("#amount").val();
          var card_id = $('.bankCardId').attr('data-id');
          $.ajax({
            url: '/borrower/finance_cash/apply',
            data: {
              amount: amount,
              card_id: card_id
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(!result.code){
                $('#bank_icon').attr('src',result.netBankLogo);
                $('#amount2').text(result.amount);
                $('#cashFees').text(result.feesAmount);
                $('#moneyOrder').text(result.moneyOrder);
                $('.mask').show();
                cashId=result.cashId;
              }else{
                $.errorHandler('#withdrawForm','',result.msg);
              }
              $('#withdrawForm').find(":submit").attr("disabled", false);
            },
            error: function(err){
              $.errorHandler('#withdrawForm','','系统错误');
            }
          });
        }
      })
    },
    //提现确认
    confirmWithdraw: function(){
      $("#withdrawConfirm").validate({
        rules: {
          payPassword: {
            required: true,
            checkPassword:true,
            rangelength:[6,16]
          }
        },
        messages: {
          payPassword:{
            required:'交易密码不能为空',
            rangelength:'密码长度为6-16位'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#withdrawConfirm').find(":submit").attr("disabled", true);
          $.ajax({
            url: '/borrower/finance_cash/confirm',
            data: {
              cash_id:cashId,
              pay_password:$('#payPassword').val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(!result.code){
                window.location.href='/borrower/withdrawSuccess';
              }else{
                $.errorHandler('#withdrawConfirm','',result.msg);
              }
              $('#withdrawConfirm').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#withdrawConfirm','','系统错误');
            }
          })
        }
      });
    },
    //关闭
    close: function(){
      $('.close').on('click',function(){
        $(this).parents('.mask').hide();
        $('#bank_icon').attr('src','');
        $('#amount2').empty();
        $('#cashFees').empty();
        $('#moneyOrder').empty();
      });
    },
    removeErrorInfo:function (){
      $('#payPassword').on('focus',function (){
        $('div.error').hide();
      });
    }
  };
  render.init();
});