$(function (){
  var timer;
  var vender = {
    init:function (){
      this.register();
      this.showRecommendPerson();
      this.getMessageCode();
      this.agree();
    },
    register:function (){
      $('#reg_form').validate({
        rules: {
          username: {
            required: true,
            remote: {
              url: "/register/valid_mobile",
              type: "post",
              data: {
                mobile : function() {
                  return $("#username").val()
                }
              }
            },
            checkPhone:true
          },
          password: {
            checkPassword:true,
            required: true,
            rangelength: [6, 16]
          },
          captcha:{
            required: true,
            digits:true,
            rangelength:[6,6]
          },
          recommondPersonTel:{
            checkPhone:true
          }
        },
        messages:{
          username:{
            required:"手机号码不能为空"
          },
          password:{
            required:"密码不能为空",
            rangelength: "请输入6-16位密码"
          },
          captcha:{
            required:"短信验证码不能为空",
            digits:"请输入正确的短信验证码",
            rangelength:"验证码长度为6位"
          }
        },
        focusCleanup:true,
        focusInvalid:false,
        debug: false,
        submitHandler: function(form) {
          if($('#reg_form').find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $('#reg_form').find('input[type=submit]').addClass('disabled');
          var agree = $("#agree").attr("checked");
          if(agree) {
            var formdata = $(form).serialize();
            $.ajax({
              type:"post",
              url:'/register/signup',
              data:formdata,
              dataType:"json",
              success:function (result){
                $('#reg_form').find('input[type=submit]').removeClass('disabled');
                if(result.code == 'iss.success'){
                  window.location.href = '/register/success';
                }else{
                  $.errorHandler('#reg_form','',result.msg);
                  $.graphcode.refresh('.img-code');
                }
              },
              error:function (err){
                $.errorHandler('#reg_form','','系统错误');
                $('#reg_form').find('input[type=submit]').removeClass('disabled');
              }
            });
          }else{
            $.errorHandler('#reg_form','','同意协议');
            $('#reg_form').find('input[type=submit]').removeClass('disabled');
          }
        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
    },
    showRecommendPerson:function (){
      $('.recommend').on('click',function (){
        if($(this).find("i").hasClass("showRecommend")){
          $(this).find("i").removeClass("showRecommend").addClass("hideRecommend");
          $("#username1-error").hide();
          $(".recommend-tel").slideUp();
          if(!$(this).hasClass("disabled")){
            $(".recommend-tel").find("input[type=text]").val("");
          }
        }else{
          $(this).find("i").removeClass("hideRecommend").addClass("showRecommend");
          $(".recommend-tel").slideDown();
        }
      });
    },
    getMessageCode:function (){
      var _this = this;
      $('#timer').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }else{
          $(this).addClass('disabled');
          var mobile = $("#username").val();
          var graphCode = $("#graphCode").val();
          var password = $("#password").val();
          var mobileRule = /^0?1[3|4|5|8][0-9]\d{8}$/;
          var passwordRule = /^[0-9a-zA-Z_]+$/;
          var graphCodeRule = /^[0-9a-zA-Z]+$/;
          $('.imgCodeBox').slideDown();
          if($('input[name=username]').hasClass('error') || $("input[name='password']").hasClass('error') || $("input[name='graphCode']").hasClass('error')){
            return false;
          }
          if ($.trim(mobile) == '') {
            $.errorHandler('#reg_form','username', '手机号码不能为空');
            return false;
          }
          if(!mobileRule.test(mobile)){
            $.errorHandler('#reg_form','username', '请正确填写手机号');
            return false;
          }
          if (password == "") {
            $.errorHandler('#reg_form', 'password','密码不能为空');
            return false;
          }
          if(password.length<6 || password.length>16){
            $.errorHandler('#reg_form','password','请输入6-16位密码');
            return false;
          }
          if(!passwordRule.test(password)){
            $.errorHandler('#reg_form','password','密码由字母、数字或下划线组成');
            return false;
          }
          if(graphCode == ''){
            $.errorHandler('#reg_form','graphCode','图片验证码不能为空');
            return false;
          }
          if(!graphCodeRule.test(graphCode)){
            $.errorHandler('#reg_form','graphCode','图片验证码格式错误');
            return false;
          }
          /*获取短信验证码*/
          _this.checkImgCode(graphCode,'#reg_form','graphCode',function (){
            $.ajax({
              type:'post',
              url:"/register/send",
              data:{
                mobile:mobile,
                graphCode:graphCode,
                password:password
              },
              dataType:'json',
              success:function (result){
                if(result.code == 'iss.success'){
                  $('.imgCodeBox').slideUp();
                  $.graphcode.refresh('.img-code');
                  _this.cutDownTime(60);
                }else{
                  $('#timer').removeClass('disabled');
                  $.errorHandler('#reg_form','',result.msg);
                  $.graphcode.refresh('.img-code');
                }
              },
              error:function (err){
                $('#timer').removeClass('disabled');
                $.errorHandler('#reg_form','',result.msg);
                $.graphcode.refresh('.img-code');
              }
            })
          });
        }
      });
    },
    agree:function (){
      $('.checkbox').on('click',function (){
        $(this).toggleClass('checked');
        var isAgree = $('#agree').attr('checked');
        $('#agree').attr('checked',!isAgree);
        if(!isAgree){
          $('div.error').hide();
        }
      })
    },
    cutDownTime:function (cutTime){
      timer = setInterval(function (){
        if(cutTime<0){
          //停止倒计时
          $('#timer').removeClass('disabled').val('重新获取');
          clearInterval(timer);
        }else{
          $('#timer').addClass('disabled').val(cutTime+"秒后重新发送");
        }
        cutTime --;
      },1000);
    },
    checkImgCode:function (code,form,imgName,callback){
      $.ajax({
        url:'/checkImg',
        type:'post',
        data:{
          captcha:code
        },
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            callback();
          }else{
            $.errorHandler(form,imgName,result.msg);
            $('#timer').removeClass('disabled');
          }
        },
        error:function (err){
          $.errorHandler(form,imgName,'图片验证码验证失败');
          $('#timer').removeClass('disabled');
        }
      })
    }
  };
  vender.init();
});
