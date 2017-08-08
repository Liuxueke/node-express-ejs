$(function (){
  var vender={
    init:function (){
      this.pagination($("#totalPage").val());
    },
    pageSize:30,
    pagination:function (totalPage){
      var _this = this;
      if(totalPage >0){
        $(".pagination").pagination(totalPage,{
          num_edge_entries: 2,
          num_display_entries: 4,
          items_per_page:1,
          prev_text:"上一页",
          next_text:"下一页",
          callback:function (currentPage){
            var data = {
              page_no:(currentPage+1),
              page_size:_this.pageSize
            };
            _this.getList(data)
          }
        });
      }
    },
    getList:function (data){
      var _this=this;
      $.ajax({
        url:'/growth_list',
        type:'post',
        data:data,
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            _this.getListContent(result.list);
          }
        },
        error:function (err){}
      })
    },
    getListContent:function (result){
      var listContent;
      if(result.length>0){
        result.forEach(function (item,index){
          listContent+='<tr><td>'+item.logTime+'</td><td>'+item.content+'</td><td>'+item.grow+'</td></tr>'
        });
      }else{
        listContent+='<tr><td colspan="3">暂无记录</td></tr>'
      }
      $('tbody').html(listContent);
    }
  };
  vender.init();
});