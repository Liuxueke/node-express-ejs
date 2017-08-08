$(function (){
  var vender = {
    init:function (){
      this.timeCutDwon();
      this.progress();
    },
    timeCutDwon:function (){
      var oBli = $(".not-begin");
      var hour = 0;
      var minute = 0;
      var second = 0;
      oBli.each(function (i, value) {
        var cutTime = parseInt((oBli.eq(i).children(".cut-time").val()) / 1000);//倒计时总的时间戳
        getTime(cutTime);
        /*倒计时*/
        oBli.eq(i).find(".progress-text").html("距离开始" + hour + ":" + minute + ":" + second);
        var timer = setInterval(function () {
          cutTime--;
          if (cutTime >= 0) {
            //未开始
            getTime(cutTime);
            oBli.eq(i).find(".progress-text").html("距离开始" + hour + ":" + minute + ":" + second)
          } else {
            //开始
            clearInterval(timer);
            oBli.eq(i).removeClass("not-begin").find(".progress-line-box > span").html("0%").siblings(".progress-line").append("<em><i></i></em>");
            oBli.eq(i).find(".progress-text").html("剩余可投" + oBli.eq(i).find('.surplusInvestAmount').val() + "元");
            oBli.eq(i).find(".btn").children("a").html("立即投资").removeClass("disabled");
          }
        }, 1000);
      });
      function getTime(cutTime) {
        hour = Math.floor(cutTime / (60 * 60));
        minute = Math.floor((cutTime - hour * 60 * 60) / 60);
        second = cutTime - hour * 60 * 60 - minute * 60;
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (minute < 10) {
          minute = "0" + minute;
        }
        if (second < 10) {
          second = "0" + second;
        }
      }
    },
    progress:function (){/*进度条动画*/
      $(".progress-line-box").each(function (i,value){
        var width = $(".progress-line-box").eq(i).children("span").html();
        $(".progress-line-box").eq(i).children(".progress-line").children("em").animate({"width":width},1000);
        if(width == "100%"){
          $(".progress-line-box").eq(i).children(".progress-line").children("em").find("i").hide();
        }
      });
    }
  };
  vender.init();
});