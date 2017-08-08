$(function(){
  var vender = {
    init: function(){
      this.accountFleeting(0,0,true);
      this.tabChange();
    },
    accountFleeting: function(type,currentPage,initPage){
      var _this = this;
      var flag = $('.accountDetail-top li').hasClass('active');
      if(flag){
        $.ajax({
          url: '/borrower/account_list',
          data: {
            type: type,
            page_no: currentPage,//当前页
            page_size: 10//每页显示条数
          },
          type: 'post',
          dataType: 'json',
          success: function(result){
            if(!result.code){
              var listNum = result.totalCount;
              if(listNum==0){
                $(".accountDetail-list ul").html('<p style="text-align: center; padding-top: 50px;">暂无信息</p>');
                $('#Pagination').hide();
              }else{
                var pages = result.totalPage;
                if(pages>1){
                  if(initPage){
                    _this.pagination(pages,type);
                    $('#Pagination').show();
                  }
                }

                var html = '';
                result.list.forEach(function(index, item){
                  html += '<li>' +
                    '<span class="ad1">'+index.id+'</span>' +
                    '<span class="ad2">'+index.busiType+'</span>' +
                    '<span class="ad3">'+index.busiDesc+'</span>' +
                    '<span class="ad4">'+index.account+'</span>' +
                    '<span class="ad5">'+index.amount+'</span>' +
                    '<span class="ad6">'+index.createTime+'</span>' +
                    '</li>'
                });
                $(".accountDetail-list ul").html(html);
              }
            }else{
              $(".accountDetail-list ul").html('<p style="text-align: center; padding-top: 50px;">'+result.msg+'</p>');
            }
          },
          error: function(){
            $(".accountDetail-list ul").html('<p style="text-align: center; padding-top: 50px;">接口出错，请刷新页面重试！</p>');
            $('#Pagination').hide();
          }
        })
      }
    },
    tabChange: function(){
      var _this = this;
      $('.accountDetail-top li').on('click',function(){
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        _this.accountFleeting(index,0,true);
      });
    },
    pagination: function(pages,type){
      var _this = this;
      $('.pagination').pagination(pages,{
        num_edge_entries: 2, //边缘页数
        num_display_entries: 4, //主体页数
        items_per_page: 1, //每页显示1项
        prev_text:"上一页",
        next_text:"下一页",
        callback:function(currentPage){
          _this.accountFleeting(type,currentPage,false);
        }
      });
    },
  };
  vender.init();
});