$(function (){
  var vender = {
    init:function (){
      this.pageTotal = Math.ceil($('#totalPage').val()/(this.pageSize));
      this.pagination(this.pageTotal);
      this.changeTabs();
    },
    type:0,
    pageSize:10,
    pagination:function (totalPage){
      var _this = this;
      $(".pagination").pagination(totalPage,{
        num_edge_entries: 2,
        num_display_entries: 4,
        items_per_page:1,
        prev_text:"上一页",
        next_text:"下一页",
        callback:function (currentPage){
          _this.getRecordList(_this.type,(currentPage+1),false)
        }
      });
    },
    changeTabs:function (){
      var _this = this;
      $('#listTabBox > li').on('click',function (){
        $(this).addClass('cur').siblings('li').removeClass('cur');
        _this.type = $(this).index();
        _this.getRecordList(_this.type,1,true);
      });
    },
    getRecordList:function (type,currentPage,isInitPagination){
      var _this = this;
      var url = '/recharge_list';
      if(type == 0){
        var htmlStr = '<table><thead><tr><th>充值时间</th><th>充值金额(元）</th><th>流水号</th><th>状态</th></tr></thead><tbody>';
        url = '/recharge_list';
      }else{
        var htmlStr = '<table><thead><tr><th>提现时间</th><th>提现金额(元）</th><th>流水号</th><th>状态</th></tr></thead><tbody>';
        url = '/withdrawal_list';
      };
      $.ajax({
        type:'post',
        url:url,
        data:{
          page_no:currentPage,
          page_size:_this.pageSize
        },
        dataType:'json',
        success:function (result){
          if(result.code=="iss.success"){
            var totalPage = Math.ceil(result['totalSize']/(_this.pageSize));
            if(result['list']){
              result['list'].forEach(function (item,index){
                htmlStr += "<tr><td>"+item.createTime+"</td><td>"+item.moneyOrder+"</td><td>"+item.noOrder+"</td><td>"+item.statusOrderName+"</td></tr>"
              });
              htmlStr += '</body></table>';
            }else{
              htmlStr += '<tr><td align="center" colspan="6">暂无充值提现记录</td></tr></body></table>';
            }

            $('#data_list').html(htmlStr);
            if(isInitPagination){
              _this.pagination(totalPage)
            }
          }
        },
        error:function (err){}
      });
    }
  };
  vender.init();
});