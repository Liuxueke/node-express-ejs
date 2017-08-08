$(function (){
  var vender = {
    init:function (){
      this.setNavAmimate();
      this.headerBarLoginOut();
    },
    headerBarLoginOut:function (){
      //工具条退出登录
      this.width=$(window).width();
      var _this=this;
      $.ajax({
        url:'/ajax_status',
        type:'post',
        data:"",
        dataType:"html",
        success:function (result){
          $('.topBar-box').html(result);
          getWidth(_this.width);
          function getWidth(windowWidth){
            if(windowWidth >= 1312){
              $(".two-dimension-code-box").width("1312px").css({"left":"50%","margin-left":"-665px"});

            }else if(windowWidth >=1200){
              $(".two-dimension-code-box").width(windowWidth).css({"left":"0px","margin-left":"0px"});

            }else{
              $(".two-dimension-code-box").width("1200px").css({"left":"0px","margin-left":"0px"});

            }
          }
        },
        error:function (err){}
      })
      $("body").on('click','a.loginOut',function (){
        $.ajax({
          type:'post',
          url:'/login_out',
          data:{},
          dataType:'json',
          success:function (result){
            window.location.href='/';
          },
          error:function (err){
            window.location.href='/';
          }
        })
      });
    },
    setNavAmimate:function (){
      var navBtn = $(".nav ul li"),
        activeIndex = $(".navActive").index(),
        baseLeft = activeIndex * 110 + 20 + 'px',
        oBorder = $(".nav .border-btm");
      oBorder.css("left",baseLeft);
      navBtn.on("mouseover",function () {
        var index = $(this).index();
        oBorder.stop().animate({
          left:  index * 110 + 20 + 'px'
        },500);
      });
      navBtn.on("mouseout",function () {
        oBorder.stop().animate({
          left:  baseLeft
        },500);
      });

      //topBar微信二维码展示
      var windowWidth = $(window).width();
      $(window).resize(function (){
        var windowWidth = $(window).width();
        getWidth(windowWidth);
      });
      $("body").on('mouseover','li.weixin',function (){
        $(".two-dimension-code-box").show();
        $(this).find('a').stop().animate({"background-position-y":"-20px"},200);
      });
      $('body').on('mouseleave','li.weixin',function (){
        $(".two-dimension-code-box").hide();
        $(this).find('a').stop().animate({"background-position-y":"0px"},200);
      });
      $("body").on('mouseover','.weibo',function (){
        $(".weibo-link-box").show();
        $(this).children("a").stop().animate({"background-position-y":"-20px"},200);
      });
      $('body').on('mouseleave','li.weibo',function (){
        $(".weibo-link-box").hide();
        $(this).children("a").stop().animate({"background-position-y":"0px"},200);
      });
      function getWidth(windowWidth){
        if(windowWidth >= 1312){
          $(".two-dimension-code-box").width("1312px").css({"left":"50%","margin-left":"-665px"});

        }else if(windowWidth >=1200){
          $(".two-dimension-code-box").width(windowWidth).css({"left":"0px","margin-left":"0px"});

        }else{
          $(".two-dimension-code-box").width("1200px").css({"left":"0px","margin-left":"0px"});

        }
       /* if(windowWidth>=1200){
          $(".weibo-link-box").width("1225px").css({"left":"50%","margin-left":"-87px"});
        }else{
          $(".weibo-link-box").width("1200px").css({"left":"50%","margin-left":"-87px"});
        }*/
      }
    }
  };
  vender.init();
});