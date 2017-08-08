$(function (){
  var vender={
    init:function (){
      this.pagination($('#totalPage').val());
    },
    pageSize:20,
    pagination:function (totalPage){
      var _this = this;
      $(".pagination").pagination(totalPage,{
        num_edge_entries: 2,
        num_display_entries: 4,
        items_per_page:1,
        prev_text:"上一页",
        next_text:"下一页",
        callback:function (currentPage){
          var data = {
            page_no:currentPage+1,
            page_size:_this.pageSize
          };
          _this.getNextPage(data)
        }
      });
    },
    getNextPage:function (data){
      var _this=this;
      $.ajax({
        url:'/get_account_flow/history',
        type:'post',
        data:data,
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            _this.getNextPageContent(result.list);
          }
        },
        error:function (err){}
      })
    },
    getNextPageContent:function (result){
      var content;
      if(result.length>0){
        result.forEach(function (item,index){
          content+='<tr><td>'+item.createTime+'</td><td>'+item.infoOrder+'</td><td class="money">'+item.moneyOrder+'</td><td><a href="">查看</a></td></tr>';
        });
      }else{
        content+='<tr><td colspan="4">暂无资产明细记录</td></tr>';
      }
      $('tbody').html(content);
    }
  };
  vender.init();
});