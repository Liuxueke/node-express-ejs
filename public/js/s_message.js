$(function (){
  var vender = {
    init:function (){
      this.pagination($("#totalPage").val(),0);
      this.tabChange();
    },
    pageSize:10,
    pagination:function (totalPage,type){
      var _this = this;
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
          _this.getMessageList(type,data,false);
        }
      });
    },
    tabChange:function (){
      var _this = this;
      $('.listTabBox > li').on('click',function (){
        var index = $(this).index();
        $(this).addClass('cur').siblings('li').removeClass('cur');
        /*请求数据*/
        var type = 0;
        (index==0)?(type= 0):((index==1)?(type=3):(type=8));
        var data = {
          page_no:1,
          page_size:10
        };
        _this.getMessageList(type,data,true);
      });
    },
    getMessageList:function (type,data,isInitPagination){
      var _this = this;
      $.ajax({
        type:'post',
        url:'/get_message_list?type='+type,
        data:data,
        dataType:'json',
        success:function (result){
          if(result.code=='iss.success'){
            var htmlStr = _this.creatHtmlStr(type,result.list);
            $('#messageList').html(htmlStr);
            var totalPage = result.totalPage;
            /*tab切换时重置分页器*/
            if(isInitPagination){
              _this.pagination(totalPage,type);
            }
          }
        },
        error:function (err){}
      });
    },
    creatHtmlStr:function (type,list){
      var htmlStr = '';
      var messageType = 'notice';
      (type==0)?(messageType='notice'):((type==3)?(messageType='trade'):(messageType='private'));
      if(list.length>0){
        if(type==0){
          list.forEach(function (item,index){
            htmlStr += '<tr><td>'+(index+1)+'</td><td><a class="color_base" href="/member/message/'+messageType+'/detail?messageId='+item.messageId+'">'+item.messageTitle+'</a></td><td><span>'+item.messageContent+'</span></td><td>'+item.time+'</td></tr>'
          });
        }else{
          list.forEach(function (item,index){
            htmlStr += '<tr><td>'+(index+1)+'</td><td><a class="color_base" href="/member/message/'+messageType+'/detail?messageId='+item.msgUuid+'">'+item.messageTitle+'</a></td><td><span>'+item.messageContent+'</span></td><td>'+item.time+'</td></tr>'
          });
        }

      }else{
        htmlStr += '<tr><td colspan="4">暂无消息</td></tr>'
      }

      $('#messageList').html(htmlStr);
    }
  };
  vender.init();
});