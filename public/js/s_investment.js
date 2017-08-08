$(function (){
  var vender = {
    init:function (){
      var initType = $('.cur').data('type');
      this.changeTab();
      this.pagination(initType,$('#totalSize').val());
    },
    pagination:function (type,totalPage){
      var _this = this;
      $(".pagination").pagination(totalPage,{
        num_edge_entries: 2,
        num_display_entries: 4,
        items_per_page:1,
        prev_text:"上一页",
        next_text:"下一页",
        callback:function (currentPage){
          var data = {
            type:type,
            page_no:(currentPage+1),
            pageSize:_this.pageSize
          };
          _this.getListContent(type,data,false)
        }
      });
    },
    pageSize:5,
    changeTab:function (){
      var _this = this;
      $('#listTabs > li').on('click',function (){
        $(this).addClass('cur').siblings('li').removeClass('cur');
        var type=$(this).data('type');
        var data = {
          type:type,
          page_no:1,
          page_size:_this.pageSize
        };
        _this.getListContent(type,data,true);

      });
    },
    getListContent:function (type,data,isInitPagination){
      var _this = this;
      $.ajax({
        type:'post',
        url:'/my_investment',
        data:data,
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            _this.getContentHtml(type,result.list);
            var totalPage = result.totalPage;
            if(isInitPagination){
              _this.pagination(type,totalPage)
            }
          }
        },
        error:function (err){}
      });
    },
    getContentHtml:function (type,result){
      if(type == 0){
        var contentHtml = '<table><thead><tr><th>项目信息</th><th>投资金额（元）</th><th>投资时间</th><th>状态</th><th>操作</th></tr></thead><tbody>'
      }else if(type == 1){
        var contentHtml = '<table><thead><tr><th>项目信息</th><th>投资金额（元）</th><th>预估收益（元）</th><th>投资时间</th><th>状态</th><th>操作</th></tr></thead><tbody>'
      }else if(type == 2){
        var contentHtml = '<table><thead><tr><th>项目信息</th><th>投资金额（元）</th><th>预估收益（元）</th><th>预计回款日</th><th>状态</th><th>操作</th></tr></thead><tbody>'
      }else if(type == 3){
        var contentHtml = '<table><thead><tr><th>项目信息</th><th>投资金额（元）</th><th>已收收益（元）</th><th>回款日</th><th>状态</th><th>操作</th></tr></thead><tbody>'
      };
      if(type == 2 || type==3){
        if(result.length == 0){
          contentHtml += '<tr><td align="center" colspan="6">暂无投资明细记录</td></tr>';
        }else{
          result.forEach(function (item,index){
            contentHtml += '<tr><td><p class="productName">'+item.productName+'</p><p>收益率：<span class="rate">6.08%</span></p><p>期限：<span>'+item.interestLimit+'</span>天</p></td><td>'+item.totalPrincipal+'</td><td>'+item.interest+'</td><td>'+item.dealTime+'</td><td>'+item.statusName+'</td><td><a target="_blank" href="/member/investment/detail?type='+type+'&holdId='+item.holdId+'">查看</a></td></tr>'
          });
        }
      }else if(type == 1){
        if(result.length == 0){
          contentHtml += '<tr><td align="center" colspan="6">暂无投资明细记录</td></tr>';
        }else{
          result.forEach(function (item,index){
            contentHtml += '<tr><td><p class="productName">'+item.productName+'</p><p>收益率：<span class="rate">6.08%</span></p><p>期限：<span>'+item.interestLimit+'</span>天</p></td><td>'+item.totalPrincipal+'</td><td>'+item.interest+'</td><td>';
            if(item.dealTime){
              contentHtml+=item.dealTime;
            }
            contentHtml+='</td><td>'+item.statusName+'</td><td><a target="_blank" href="/member/investment/detail?type='+type+'&partId='+item.partId+'">查看</a></td></tr>'
          })
        }
      }else if(type == 0){
        if(result.length == 0){
          contentHtml += '<tr><td align="center" colspan="5">暂无投资明细记录</td></tr>';
        }else{
          result.forEach(function (item,index){
            contentHtml += '<tr><td><p class="productName">'+item.productName+'</p><p>收益率：<span class="rate">6.08%</span></p><p>期限：<span>'+item.interestLimit+'</span>天</p></td><td>'+item.totalPrincipal+'</td><td>';
            if(item.dealTime){
              contentHtml += item.dealTime
            }
            contentHtml += '</td><td>'+item.statusName+'</td><td><a target="_blank" href="/member/investment/detail?type='+type+'&partId='+item.partId+'">查看</a></td></tr>'
          })
        }
      };
      contentHtml += '</tbody></table>';
      $('#recordListBox').html(contentHtml);
    }
  };
  vender.init();
});