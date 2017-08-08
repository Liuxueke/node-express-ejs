$(function(){
  var timer,preOrderNo;
  var render = {
    init: function(){
      this.quickForm();//快捷预充值
      this.sureRecharge();//快捷充值确认
      this.onlineBank();//网银预充值
      this.tabChange();
      this.selectBank();
      this.repeatSend();
      this.close();
    },
    //快捷预充值
    quickForm: function(){
      var _this = this;
      var exist = $(".changeTips").hasClass('add');
      if(exist){
        $("#quickRechargeForm").validate({
          debug:true,
          focusInvalid: false,
          onkeyup: false,
          success : "valid",
          submitHandler: function(){
            $.errorHandler('#quickRechargeForm','','请选择银行卡');
          }
        });
        return false;
      };
      $("#quickRechargeForm").validate({
        rules: {
          quickRechargeAmount: {
            required: true,
            money: true
          }
        },
        messages: {
          quickRechargeAmount: {
            required: '充值金额不能为空'
          }
        },
        debug:true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#quickRechargeForm').find(":submit").attr("disabled", true);
          _this.recharge(true);
        }
      });
    },
    //快捷预充值--方法
    recharge:function(isShow){
      var _this = this;
      var order_no = $('#rechargeOrderNo').val();
      var bankCardId = $('.bankCardId').attr('data-id');
      var amount = $('#quickRechargeAmount').val().trim();
      $.ajax({
        url: '/shop_deposit_finance/prepare',
        data: {
          order_no: order_no,
          card_id: bankCardId,
          amount: amount
        },
        type: 'post',
        dataType: 'json',
        success: function(result){
          if(result.code == 'iss.success'){
            preOrderNo = result.noOrder;
            $('.theTime').addClass('disabled');
            _this.countDown(60);
            if(isShow){
              $('.mask').show();
              var tel = $('.userTel').text();
              $('.dxTel').text(tel);
            }
          }else{
            if(isShow){
              if(result.code == '40020'){
                $.errorHandler('#quickRechargeForm','quickRechargeAmount',result.msg);
              }else{
                $.errorHandler('#quickRechargeForm','',result.msg);
              }
            }else{
              $.errorHandler('#dxForm','',result.msg);
            }
          }
          $('#quickRechargeForm').find(":submit").attr("disabled", false);
        },
        error: function(){
          $.errorHandler('#quickRechargeForm','','系统错误');
        }
      })
    },
    //快捷充值--充值确认
    sureRecharge: function(){
      $("#dxForm").validate({
        rules:{
          getDX: {
            required: true,
            rangelength: [6,6],
            checkMessageCode: true
          }
        },
        messages: {
          getDX: {
            required: '验证码不能为空',
            rangelength: '验证码长度6位'
          }
        },
        debug:true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#dxForm').find(":submit").attr("disabled", true);
          var dxNum = $("#getDX").val();
          $.ajax({
            url: '/shop_deposit/finance/confirm',
            data: {
              order_no: preOrderNo,
              verif_code: dxNum
            },
            type: 'post',
            typeData: 'json',
            success: function(result){
              if(result.code == 'iss.success'){
                window.location.href = '/borrower/rechargeSuccess'
              }else{
                $.errorHandler('#dxForm','',result.msg);
              }
              $('#dxForm').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#dxForm','','系统错误');
            }
          });
        }
      });
    },
    //网银预充值
    onlineBank: function(){
      $('#onlineRechargeForm').validate({
        rules: {
          onlineRechargeAmount: {
            required: true,
            money: true
          }
        },
        messages: {
          onlineRechargeAmount: {
            required: '充值金额不能为空'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          //判断是否选择充值银行
          var chooseBank = $('.OnlineBankingList li').hasClass('on');
          if(!chooseBank){
            $.errorHandler('#onlineRechargeForm','','请选择充值银行');
            return false;
          }
          $('#onlineRechargeForm').find(":submit").attr("disabled", true);
          var order_no = $('#rechargeOrderNo').val();
          var bank_id = $('.OnlineBankingList li.on').attr('data-bankId');
          var amount = $('#onlineRechargeAmount').val().trim();
          $.ajax({
            url: '/online_deposit_finance/prepare',
            data: {
              order_no: order_no,
              amount: amount,
              bank_id: bank_id
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(!result.code){
                if(result['error_code'] == null){
                  window.location.href = '/borrower/eBankRecharge';
                }else{
                  $.errorHandler('#onlineRechargeForm','',result.msg);
                }
              }else{
                $.errorHandler('#onlineRechargeForm','',result.msg);
              }
              $('#onlineRechargeForm').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#onlineRechargeForm','','系统错误');
            }
          });
        }
      });
    },
    //tab切换
    tabChange: function(){
      $('.rechargeTit li:eq(0)').addClass('active');
      $('.rechargeBox').eq(0).show();
      $('.rechargeTit li').on('click',function(){

        $('#quickRechargeAmount').val('');
        $('#onlineRechargeAmount').val('');
        $('label.error').remove();

        $(this).addClass('active').siblings().removeClass('active');
        $('.rechargeBox').eq($(this).index()).show().siblings().hide();
      })
    },
    //选择充值银行
    selectBank: function(){
      $('.OnlineBankingList li').on('click',function(){
        $(this).addClass('on').siblings().removeClass('on');
      });
    },
    //倒计时
    countDown:function(time){
      function count(){
        time--;
        if(time>=0){
          $('.theTime').html(time+'s');
          timer = setTimeout(count,1000);
        }else{
          clearTimeout(timer);
          $('.theTime').html('重新发送');
          $('.theTime').removeClass('disabled');
        }
      }
      count();
    },
    //重新发送短信验证码
    repeatSend: function(){
      var _this = this;
      $('.theTime').on('click',function(){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        _this.recharge(false);
        _this.countDown(60);
      });
    },
    //关闭
    close: function(){
      $('.dxClose').on('click',function(){
        $(this).parents('.mask').hide();
        clearTimeout(timer);
        $('.theTime').html('60s');
        $('.theTime').removeClass('disabled');
        $("#getDX").val('');
        $('.dxSure div.error').remove();
        $('.dxSend #getDX-error').remove();
      });
    },
  };
  render.init();
});