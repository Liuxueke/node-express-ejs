$(function (){
  var riskType,partId;
  var vender = {
    init: function(){
      this.prePay();
      this.closeModal();
      this.removeErrorInfo();
      this.pay();
    },
    //预支付校验
    prePay:function (){
      var _this=this;
      var productType=$('#productType').val();
      if(productType==5){
        //金包
        var rules={
          passbookId:{
            required:true
          }
        };
        var messages={
          passbookId:{
            required:'请选择优惠券'
          }
        };
        _this.validateForm('#create_form',rules,messages,function () {
          _this.isJinbao();
        })

      }else{
        //非金包
        var rules={
          amount:{
            required:true,
            money:true
          }
        };
        var messages={
          amount:{
            required:'投资金额不能为空'
          }
        };
        _this.validateForm('#create_form',rules,messages,function (){
          _this.notJinbao();
        });
      }
    },
    //金包预支付
    isJinbao: function(){
      var _this=this;
      _this.checkUserInfo(function (){
        $.ajax({
          url:'/pre_pay',
          type:'post',
          data:{
            product_id:$("#productId").val(),
            amount:0,
            passbook_id:$('#passbookId').val()
          },
          success:function (result){
            $('#create_form').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              //验证通过
              var realAmount=parseFloat($('#passbookId').find("option:selected").data('money')).toFixed(2);
              $('#realAmount').text(realAmount);
              $('#moneyOrder').text(result.moneyOrder.toFixed(2));
              $('#discount').text(realAmount);
              layer.open({
                title : null,
                type : 1,
                content : $('.enter_pwd'),
                closeBtn : 2,
                shadeClose : false,
                area : [ '620px', '374px' ],
                skin : 'layer_style1'
              });
              partId=result.partId;
            }else{
              if(result['error_code']==300026){
                //未实名
                _this.showModal('您还未开通银行存管账户，开通后才能进行投资，是否现在开通？', '#openAccountBox','/member/account/bankCard', '去开通');
              }else if(result['error_code']==300019){
                //未设置交易密码
                _this.showModal('为了您的支付安全，需设置交易密码才可进行支付操作，是否现在设置？','#openAccountBox', '/member/security?tip=3', '去设置');
              }else if(result['error_code']==300044){
                //未进行风险测评、风险测评结果不匹配
                _this.showModal('您还没有进行风险测评，需要在app端进行测评才可以投资','#riskTestBox');
              }else{
                $.errorHandler('#create_form','',result.msg);
              }
            }
          },
          error:function (err){
            $.errorHandler('#create_form','','系统错误');
            $('#create_form').find('input[type=submit]').removeClass('disabled');
          }
        })
      });
    },
    //非金包预支付
    notJinbao:function(){
      var _this=this;
      //判断是否勾选条款
      var money=$('#amount').val();
      if(!$("#agree").is(':checked')){
        $.errorHandler('#create_form', '', '您还未同意条款');
        $('#create_form').find('input[type=submit]').removeClass('disabled');
        return false;
      }
      _this.checkUserInfo(function (availableBalance){
        $.ajax({
          url:'/pre_pay',
          type:'post',
          data:{
            product_id:$("#productId").val(),
            amount:$('#amount').val(),
            passbook_id:$('#passbookId').val()
          },
          success:function (result){
            $('#create_form').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              //验证通过
              var discountMoney='0.00';
              $('#realAmount').text($('#amount').val());
              $('#moneyOrder').text(result.moneyOrder.toFixed(2));
              discountMoney=(($('#amount').val())-(result.moneyOrder)).toFixed(2);
              $('#discount').text(discountMoney);
              layer.open({
                title : null,
                type : 1,
                content : $('.enter_pwd'),
                closeBtn : 2,
                shadeClose : false,
                area : [ '620px', '374px' ],
                skin : 'layer_style1'
              });
              partId=result.partId;
            }else{
              if(result['error_code']==300026){
                //未实名
                _this.showModal('您还未开通银行存管账户，开通后才能进行投资，是否现在开通？', '#openAccountBox','/member/account/bankCard', '去开通');
              }else if(result['error_code']==300019){
                //未设置交易密码
                _this.showModal('为了您的支付安全，需设置交易密码才可进行支付操作，是否现在设置？','#openAccountBox', '/member/security?tip=3', '去设置');
              }else if(result['error_code']==300044){
                //未进行风险测评、风险测评结果不匹配、投资金额超限
                _this.showModal('您还没有进行风险测评，需要在app端进行测评才可以投资','#riskTestBox');
              }else if(result['error_code']==500015){
                //余额不足请充值
                var needRecharge=($('#amount').val()-availableBalance).toFixed(2);
                var discount1Money=(($('#amount').val())-(result.moneyOrder)).toFixed(2);
                $('.rechargeBtn').attr('href','/member/account/recharge?amount='+needRecharge);
                $('#realAmount1').text($('#amount').val());
                $('#moneyOrder1').text(result.moneyOrder);
                $('#diffAmount').text(needRecharge);
                $('#discount1').text(discount1Money);
                layer.open({
                  title:"温馨提示：<span class='f18'>本次投资账户余额不足！</span>",
                  type: 1,
                  content:$('.not_enough'),
                  closeBtn:2,
                  area: ['600px', '350px']
                })
              }else{
                $.errorHandler('#create_form','',result['error_msg']);
              }
            }
          },
          error:function (err){
            $.errorHandler('#create_form','','系统错误');
            $('#create_form').find('input[type=submit]').removeClass('disabled');
          }
        })
      });
    },
    removeErrorInfo:function (){
      $('#agree').on('change',function (){
        $('div.error').hide();
      });
      $('input[type=text]').on('focus',function (){
        $('div.error').hide();
      });
      $('input[type=password]').on('focus',function (){
        $('div.error').hide();
      });
      $('#passbookId').on('change',function (){
        $('#error_msg').hide();
      })
    },
    //校验用户信息
    checkUserInfo:function (callback){
      var _this=this;
      $.ajax({
        url: '/user/base_info',
        data: {},
        type: 'get',
        dataType: 'json',
        success: function (result) {
          $('#create_form').find('input[type=submit]').removeClass('disabled');
          if (result.code == 'iss.success') {
            (result.riskGrade==0)?(riskType='未测评'):((result.riskGrade==1)?(riskType='保守型'):((result.riskGrade==2)?(riskType='稳健型'):((result.riskGrade==3)?(riskType='积极型'):(riskType=''))));
            //判断是否实名
            if (result.verify == 0) {
             _this.showModal('您还未开通银行存管账户，开通后才能进行投资，是否现在开通？', '#openAccountBox','/member/account/bankCard', '去开通');
             return false;
             }
            //判断是否设置交易密码
            if (result.bindPayPassword == 0) {
              _this.showModal('为了您的支付安全，需设置交易密码才可进行支付操作，是否现在设置？','#openAccountBox', '/member/security?tip=3', '去设置');
              return false;
            }
            callback(result.availableBalance);
          }else{
            $.errorHandler('#create_form','',result.msg);
          }
        },
        error: function () {
          $.errorHandler('#create_form','','系统错误');
          $('#create_form').find('input[type=submit]').removeClass('disabled');
        }
      });
    },
    //展示弹框
    showModal:function (msg,modal,src,btn){
      $(".warmTip").text(msg);
      if(src && btn){
        $('.btn').attr('href',src).text(btn);
      }
      $(modal).show();
    },
    /*关闭弹框*/
    closeModal:function (){
      $('.cancelBtn').on('click',function (){
        $(this).parents('.modalBox').hide();
      });
    },
    //余额支付
    pay: function(){
      var _this=this;
      var rules={
        payPassword: {
          required: true,
          checkPassword:true,
          rangelength:[6,16]
        }
      };
      var messages={
        payPassword:{
          required:'交易密码不能为空',
          rangelength:'密码长度为6-16位'
        }
      };
      _this.validateForm('#verify_form',rules,messages,function (){
        $.ajax({
          url:'/pay/pay',
          data:{
            part_id:partId,
            pay_password:$('#payPassword').val()
          },
          type:'post',
          dataType:'json',
          success:function (result){
            $('#verify_form').find('input[type=submit]').removeClass('disabled');
            if(result.code=='iss.success'){
              window.location.href='/paymentSuccess/'+result.partId;
            }else{
              $.errorHandler('#verify_form','',result.msg);
            }
          },
          error:function (err){
            $.errorHandler('#verify_form','',result.msg);
            $('#verify_form').find('input[type=submit]').removeClass('disabled');
          }
        })
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
          if($(form).find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $(form).find('input[type=submit]').addClass('disabled');
          callback();
        }
      });
    }
  };
  vender.init();
});