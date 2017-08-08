$(function(){
  var timer;
  var vender = {
    init: function(){
      this.surePhone();
      this.getMessageCode();
    },
    //手机号确认
    surePhone: function(){
      $('#surePhone').validate({
        rules: {
          phone: {
            required: true,
            rangelength: [11, 11],
            checkPhone: true
          },
          graphCode: {
            required: true,
            rangelength: [4,4]
          },
          mesCode: {
            required: true,
            rangelength: [6,6],
            checkMessageCode: true
          },
          idCode: {
            required: true,
            rangelength: [8,8],
            checkIdentityLastNumber: true
          }
        },
        messages: {
          phone: {
            required: '手机号不能为空',
            rangelength: '手机号码长度为11位'
          },
          graphCode: {
            required: '图片验证码不能为空',
            rangelength: '验证码长度为4位'
          },
          mesCode: {
            required: '图片验证码不能为空',
            rangelength: '短信验证码长度为6位'
          },
          idCode: {
            required: '图片验证码不能为空',
            rangelength: '短信验证码长度为8位'
          }
        },
        debug: true,
        focusInvalid: false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          $('#surePhone').find(":submit").attr("disabled", true);
          $.ajax({
            url:'/borrower/smscode/valid_find_pwd',
            data: {
              mobile: $('#phone').val(),
              check_code: $("#mesCode").val(),
              identity_card: $('#idCode').val()
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                window.location.href = '/borrower/findLoginPassword/resetPassword';
              }else{
                $.errorHandler('#surePhone','',result.msg);
              }
              $('#surePhone').find(":submit").attr("disabled", false);
            },
            error: function(){
              $.errorHandler('#surePhone','','接口出错，请刷新页面重试！');
            }
          });
        }
      });
    },
    //获取短信验证码
    getMessageCode: function(){
      var _this = this;
      $('.getMessageCode').on('click',function(){
        if($(this).hasClass('disabled')){
          return false;
        }
        var phone = $('#phone').val();
        var graphCode = $("#graphCode").val();
        if(phone.trim() == ''){
          $.errorHandler('#surePhone','phone','请输入手机号');
          return false;
        }
        if(graphCode.trim() == ''){
          $.errorHandler('#surePhone','graphCode','请输入图形验证码');
        }else{
          $.ajax({
            url: '/checkImg',
            type: 'post',
            dataType: "json",
            data: {
              captcha: $('#graphCode').val().trim()
            },
            success: function(data){
              if(data.code == 'iss.success'){
                $('.writePhoneNum li:eq(1)').animate({'height':'0px','margin-bottom':'0px'},500);
                sendDx();
                $.graphcode.refresh('.img-code');
              }else{
                $.errorHandler('#surePhone','graphCode',data.msg);
                $.graphcode.refresh('.img-code');
              }
            },
            error: function(){
              $.errorHandler('#surePhone','graphCode','接口出错，请刷新页面重试！');
            }
          });
        }
        //发送短信
        function sendDx(){
          $.ajax({
            url: '/borrower/smscode/get_code_find_pwd',
            data: {
              mobile: phone
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(!result.code == 'iss.success'){
                $.errorHandler('#surePhone','',result.msg);
              }else{
                $('.getMessageCode').addClass('disabled');
                _this.count(60);
                if(result.verify==1){
                  $('.idCode').slideDown(500);
                }
              }
            },
            error: function(){
              $.errorHandler('#surePhone','','接口出错，请刷新页面重试！');
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
          $('.getMessageCode').html(second+'s');
          timer = setTimeout(countTime,1000);
        }else{
          clearTimeout(timer);
          $('.getMessageCode').html('获取验证码').removeClass('disabled');
        }
      }
      countTime();
    }
  };
  vender.init();
});