$(function (){
  $(".qq-fixed").on("click",function (){
    /*var trueName = "",
     phone = "",
     userNickname = "",
     description = "",
     qq = "",
     companyName = "",
     email = "";
     $.ajax({
     url:"/easemob.htm",
     type:"post",
     data:{},
     dataType:"json",
     async:false,
     success:function (data){
     data.username && (trueName = data.username);
     data.mobile && (phone = data.mobile);
     data.niceName && (userNickname = data.niceName);
     data.description && (description = data.description);
     data.email && (email = data.email);
     },
     error:function (){}
     });*/
    easemobim.bind({
      tenantId: 644,
      hide:true,//隐藏
      autoConnect:true,//同步消息，当会话框最小化时收到消息提醒
      ticket:true,//展示留言入口,若关闭在下班之后自动进入留言入口
      hideStatus:false,
      offDutyType: 'chat',//下班后消息进入待接入
      dialogPosition: {x:"100px",y:"100px"},
      satisfaction:false
      /*visitor: {         //访客信息，以下参数支持变量
       trueName:trueName,
       qq: qq,
       phone: phone,
       companyName: companyName,
       userNickname: userNickname,
       description: description,
       email: email
       }*/
    });
  });
  $(".connect-fixed a").hover(function (){
    var textHtml;
    var index = $(this).parent().index();
    /*if(index == 0){
     textHtml = "下载app"
     }else if(index == 1){
     textHtml = "联系客服"
     }else if(index ==2){
     textHtml = "回到顶部"
     }*/
    $(this).addClass("hoverbg");
    $(this).next("div").show();
  },function (){
    $(this).removeClass("hoverbg");
    $(this).next("div").hide();
  });
  /*回到顶部*/
  $(".toTop-fixed").on("click",function (){
    $(document.documentElement).animate({scrollTop:0},1000);//for Firefox&IE
    $("body").animate({scrollTop:0},1000);//for Chrome
  });
  $(window).on("scroll",function (){
    var scrollTop = $(window).scrollTop();
    if(scrollTop > 300){
      $(".topFix-box").css("visibility","visible");
    }else{
      $(".topFix-box").css("visibility","hidden");
    }
  });
});