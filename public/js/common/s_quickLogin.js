var timer,telNumber,password,loginNumber;
$(function (){
  var vender = {
    init:function (){
      this.login();
      this.register();
      this.loginOut();
      this.getNewMessageCode();//重新获取短信验证码
      this.changeTelNumber();//更换手机号
      this.errorPass();//显示登录图片验证码
      this.removeErrorInfo();
      this.changeTabBox();
    },
    errorPass: function(){
      var flag = localStorage.getItem("errorPass");
      if(flag){
        $('#loginForm').find('span.graphCode').show();
      }
    },
    login:function (){
      var _this=this;
      $('#loginForm').validate({
        rules : {
          username : {
            required : true,
            remote: {
              url: '/username/valid',
              type: 'post',
              dataType: "json",
              data: {
                username: function(){
                  return $("#username").val().trim();
                }
              }
            }
          },
          password : {
            required : true,
            rangelength : [6, 16],
            checkPassword: true
          },
          checkcode : {
            required : true,
            rangelength : [4,4],
            checkGraphCode: true
          }
        },
        messages : {
          username : {
            required : "用户名不能为空",
            rangelength : '请输入正确的手机号'
          },
          password : {
            required : "登录密码不能为空",
            rangelength : '密码长度为6-16位'
          },
          checkcode : {
            rangelength:'验证码长度为4位',
            required : "验证码不能为空"
          }
        },
        debug:false,
        focusInvalid: false,
        onkeyup: false,
        submitHandler : function(){
          var username = ($('#username').val()).trim();
          var password = ($('#password').val()).trim();
          var checkcode = ($('#checkcode').val()).trim();
          var data={
            username: username,
            password: password,
            checkcode: checkcode
          };
          //判断是否需要输入验证码
          var isNeed = localStorage.getItem("errorPass");
          if(isNeed){
            _this.checkImgCode(checkcode,'#loginForm','checkcode',function (){
              _this.loginHandle(data);
            })
          }else{
            _this.loginHandle(data);
          }
        }
      });
    },
    loginHandle:function (data){
      var _this=this;
      $.ajax({
        url: '/login',
        data:data,
        type:'post',
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            if(localStorage.getItem("errorPass")){
              localStorage.removeItem('errorPass');
            }
            _this.getMessageNumber(result.mobile);
          }else{
            $.graphcode.refresh('.login-check-img-code');
            if(result.code == '300016' || result.code == '300017' || result.code == '300015'){//密码错误
              $.errorHandler('#loginForm','password',result.msg);
              $('#loginForm').find('span.graphCode').show();
              localStorage.setItem('errorPass','1');
            }else{
              $.errorHandler('#loginForm','',result.msg);
            }
          }
        },
        error:function (err){
          $.errorHandler('#loginForm','','系统错误');
        }
      })
    },
    loginOut:function (){
      $('body').on('click','a.safe-quit',function (){
        $.ajax({
          type:'post',
          url:'/login_out',
          dataType:'json',
          success:function (reuslt){
            window.location.reload();
          },
          error:function (err){}
        })
      });
    },
    register:function (){
      var _this = this;
      /*注册获取短信验证码*/
      var rules={
        mobile:{
          required:true,
          rangelength:[11,11],
          checkPhone:true,
          remote : {
            url : "/register/valid_mobile",
            type : "post",
            data : {
              username : function() {
                return $("#mobile").val();
              }
            }
          }
        },
        password:{
          required:true,
          checkPassword:true,
          rangelength:[6,16]
        },
        agree:{
          required:true
        }
      };
      var messages={
        mobile:{
          required:"手机号不能为空",
          rangelength:"请正确填写手机号码"
        },
        password:{
          required:"密码不能为空",
          rangelength:"密码长度为6-16位"
        },
        agree:{
          required:"请同意协议"
        }
      };
      _this.validateForm('#registerForm',rules,messages,function (){
        var captcha=$('#graphCode').val();
        var captchaRule=/^[0-9a-zA-Z]+$/;
        if(!captcha){
          $.errorHandler('#registerForm','graphCode',"验证码不能为空");
          return false;
        };
        if(captcha.length!=4 || !captchaRule.test(captcha)){
          $.errorHandler('#registerForm','graphCode',"验证码格式错误");
          return false;
        }
        if(!$('#agree').attr('checked')){
          $.errorHandler('#registerForm','',"请同意协议");
          return false;
        }
        _this.checkImgCode(captcha,'#registerForm','graphCode',function (){
          $.ajax({
            type: 'post',
            url: '/register/send',
            data: {
              mobile:$('#mobile').val()
            },
            dataType: 'json',
            success: function (result) {
              if (result.code=='iss.success') {
                telNumber=$('#mobile').val();
                password=$('#rePassword').val();
                $(".register-tab").hide();
                $('.prompt-message').show();
                $.graphcode.refresh('#reImgCode');
                $('.message-code').show().find('.telNumber').text(telNumber.substr(7,4));
                _this.setRemainTime(60);
              }else{
                $.errorHandler('#registerForm','',result.msg);
                $.graphcode.refresh('.regist-check-img-code');
              }
            },
            error: function (err) {
              $.errorHandler('#registerForm','','系统错误');
              $.graphcode.refresh('.regist-check-img-code');
            }
          });
        });

      });
      /*验证短信验证码完成注册*/
      var reRules={
        captcha:{
          required:true,
          rangelength:[6,6],
          checkMessageCode:true
        }
      };
      var reMessages={
        captcha:{
          required:"验证码不能为空",
          rangelength:"验证码长度为6位"
        }
      };
      _this.validateForm('#message-code',reRules,reMessages,function (){
        var data = {
          username:telNumber,
          password:password,
          captcha:$('#captcha').val(),
          recommondPersonTel:$('#recommenderson').val()
        };
        $.ajax({
          type:'post',
          url:'/register/signup',
          dataType:'json',
          data:data,
          success:function (result){
            if(result.code=="iss.success"){
              $('.message-code').hide();
              $('.handleRegisterBox').show();
              _this.checkRegisterStatus(result.orderNo);
            }else{
              $.errorHandler('#message-code','',result.msg);
            }
          },
          error:function (err){
            $.errorHandler('#message-code','','系统错误');
          }
        });
      });
    },
    getNewMessageCode:function (){
      var _this = this;
      $('#timer').on('click',function (){
        if($(this).hasClass('disabled')){
          return false;
        }
        $('.prompt-message').hide();
        $("#message-code").find('.graphCodeBox').removeClass('hide');
        var mobile = $("#mobile").val();
        var graphCode = $("#graphCode2").val();
        if($.trim(mobile) == ''){
          $.errorHandler('#message-code','','手机号不能为空');
          return false;
        }
        if(graphCode == ''){
          $.errorHandler('#message-code','graphCode2','图片验证码不能为空');
          return false;
        }
        _this.checkImgCode($("#graphCode2").val(),'message-code','graphCode2',function (){
          $('#timer').addClass('disabled');
          var param = {"mobile" : mobile, "checkcode":graphCode};
          $.ajax({
            url:'/register/send',
            type:'post',
            data:{
              mobile:telNumber
            },
            dataType:'json',
            success:function (result){
              if(result.code=='iss.success'){
                $('.graphCodeBox').addClass('hide');
                $(".prompt-message").show();
                _this.setRemainTime(60);
                $.graphcode.refresh('#reImgCode');
              }else{
                $('#timer').removeClass('disabled');
                $.errorHandler('#message-code','',result.msg);
                $.graphcode.refresh('#reImgCode');
              }
            }.bind(this),
            error:function (err){
              $(this).removeClass('disabled');
              $.errorHandler('#message-code','','系统错误');
              $.graphcode.refresh('#reImgCode');
            }.bind(this)
          });
        });


      });
    },
    changeTelNumber:function (){
      // 更换手机号码
      $("body").on("click",'.change-tel',function (){
        clearInterval(timer);
        $.graphcode.refresh('.regist-check-img-code');
        $('.register-tab').show();
        $('.message-code').hide();
        $('div.error').hide();
        $('span.code').hide();
      });
    },
    /*获取短信验证码倒计时*/
    setRemainTime:function (cutTime){
      $("#timer").text('重新获取'+cutTime).addClass('disabled');
      timer = setInterval(function (){
        if(cutTime < 0){
          //停止计时器
          clearInterval(timer);
          $("#timer").removeClass('disabled').text('重新获取');
        }else{
          $("#timer").text('重新获取'+cutTime).addClass('disabled');
        }
        cutTime --;
      },1000);
    },
    validateForm:function (form,rules,messages,callback){
      $(form).validate({
        rules:rules,
        messages:messages,
        debug : false,
        onkeyup:false,
        focusInvalid:false,
        submitHandler:function (){
          callback();
        }
      })
    },
    removeErrorInfo:function (){
      $('body').on('focus','input[type=text]',function (){
        $('div.error').hide();
      });
      $('body').on('focus','input[type=password]',function (){
        $('div.error').hide();
      });
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
          }
        },
        error:function (err){
          $.errorHandler(form,imgName,'图片验证码验证失败');
        }
      })
    },
    checkRegisterStatus:function (orderNo){
      var _this=this;
      var times=0;
      var setIntervalTime = 2000;
      timer=setInterval(function (){
        if(times>1){
          setIntervalTime = 1000;
        }
        if(times>3){
          clearInterval(timer);
          return false;
        }
        $.ajax({
          url:'/check_status',
          type:'post',
          data:{
            order_no:orderNo
          },
          dataType:'json',
          success:function (result){
            if(result.code == "iss.success"){
              if(result.state != 4){
                $('.handleRegisterBox').find('p').text('注册处理中，请耐心等待......');
              }else{
                //注册成功自动登录
                clearInterval(timer);
                var data={
                  username:telNumber,
                  password:password
                };
                _this.loginHandle(data)
              }
            }
          },
          error:function (err){}
        });
        times ++;
      },setIntervalTime);
    },
    getMessageNumber:function (mobile){
      var _this=this;
      $.ajax({
        url:'/get_message_number',
        type:'post',
        data:'',
        success:function (result){
          window.location.reload();
        },
        error:function (err){
          window.location.reload();
        }
      });
    },
    changeTabBox:function (){
      /*登录框tab切换*/
      $("body").on("click",'.tab-btn span',function (){
        $("input[type != submit]").val("");
        $("label.error").hide();
        $(".message-code").hide();
        $(".error-box").hide();
        var index = $(this).index();
        $(this).removeClass("tab-active").siblings("span").addClass("tab-active");
        $(".tabs-box").eq(index).show().siblings(".tabs-box").hide();
      });
    },
  };
  vender.init();
  $(".input-box input").on("focus",function (){
    $(this).next(".error").hide();
    $("div.error").hide();
  });
});
