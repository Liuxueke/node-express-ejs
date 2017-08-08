$(function(){
  var timer;
  var vender = {
    init: function(){
      this.checkIdenfity();
      this.getMessCode();
    },
    checkIdenfity: function(){
      $('#checkIdentify').validate({
        rules: {
          tel: {
            required: true
          },
          imgCode: {
            required: true,
            rangelength: [4,4]
          },
          mesCode: {
            required: true,
            rangelength: [6,6]
          },
          identify: {
            required: true,
            rangelength: [8,8],
            checkIdentityLastNumber: true
          }
        },
        messages: {
          tel: {
            required: '手机号码不能为空'
          },
          imgCode: {
            required: '图片验证码不能为空',
            rangelength: '验证码长度为4位'
          },
          mesCode: {
            required: '短信验证码不能为空',
            rangelength: '验证码长度为4位'
          },
          identify: {
            required: '身份证后8位不能为空',
            rangelength: '身份证后8位'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#checkIdentify').find(":submit").attr("disabled", true);
          //验证短信码
          $.ajax({
            url: '/borrower/smscode/valid_find_paypwd',
            data: {
              mobile: $("#userTel").val(),
              check_code: $("#mesCode").val(),
              identity_card: $("#identify").val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                window.location.href = '/borrower/findPayPassword/resetPayPassword';
              }else{
                $.errorHandler('#checkIdentify','',result.msg);
              }
              $('#checkIdentify').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#checkIdentify','','接口出错，请刷新页面重试！');
            }
          })
        }
      });
    },
    //获取短信验证码
    getMessCode: function(){
      var _this = this;
      $('#getMessCode').on('click',function(){
        var imgCode = $('#imgCode').val();
        var mesCode = $('#mesCode').val();
        var identify = $('#identify').val();

        if($(this).hasClass('disabled')){
          return false;
        }
        if(imgCode.trim() == ''){
          $.errorHandler('#checkIdentify','imgCode','请输入图形验证码');
          return false;
        }else{
          //验证图形验证码
          $.ajax({
            url: '/checkImg',
            type: 'post',
            dataType: "json",
            data: {
              captcha: $('#imgCode').val().trim()
            },
            success: function(data){
              if(data.code == 'iss.success'){
                $('.sureIdentifyBox li:eq(1)').animate({height:'0px','margin-bottom':'0px'},500);
                $.graphcode.refresh('.img-code');
                sendDX();
              }else{
                $.errorHandler('#checkIdentify','imgCode',data.msg);
                $.graphcode.refresh('.img-code');
              }
            },
            error: function(){
              $.errorHandler('#checkIdentify','imgCode','接口出错，请刷新页面重试！');
            }
          });
        }
        function sendDX(){
          $.ajax({
            url: '/borrower/smscode/get_code_find_paypwd',
            data: {
              mobile: $("#userTel").val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                $("#getMessCode").addClass('disabled');
                _this.count(60);
              }else{
                $.errorHandler('#checkIdentify','',result.msg);
              }
            },
            error: function(){
              $.errorHandler('#checkIdentify','','接口出错，请刷新页面重试！');
            }
          });
        }
      });
    },
    //倒计时
    count: function(second){
      function countTime(){
        second--;
        if(second>=0){
          $('#getMessCode').html(second+'s');
          timer = setTimeout(countTime,1000);
        }else{
          clearTimeout(timer);
          $('#getMessCode').html('重新获取验证码').removeClass('disabled');
        }
      }
      countTime();
    }
  };
  vender.init();
});