$(function(){
  var vender = {
    init: function(){
      this.width=$(window).width();
      this.login();
      this.countTime();
      this.calculator();
      this.errorPass();
      this.investBtn();
      this.renderPage();
      this.imgShow();
    },
    renderPage:function (){
      /*募集进度*/
      $.ajax({
        url:'/detail_invest',
        type:'post',
        data:{productId:$('#productId').val()},
        dataType:'html',
        success:function (result){
          $('#detail_invest').html(result);
        },
        error:function (err){}
      });
      /*投资记录*/
      $.ajax({
        url:'/detail_record',
        type:'post',
        data:{productId:$('#productId').val()},
        dataType:'html',
        success:function (result){
          $('#detail_record').html(result);
          var scrollTopArr = [];
          $(".model-box").each(function (i,value){
            scrollTopArr.push(Math.floor(($(".model-box").eq(i).offset().top-150)));
          });
          $(".model-tab ul li").on("click",function (){
            var index = $(this).index();
            windowScroll(scrollTopArr[index]);
          });
          $(window).scroll(function (){
            var scrollHeight = $(window).scrollTop();
            if(scrollHeight >= 560){
              $(".model-tab").css({"position":"fixed","top":"0px","left":"0","width":"100%"})
            }else{
              $(".model-tab").css({"position":"relative","top":"0px","left":"0px","margin-left":"0px"})
            }
            if(scrollHeight >= (scrollTopArr[0]-78)){
              chooseTab(0);
            }
            if(scrollHeight >= (scrollTopArr[1]-78)){
              chooseTab(1);
            }
            if(scrollHeight >= (scrollTopArr[2]-78)){
              chooseTab(2);
            }
          });
          function windowScroll(top){
            $(document.documentElement).animate({scrollTop:top},1000);//for Firefox&IE
            $("body").animate({scrollTop:top},1000);//for Chrome
          }
          function chooseTab(i){
            var objLi = $(".model-tab ul li");
            objLi.eq(i).addClass("active").siblings("li").removeClass("active");
          }
        },
        error:function (err){}
      });
    },
    errorPass: function(){
      var flag = localStorage.getItem("errorPass");
      if(flag){
        $('.login-form .code').removeClass('hidden');
      }
    },
    //立即投资判断是否登录
    investBtn: function(){
      $('body').on('click','.invest-btn',function(){
        var payment_id = $(this).attr('data-id');
        if($(this).hasClass('ing')){
          $.ajax({
            url:'/check_login',
            type: 'post',
            data:{},
            dataType: 'json',
            success: function(result){
              if(result.code == "iss.error"){
                /*未登录*/
                layer.open({
                  title:'登录',
                  type: 1,
                  content:$('#loginBox'),
                  closeBtn:2,
                  area: ['600px', '350px']
                });
              }else{
                window.location.href = '/payment/'+payment_id;
              }
            },
            error: function(){}
          });
        }
      });
    },
    //登录验证
    login:function(){
      var _this=this;
      $("#pop-login-form").validate({
        rules: {
          username: {
            required: true,
            minlength:6,
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
          password: {
            required: true,
            rangelength: [6,16],
            checkPassword: true
          },
          graphCode: {
            required: true,
            rangelength: [4,4],
            checkGraphCode: true
          }
        },
        messages:{
          username: {
            required: '用户名不能为空',
            minlength:'最少6位长度'
          },
          password: {
            required: '登录密码不能为空',
            rangelength: '密码长度为6-16位'
          },
          graphCode: {
            required: '验证码不能为空',
            rangelength: '验证码长度为4位'
          }
        },
        debug:false,
        focusCleanup:true,
        focusInvalid:false,
        onkeyup: false,
        success : "valid",
        submitHandler: function(){
          if($('#pop-login-form').find('input[type=submit]').hasClass('disabled')){
            return false;
          }
          $('#pop-login-form').find('input[type=submit]').addClass('disabled');
          var username = ($('#username').val()).trim();
          var password = ($('#password').val()).trim();
          var checkcode = ($('#graphCode').val()).trim();
          //判断是否需要输入验证码
          var isNeed = localStorage.getItem("errorPass");
          if(isNeed){
            judgmentImgCode();
          }else{
            judgmentLogin();
          }
          //判断图形验证码
          function judgmentImgCode(){
            $.ajax({
              url: '/checkImg',
              type: 'post',
              dataType: "json",
              data: {
                captcha: checkcode
              },
              success: function(data){
                if(data.code == 'iss.success'){
                  judgmentLogin();
                }else{
                  $.errorHandler('#pop-login-form','graphCode',data.msg);
                }
                $('#pop-login-form').find('input[type=submit]').removeClass('disabled');
              },
              error: function(){
                $.errorHandler('#pop-login-form','graphCode','图片验证码验证失败');
                $('#pop-login-form').find('input[type=submit]').removeClass('disabled');
              }
            })
          }
          //判断密码
          function judgmentLogin(){
            $.ajax({
              url: '/login',
              data: {
                username: username,
                password: password,
                checkcode: checkcode
              },
              type: 'post',
              dataType: 'json',
              success: function(result){
                if(result.code == 'iss.success'){
                  if(localStorage.getItem("errorPass")){
                    localStorage.removeItem('errorPass');
                  }
                  _this.getMessageNumber();
                }else{
                  $.graphcode.refresh('#validCode');
                  if(result.code == '300016' || result.code == '300017' || result.code == '300015'){//密码错误
                    $.errorHandler('#pop-login-form','password',result.msg);
                    /*密码错误展示图片验证码*/
                    $('.login-form .code').removeClass('hidden');
                    localStorage.setItem('errorPass','1');
                  }else{
                    $.errorHandler('#pop-login-form','',result.msg);
                  }
                }
                $('#pop-login-form').find('input[type=submit]').removeClass('disabled');
              },
              error: function(){
                $.errorHandler('#pop-login-form','','系统错误');
                $('#pop-login-form').find('input[type=submit]').removeClass('disabled');
              }
            });
          }
        }
      })
    },
    getMessageNumber:function (){
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
      })
    },
    //预售倒计时
    countTime: function(){
      var _this = this;
      var flag = $('.invest-btn').hasClass('comeSoon');
      var distance = $('.invest-btn').attr('data-counttime');
      var timer;
      if(flag){
        cutTime();
        timer = setInterval(cutTime,1000);
      }
      function cutTime(){
        var day = parseInt(distance / (1000 * 24 * 60 * 60));
        var hour = parseInt((distance % (1000 * 24 * 60 * 60)) / (1000 * 60 * 60));
        var minute = parseInt(((distance % (1000 * 24 * 60 * 60)) % (1000 * 60 * 60)) / (1000 * 60));
        var second = parseInt((((distance % (1000 * 24 * 60 * 60)) % (1000 * 60 * 60)) % (1000 * 60)) / 1000);
        if (second >= 0) {
          $('.invest-btn').html('距离开始：'+day + '天' + hour + '时' + minute + '分' + second + '秒');
        } else {
          clearInterval(timer);
          $('.invest-btn').removeClass('comeSoon').addClass('ing').html('立即投资');
        }
        distance-=1000;
      }
    },
    //计算器
    calculator:function (){
      $("#calculator").on("keyup",function (){
        var money = $(this).val();
        var rate_base = $(".rate li").eq(0).find(".rate_base").text();
        var rate_add = $(".rate li").eq(0).find(".rate_add").text();
        if(rate_add==''){
          var rateStr = parseFloat(rate_base.substr(0,rate_base.length-1));
        }else{
          var rateStr = parseFloat(rate_base.substr(0,rate_base.length-1))+parseFloat(rate_add.substr(1,rate_add.length-1));
        }
        var timeStr = $(".rate li").eq(2).find("p").html();
        var rate = rateStr/100;
        var time = timeStr.substr(0,timeStr.length-1);
        if(parseFloat(money)){
          $(".right").find("i").html((money*rate*time/365).toFixed(2))
        }else{
          $(".right").find("i").html(0)
        }
      });
    },
    imgShow:function (){
      $('.img-box').viewer({
        url: 'data-original'
      });
      $("body").on("click",".viewer-canvas",function (){
        $(".viewer-close").trigger("click");
      });
    }
  };
  vender.init();
});