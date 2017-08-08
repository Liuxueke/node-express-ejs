$(function () {
  var timer;
  var vender = {
    init:function () {
      this.getNumber();
      this.getMessageCode();
      this.register('#pageForm');
      this.register('#modalForm');
      this.removeError();
      this.agree();
      this.closeModal();
      this.openModal();
    },
    register:function (form){
      var _this = this;
      $(form).validate({
        rules: {
          username: {
            required: true,
            remote: {
              url: "/register/valid_mobile",
              type: "post",
              data: {
                mobile : function() {
                  return $(form).find(".username").val()
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
        errorElement:'em',
        submitHandler: function(form) {
          if($(form).find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $(form).find('input[type=submit]').addClass('disabled');
          var agree = $(form).find(".agree").attr("checked");
          if(agree) {
            $.ajax({
              type:"post",
              url:'/register/signup',
              data:{
                username:$(form).find('.username').val(),
                password:$(form).find('.password').val(),
                captcha:$(form).find('.captcha').val(),
                recommondPersonTel:''
              },
              dataType:"json",
              success:function (result){
                $(form).find('input[type=submit]').removeClass('disabled');
                if(result.code == 'iss.success'){
                  window.location.href = '/register/success';
                }else{
                  _this.errorHandler(form,'',result.msg);
                  $.graphcode.refresh('.img-code');
                }
              },
              error:function (err){
                $(form).find('input[type=submit]').removeClass('disabled');
              }
            });
          }else{
            _this.errorHandler(form,'','同意协议');
            $(form).find('input[type=submit]').removeClass('disabled');
          }
        },
        errorPlacement: function(error, element) {
          error.appendTo(element.parent('div'));
        },
      });
    },
    getNumber:function (){
      var userInvs = 0;
      var dividend = 0;
      var registraters = 0;
      $.ajax({
        url:"/getPlatformData",
        data:{},
        dataType:"json",
        type:"post",
        async:false,
        success:function (data){
          userInvs = parseInt(data.cumulativeInvestment);
          dividend = parseInt(data.dividend);
          registraters = parseInt(data.registraters);
        },
        error:function (){}
      });
      numScroll(userInvs, ".J_num");//102,7003,8745
      numScroll(dividend, ".J_num2");
      numScroll(registraters, ".J_num3");
      function numScroll (num, container) {
        var oBox = $(container);
        var million = (Math.floor(num/100000000)).toString();
        var myria = (Math.floor((num-million*100000000)/10000)).toString();
        var yuan = (num - million*100000000-myria*10000).toString();//元
        var millionGroup = getHtmlStr(million);
        var myriaGroup = getHtmlStr(myria);
        var amountGroup = getHtmlStr(yuan);
        if(container == ".J_num3"){
          if(num>=100000000){
            oBox.append(millionGroup+"<span class='unit'>亿</span>"+myriaGroup+"<span class='unit'>万</span>"+amountGroup+"<span class='unit'>人</span>");
          }else if(num<100000000 &&num>=10000){
            oBox.append(myriaGroup+"<span class='unit'>万</span>"+amountGroup+"<span class='unit'>人</span>");
          }else if(num<10000){
            oBox.append(amountGroup+"<span class='unit'>人</span>");
          }
        }else{
          if(num>=100000000){
            oBox.append(millionGroup+"<span class='unit'>亿</span>"+myriaGroup+"<span class='unit'>万</span>"+amountGroup+"<span class='unit'>元</span>");
          }else if(num<100000000 &&num>=10000){
            oBox.append(myriaGroup+"<span class='unit'>万</span>"+amountGroup+"<span class='unit'>元</span>");
          }else if(num<10000){
            oBox.append(amountGroup+"<span class='unit'>元</span>");
          }
        }

        var bitBox = oBox.find(".number-box");
        bitBox.each(function (i,value) {
          var $this = $(this);
          $this.append("<em>0</em>");
          var currentNumber = 0;
          num = Number(million + myria + yuan);
          var timer = setInterval(function (){
            if(bitBox.eq(i).children("em").html() >= (num.toString()).charAt(i)){
              clearInterval(timer);
            }else{
              bitBox.eq(i).children("em").html(currentNumber)
            }
            currentNumber ++;
          },500/((num.toString()).charAt(i)))
        });

      }
      function getHtmlStr(amount){//根据位数拼接html结构
        var amountHtml = "";
        var million = (Math.floor(amount/100000000)).toString();//亿
        var myria = (Math.floor((amount-million*100000000)/10000)).toString();//万
        var yuan = (amount - million*100000000-myria*10000).toString();//元

        for (var i=0;i<amount.length;i++){
          if(i == 0){
            amountHtml =  "<span class='number-box'></span>";
          }else{
            amountHtml += "<span class='number-box'></span>";
          }
        }
        return amountHtml;
      }
    },
    agree:function (){
      $('.checkbox').on('click',function (){
        $(this).toggleClass('checked');
        var isAgree = $(this).siblings('.agree').attr('checked');
        $(this).siblings('.agree').attr('checked',!isAgree);
        if(!isAgree){
          $('.total-error').hide();
        }
      })
    },
    getMessageCode:function (){
      var _this = this;
      $('.timer').on('click',function (){
        var form = '#'+$(this).parents('form').attr('id');
        if($(this).hasClass('disabled')){
          return false;
        }else{
          $(this).addClass('disabled');
          var mobile = $(form).find('input[name=username]').val();
          var graphCode = $(form).find('input[name=graphCode]').val();
          var password = $(form).find('input[name=password]').val();
          var mobileRule = /^0?1[3|4|5|8][0-9]\d{8}$/;
          var passwordRule = /^[0-9a-zA-Z_]+$/;
          var graphCodeRule = /^[0-9a-zA-Z]+$/;
          $(form).find('.imgCodeBox').slideDown();
          if ($.trim(mobile) == '') {
            _this.errorHandler(form,$(form).find('input[name="username"]').attr('id'), '手机号码不能为空');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if(!mobileRule.test(mobile)){
            _this.errorHandler(form,$(form).find('input[name="username"]').attr('id'), '请正确填写手机号');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if (password == "") {
            _this.errorHandler(form,$(form).find('input[name="password"]').attr('id'),'密码不能为空');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if(password.length<6 || password.length>16){
            _this.errorHandler(form,$(form).find('input[name="password"]').attr('id'),'请输入6-16位密码');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if(!passwordRule.test(password)){
            _this.errorHandler(form,$(form).find('input[name="password"]').attr('id'),'密码由字母、数字或下划线组成');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if(graphCode == ''){
            _this.errorHandler(form,$(form).find('input[name="graphCode"]').attr('id'),'图片验证码不能为空');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          if(!graphCodeRule.test(graphCode)){
            _this.errorHandler(form,$(form).find('input[name="graphCode"]').attr('id'),'图片验证码格式错误');
            $(form).find('.timer').removeClass('disabled');
            return false;
          }
          /*获取短信验证码*/
          _this.checkImgCode(graphCode,form,$(form).find('input[name="graphCode"]').attr('id'),function (){
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
                  $(form).find('.imgCodeBox').slideUp();
                  $.graphcode.refresh('.img-code');
                  _this.cutDownTime(form,60);
                }else{
                  $(form).find('.timer').removeClass('disabled');
                  _this.errorHandler(form,'',result.msg);
                  $(form).find('.timer').removeClass('disabled');
                  $.graphcode.refresh('.img-code');
                }
              },
              error:function (err){
                $(form).find('.timer').removeClass('disabled');
                _this.errorHandler(form,'',result.msg);
                $(form).find('.timer').removeClass('disabled');
                $.graphcode.refresh('.img-code');
              }
            })
          });
        }
      });
    },
    removeError:function () {
      $('input[type=text]').on('focus',function () {
        $('.total-error').hide();
        $(this).siblings('em').hide();
      });
      $('input[type=password]').on('focus',function () {
        $('.total-error').hide();
        $(this).siblings('em').hide();
      })
    },
    errorHandler:function tips(form,name,msg) {
      if(name){
        if($(form).find('#'+ name +'-error').length > 0){
          $(form).find('#'+ name +'-error').text(msg).removeClass('valid').show();
          $(form).find('#'+ name +'').addClass('error');
        }else{
          var error =  $('<em id="'+ name +'-error" class="error">'+msg +'</em>');
          error.appendTo($(form).find('#'+ name).parent());
        }
      }else{
        var elemError = $(form).find('.total-error');
        if(elemError.length == 0){
          elemError = '<em class="total-error">'+msg+'</em>';
          $(form).find('input[type=submit]').before(elemError);
        }else{
          $(elemError).text(msg).show();
        }
      };
    },
    checkImgCode:function (code,form,imgName,callback){
      var _this = this;
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
            _this.errorHandler(form,imgName,result.msg);
            $(form).find('.timer').removeClass('disabled');
          }
        },
        error:function (err){
          _this.errorHandler(form,imgName,'图片验证码验证失败');
          $(form).find('.timer').removeClass('disabled');
        }
      })
    },
    cutDownTime:function (form,cutTime){
      timer = setInterval(function (){
        if(cutTime<0){
          //停止倒计时
          $(form).find('.timer').removeClass('disabled cutdown').val('重新获取');
          clearInterval(timer);
        }else{
          $(form).find('.timer').addClass('disabled cutdown').val(cutTime+"秒后重新发送");
        }
        cutTime --;
      },1000);
    },
    openModal:function () {
      $('.opendialog').on('click',function () {
        if($('#pageForm').find('.timer').hasClass('cutdown')){
          return false;
        }else{
          $('#modalForm').find('.captchaImg').attr('src','/getImg?t='+Math.random());
          $('.dialog').show();
        }
      });
    },
    closeModal:function () {
      $('.close').on('click',function () {
        window.clearInterval(timer);//停止计时器
        $('.timer').removeAttr("disabled").removeClass('disabled').val('获取验证码');
        $('#modalForm').find('.imgCodeBox').show();
        $('#modalForm em').text("");
        $('#modalForm').find('input[type=text]').val("");
        $('#modalForm').find('input[type=password]').val("");
        $('#pageForm').find('.captchaImg').attr('src','/getImg?t='+Math.random());
        $('.dialog').hide();
      });
    }
  };
  vender.init();
});