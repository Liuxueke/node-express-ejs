$(function (){
  var vender = {
    init:function (){
      this.share();
      this.copyLink();
      this.getCode();
    },
    copyLink:function (){
      var ieVersion = this.IEVersion();
      if(ieVersion == -1 || ieVersion>8){
        var clipboard = new Clipboard('.copy-btn');
        clipboard.on("success",function (e){
          $(".modal-box").show();
          e.clearSelection();
        });
      }
      $(".close-btn").on("click",function (){
        $(".modal-box").hide();
      });
    },
    share:function(){
      /*分享到微博*/
      var url = "https://www.mzmoney.com/register/index.htm?"+this.m;
      $(".weibo-share").on("click",function (){
        $(this).socialShare("sinaWeibo",{
          url: url,
          content:'我注册了妙资金融进行投资理财，新手注册即送10000元金包，免费拿收益，还能专享12.8%新手标，强烈推荐你也来喔!',
          title:'我注册了妙资金融进行投资理财，新手注册即送10000元金包，免费拿收益，还能专享12.8%新手标，强烈推荐你也来喔！'
        });
      });
      /*分享到qq空间*/
      $(".qq-share").on("click",function (){
        $(this).socialShare("qZone",{
          url:url,
          content:'我注册了妙资金融进行投资理财，新手注册即送10000元金包，免费拿收益，还能专享12.8%25新手标，强烈推荐你也来喔!',
          title:'妙资金融—中国互联网金融协会首批会员单位'
        });
      })
    },
    IEVersion:function (){
      var rv = -1;
      if (navigator.appName == 'Microsoft Internet Explorer'){
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          rv = parseFloat( RegExp.$1 );
      }else if (navigator.appName == 'Netscape'){
        var ua = navigator.userAgent;
        var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
          rv = parseFloat( RegExp.$1 );
      }
      return rv;
    },
    getCode:function (){
      $.ajax({
        url:'/specialtopic/invitation/baseInfo',
        type:'post',
        data:{
          topicsecret:'43AD63AA972B2AA7EC73E8566BA3C5AB'
        },
        success:function (result) {
          if(result.code == 'iss.success'){
            $('.people').text(result.invitate.inviterNum);
            $('.money').text(result.invitate.sumMoney);
          }else{
            $('.people').text(0);
            $('.money').text(0);
          }
        },
        error:function (err) {
          $('.people').text(0);
          $('.money').text(0);
        }
      })
      $('#codeBox').qrcode({
        width:140,
        height:140,
        text:'https://m.mzmoney.com/wx/invitation/land.htm?uid='+$('#userId').val()
      });
    }
  };
  vender.init();
});