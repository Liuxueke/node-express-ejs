$(function (){
  var vender = {
    init:function (){
      this.width=$(window).width();
      this.banner();
      this.partnerLink();
      this.getNumber();
      this.agreement();
      this.getProductList();
      this.showModal();
      this.closeNotice();
    },
    banner:function (){
      var mySwiper = new Swiper('.swiper-container',{
        autoplay:3000,
        pagination : '.swiper-pagination',
        autoHeight:false,
        loop:true
      });
      $('.swiper-container').find('.swiper-slide').each(function (i,value){
        var backGround= $(value).data('bkg');
        $(value).css("background","url("+backGround+") center center no-repeat");
      });
    },
    getNumber:function (){
      $.ajax({
        url:'/getPlatformData',
        type:'post',
        data:'',
        dataType:'json',
        success:function (result){
          $('.end-time').text(result.nowDate);
          numScroll(parseInt(result.cumulativeInvestment), ".J_num");//102,7003,8745
          numScroll(parseInt(result.dividend), ".J_num2");
          numScroll(parseInt(result.registraters), ".J_num3");
        },
        error:function (err){
          numScroll(0, ".J_num");//102,7003,8745
          numScroll(0, ".J_num2");
          numScroll(0, ".J_num3");
        }
      });

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
    partnerLink:function (){
      var partnerSwiper = new Swiper('.partner-swiper-container',{
        autoplay : 2000,//可选选项，自动滑动
        loop : true,//可选选项，开启循环
        slidesPerView : 5,
        autoResize : false,
        speed:2000,
        autoplayDisableOnInteraction:false,
        loopedSlides:3,
        loopAdditionalSlides:1,
        slidesPerGroup:3,
        moveStartThreshold:1,
        grabCursor:true
      });
      $(".toRight").on("click",function (){
        partnerSwiper.swipeNext();
      });
      $(".toLeft").on("click",function (){
        partnerSwiper.swipePrev();
      });
    },
    checkBox:function (id,oBthis){/*多选框方法*/
      var isChecked = $(id).attr("checked");
      $(id).attr("checked",!isChecked);
      $(oBthis).toggleClass("checked");
      $("#agree-error").hide();
      if(!isChecked){
        $('div.error').hide();
      }
    },
    agreement:function (){
      var _this = this;
      $("#agreement").on("click",function (){
        _this.checkBox("#agree","#agreement");
      })
    },
    closeNotice:function (){
      $(".notice-box a").find("span").on("click",function (e){
        e.stopPropagation();//阻止事件冒泡
        e.preventDefault();//阻止默认事件
        $(".notice-box").slideUp(500);
      });
    },
    getProductList:function (){
      /*获取产品列表*/
      $.ajax({
        url:'/product_list',
        type:'post',
        data:'',
        dataType:'html',
        success:function (result){
          $('#product_list').html(result);
        },
        error:function (err){}
      });
      /*获取登录框*/
      $.ajax({
        url:'/quick_login',
        type:'post',
        data:'',
        dataType:'html',
        success:function (result) {
          $('.quickLogin-outerBox').html(result);
        },
        error:function (err){}
      })
    },
    showModal:function (){
      $.ajax({
        url:'/check_login',
        type:'post',
        data:'',
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            var isShow=localStorage.getItem('warmTip');
            if(isShow && isShow != 'show'){
              $('.modalBox').show();
              localStorage.setItem('warmTip','show');
            }
          }
        },
        error:function (err){}
      });
      $('.closeBtn').on("click",function (){
        $('.modalBox').hide();
      });
    },

  };
  vender.init()
});