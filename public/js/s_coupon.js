$(function(){
  var vender={
    init:function (){
      this.changeTab();
      this.pagination($('#totalPage').val(),1);
      this.explain();
    },
    pageSize:12,
    pagination:function (totalPage,status){
      var _this = this;
      if($('.pagination').length>0){
        $(".pagination").pagination(totalPage,{
          num_edge_entries: 2,
          num_display_entries: 4,
          items_per_page:1,
          prev_text:"上一页",
          next_text:"下一页",
          callback:function (currentPage){
            if(status !=0) {
              _this.getCoupons((currentPage + 1), status, false);
            }else{
              _this.getRecord((currentPage + 1),false)
            }
          }
        });
      }
    },
    getCoupons:function (pageNo,status,isInitPagination){
      var _this=this;
      $('#couponBox').hide();
      $('table').hide();
      $.ajax({
        url:'/passbook/list',
        type:'post',
        data:{
          page_no:pageNo,
          page_size:_this.pageSize,
          status:status
        },
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            var couponContent='<ul id="couponBox">';
            if(result.list.length>0){
              result.list.forEach(function (item,index){
                var couponStatus='';
                var couponType='';
                var statusText='';
                if(item.status != 1){
                  couponStatus='used';
                };
                switch (item.status){
                  case 0:statusText='待激活';break;
                  case 1:statusText='可使用';break;
                  case 2:statusText='已使用';break;
                  case 3:statusText='已失效';break;
                  case 4:statusText='已废弃';break;
                  default:statusText='';
                }
                switch (item.type){
                  case 1:couponType='jinbao';break;
                  case 2:couponType='dijia';break;
                  case 3:couponType='zhekou';break;
                  case 4:couponType='xianjin';break;
                  case 5:couponType='tixian';break;
                  case 6:couponType='jiaxi';break;
                  default:couponType='jiaxi';
                }
                couponContent += '<li class="'+couponType+' '+couponStatus+'"><div class="useTop"><span class="useName"><i></i>'+item.name+'</span><span class="usePrice">';
                if(item.type==3 || item.type==6){
                  var fees=((item.fees)*100/10000).toFixed(2);
                  couponContent += '<font></font>'+fees+'%';
                }else{
                  couponContent += '￥<font>'+item.money+'</font>';
                }
                couponContent += '<div class="useState">'+statusText+'<p>'+item.quota+'元以上可使用</p></div></div><div class="useBot"><p>'+item.description+'</p><p>有效期至：'+item.expireTime+'</p></div></li>';
              });
            }else{
              couponContent += '<li class="nothing">暂无优惠券</li>'
            }

            couponContent += '</ul>';
            $('.canUse').html(couponContent);
            if(isInitPagination){
              _this.pagination(result.totalPage,status);
            }
            $('#couponBox').show();
          }
        },
        error:function (err){}
      })
    },
    getRecord:function (pageNo,status,isInitPagination){
      var _this=this;
      $('#couponBox').hide();
      $.ajax({
        url:'/passbook/list',
        type:'post',
        data:{
          page_no:pageNo,
          page_size:_this.pageSize,
          status:''
        },
        dataType:'json',
        success:function (result){
          var listContent='<table><thead><tr><td>序号</td><td>卡券金额</td><td>状态</td><td>领用说明</td><td>领取时间</td><td>过期时间</td><td>使用时间</td></tr></thead></tbody>';
          if(result.code=='iss.success'){
            if(result.list.length>0){
              var statusText;
              result.list.forEach(function (item,index){
                switch (item.status){
                  case 0:statusText='待激活';break;
                  case 1:statusText='可使用';break;
                  case 2:statusText='已使用';break;
                  case 3:statusText='已失效';break;
                  case 4:statusText='已废弃';break;
                  default:statusText='';
                }
                listContent+='<tr><td>'+(index+1)+'</td><td class="color_base">'+item.money+'元</td><td>'+statusText+'</td><td>'+item.name+'</td><td>'+item.takeTime+'</td><td>'+item.expireTime+'</td><td>'+item.useTime+'</td></tr>'
              });
            }else{
              listContent+='<tr><td colspan="7">暂无记录</td></tr>'
            }
            listContent+='</tbody></table>';
            $('.canUse').html(listContent);
            $('table').show();
            if(isInitPagination){
              _this.pagination(result.totalPage,status);
            }
          }
        },
        error:function (err){}
      });
    },
    changeTab:function (){
      var _this = this;
      $('.couponTop li').on('click',function(){
        $(this).addClass('on').siblings().removeClass('on');
        var status=$(this).data('status');
        var type = $(this).index();
        if(type == 3){
          $('.getRecord').show().siblings().hide();
          _this.getRecord(1,status,true);
        }else{
          $('.canUse').show().siblings().hide();
          _this.getCoupons(1,status,true);
        }

      });
    },
    explain:function (){
      $("body").on("click",'.canUse li',function (){
        var explainText = $(this).find(".useBot").find("p").eq(0).text();
        $("#explainModal").find("p").text(explainText);
        $("#explainModal").show();
      });
      $('.close').on('click',function () {
        $('.mask').hide();
      });
    }
  };
  vender.init();
});