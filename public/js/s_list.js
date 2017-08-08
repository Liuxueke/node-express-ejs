$(function (){
  var vender={
    init:function (){
      this.changeTab();
      this.lookMore();
    },
    pageSize:10,
    changeTab:function (){
      var _this=this;
      $('.list-tabs>a').on('click',function (){
        var index=$(this).index();
        $(this).addClass('active').siblings('a').removeClass('active');
        if(index == 0){
          _this.getSaleList();
        }else{
          _this.getSoldList(1,true);
        }

      });
    },
    getSaleList:function (){
      var _this=this;
      $('#paginationBox').hide();
      $.ajax({
        url:'/product/sale_list',
        type:'post',
        data:{},
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            _this.getSaleContent(result);
          }
        },
        error:function (err){}
      })
    },
    getSoldList:function (pageNo,isInitPagination){
      var _this=this;
      $.ajax({
        url:'/product/sell_well',
        type:'post',
        data:{
          pageNo:pageNo,
          pageSize:_this.pageSize
        },
        dataType:"json",
        success:function (result){
          if(result.code=="iss.success"){
            _this.getSoldContent(result);
            if(isInitPagination){
              var totalPage=result.totalPage;
              _this.pagination(totalPage);
              $('#paginationBox').show();
            }
          }
        },
        error:function (err){}
      });
    },
    getSaleContent:function (result){
      var saleContent='<ul><li class="onlyNew"><img src="https://r.mzmoney.com/mz/img/hpimg/productList/newOnly.jpg" alt=""></li>';
      result.newProductList.forEach(function (item,index){
        saleContent += '<li class="productBox ';
        if(item.sell==-1){
          saleContent += 'not-begin';
        }
        if(item.sell==1){
          saleContent += 'sellWell';
        }
        saleContent += '"><input type="hidden" class="surplusInvestAmount" value="'+item.surplusInvestAmount+'"><input type="hidden" class="cut-time" value='+item.countDown+'><div class="product-box fl"><h3 class="product-name fl"';
        if(!item.activitys){
          saleContent += 'style="margin-top: 12px;"';
        }
        saleContent += '>'+item.productName+'</h3>';
        if(item.activitys){
          saleContent += '<a href="'+item.activitys.activityUrl+'" class="activity" target="_blank">'+item.activityTitle.activityTitle+'</a>';
        }
        saleContent += '</div><div class="fl"><p class="colred firstLine fs24"><font class="fs20">'+item.minYearIncome+'%</font>';
        if(item.incomePlus){
          saleContent += '+<font class="fs16">'+item.incomePlus+'%</font>';
        }
        saleContent += '</p><p class="fs14 secondLine">预期年化收益</p></div><div class="fl"><p class="firstLine fs20">'+item.partInvestAmount+'元</p><p class="fs14 secondLine">起投金额</p> </div><div class="fl"><p class="firstLine fs20">'+item.interestLimitDes+item.interestLimitType+'</p><p class="fs14 secondLine">投资期限</p></div>';
        if(item.tip == 2){
          saleContent += '<div class="progress fl"><p class="experience fs14">体验虚拟投资<br>本金我出，利息归您</p></div>'
        }else{
          if(item.sell == -1){
            saleContent += '<div class="progress fl"><div class="progress-line-box"><p class="progress-line fl"></p><span class="fr fs14"></span></div><p class="progress-text fs14 cut-down">距离开始00:00:00</p></div>';
          }else{
            saleContent += '<div class="progress fl"><div class="progress-line-box"><p class="progress-line fl">';
            if(item.sell != 1){
              saleContent += '<em><i></i></em>'
            }
            saleContent += '</p><span class="fr fs14">'+item.progress+'%</span></div><p class="progress-text fs14 secondLine">剩余投资0元</p></div>'
          }
        }
        saleContent += '<div class="btn fr">'
        if(item.sell == 0 ){
          saleContent += '<a href="/detail/'+item.productId+'" target="_blank" class="fs20">立即抢购</a>'
        }else if(item.sell == 1){
          saleContent += '<a class="disabled" href="/detail/'+item.productId+'" target="_blank" class="fs20">已售罄</a>'
        }else {
          saleContent += '<a class="disabled" href="/detail/'+item.productId+'" target="_blank" class="fs20">了解详情</a>'
        }
        saleContent += '</div>';
        if(item.tip == 1){
          saleContent += '<span class="icon fs14 news">新手专享</span>'
        }
        if(item.tip == 2){
          saleContent += '<span class="icon fs14 taste">体验金</span>';
        }
        saleContent += '</li>';
      });
      saleContent += '<li class="nothing"></li><li class="onlyNew"><img src="https://r.mzmoney.com/mz/img/hpimg/productList/hotSale.jpg" alt=""></li>';
      result.productList.forEach(function (item,index){
        saleContent += '<li class="productBox';
        if(item.sell == -1){
          saleContent += ' not-begin'
        }
        if(item.sell == 1){
          saleContent += ' sellWell'
        }
        saleContent += '"><input type="hidden" class="surplusInvestAmount" value="'+item.surplusInvestAmount+'"><input type="hidden" class="cut-time" value='+item.countDown+'><div class="product-box fl"><h3 class="product-name fl"';
        if(!item.activitys){
          saleContent += 'style="margin-top: 12px;"'
        }
        saleContent += '>'+item.productName+'</h3>';
        if(item.activitys){
          saleContent += '<a href="'+item.activitys.activityUrl+'" class="activity" target="_blank">'+item.activityTitle.activityTitle+'</a>';
        }
        saleContent += '</div><div class="fl"><p class="colred firstLine fs24"><font class="fs20">'+item.minYearIncome+'%</font>';
        if(item.incomePlus){
          saleContent += '+<font class="fs16">'+item.incomePlus+'%</font>';
        }
        saleContent += '</p><p class="fs14 secondLine">预期年化收益</p></div><div class="fl"><p class="firstLine fs20">'+item.partInvestAmount+'元</p><p class="fs14 secondLine">起投金额</p></div><div class="fl"><p class="firstLine fs20">'+item.interestLimitDes+item.interestLimitType+'</p><p class="fs14 secondLine">投资期限</p></div>';
        if(item.sell == -1){
          saleContent += '<div class="progress fl"><div class="progress-line-box"><p class="progress-line fl"></p><span class="fr fs14"></span></div><p class="progress-text fs14 cut-down">距离开始00:00:00</p></div>'
        }else{
          saleContent += '<div class="progress fl"><div class="progress-line-box"><p class="progress-line fl">';
          if(item.sell != 1){
            saleContent += '<em><i></i></em>'
          }
          saleContent += '</p><span class="fr fs14">'+item.progress+'%</span></div><p class="progress-text fs14 secondLine">剩余投资0元</p></div>'
        }
        saleContent += '<div class="btn fr">';
        if(item.sell == 0 ){
          saleContent += '<a href="/detail/'+item.productId+'" target="_blank" class="fs20">立即抢购</a>'
        }else if(item.sell == 1){
          saleContent += '<a class="disabled" href="/detail/'+item.productId+'" target="_blank" class="fs20">已售罄</a>'
        }else{
          saleContent += '<a class="disabled" href="/detail/'+item.productId+'" target="_blank" class="fs20">了解详情</a>'
        }
        saleContent += '</div>';
        if(item.tip == 3){
          saleContent += '<span class="icon fs14 news">本月畅销</span>';
        }
        if(item.tip == 4){
          saleContent += '<span class="icon fs14 taste">会员专享</span>'
        }
        saleContent += '</li>'
      });
      saleContent += '<li><a href="javascript:;" class="lookmore fs16">查看更多理财产品 ＞</a></li></ul>';
      $('.productBox').html(saleContent)
    },
    getSoldContent:function (result){
      var soldContent = '<ul><li><img src="https://r.mzmoney.com/mz/img/hpimg/productList/sellWell.jpg" alt=""></li>';
      result.list.forEach(function (item,index){
        soldContent += '<li class="finished productBox"><div class="product-box fl"><h3 class="product-name">'+item.productName+'</h3></div><div class="fl"><p class="colred firstLine"><font class="fs20">'+item.minYearIncome+'%</font><font class="fs16"></font></p><p class="fs14">预期年化收益</p></div><div class="fl"><p class="firstLine fs24">'+item.partInvestAmount+'元</p><p class="fs14">起投金额</p></div><div class="fl"><p class="firstLine fs24">'+item.interestLimitDes+item.interestLimitType+'</p><p class="fs14">投资期限</p></div><div class="progress fl"><div class="progress-line-box"><p class="progress-line fl"></p><span class="fr fs14">'+item.progress+'%</span></div></div><div class="btn fr"><a href="/detail/'+item.productId+'" target="_blank" class="fs20 disabled">已售罄</a></div></li>';
      });
      soldContent += '</ul>';
      $('.productBox').html(soldContent)
    },
    pagination:function (totalPage){
      var _this = this;
      $(".pagination").pagination(totalPage,{
        num_edge_entries: 2,
        num_display_entries: 4,
        items_per_page:1,
        prev_text:"上一页",
        next_text:"下一页",
        callback:function (currentPage){
          _this.getSoldList((currentPage+1),false);
        }
      });
    },
    lookMore:function (){
      var _this=this;
      $('body').on('click','.lookmore',function (){
        $('.list-tabs').children('a').eq(1).addClass('active').siblings('a').removeClass('active');
        $(document.documentElement).scrollTop(0);//for Firefox&IE
        $("body").scrollTop(0);//for Chrome
        _this.getSoldList(1,true);
      });
    }
  };
  vender.init();
});