$(function(){
  var vender = {
    //页面初始化
    init: function(){
      this.tabChange();
      this.repayment();
      this.close();
      this.tenderList(0,true);
    },
    //标的列表
    tenderList: function(currentPage, initPage){
      var _this = this;
      $.ajax({
        url: '/bid/bid_list',
        data: {
          page_no: currentPage,//当前页
          page_size: 10//当前页数
        },
        type: 'post',
        dataType: 'json',
        success: function(result){
          $(".management-column li.mc1").text('标的ID');
          if(result.code){
            return false;
          }
          if(result.totalCount == 0){
            $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">暂无信息</p>');
          }else{
            //初始化翻页
            var pages = result.totalPage;
            if(pages>1){
              if(initPage){
                _this.pagination(pages,0);
              }
            }
            //拼接字符串 开始
            var html = '';
            result.list.forEach(function(index,item){
              html += '<li data-bidName="'+index.bidName+'" data-loanAmount="'+index.loanAmount+'" data-yearIncome="'+index.yearIncome+'" data-interestLimitUnit="'+index.interestLimitUnit+'">' +
                '<a href="/borrower/detail/tenderDetail/'+bidId+'" target="_blank">' +
                '<span class="mc1">'+index.bidId+'</span>' +
                '<span class="mc2">'+index.status+'</span>' +
                '<span class="mc3">'+index.raiseAmount+'</span>' +
                '<span class="mc4">'+index.forRepayAmount+'</span>' +
                '<span class="mc5">'+index.repaymentAmount+'</span>' +
                '<span class="mc6">'+index.endRefundTime+'</span>' +
                '</a>' +
                '<span class="mc7"><font class="trendPay">还款</font></span>' +
                '</li>';
            });
            $(".management-list ul").html(html);
            //拼接字符串 end
          }
        },
        error: function(){
          $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">接口出错，请刷新页面重试！</p>');
        }
      });
    },
    //项目列表
    projectList: function( currentPage, initPage){
      $.ajax({
        url: '/project/project_list',
        data: {
          page_no: currentPage,//当前页
          page_size: 10//当前页数
        },
        type: 'post',
        dataType: 'json',
        success: function(result){
          $(".management-column li.mc1").text('项目ID');
          if(result.code){
            return false;
          }
          if(result.totalCount == 0){
            $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">暂无信息</p>');
          }else{
            //初始化翻页
            var pages = result.totalPage;
            if(pages>1){
              if(initPage){
                _this.pagination(pages,1);
              }
            }
            //拼接字符串 开始
            var html = '';
            result.list.forEach(function(index,item){
              html += '<li data-bidName="'+index.bidName+'" data-loanAmount="'+index.loanAmount+'" data-yearIncome="'+index.yearIncome+'" data-interestLimitUnit="'+index.interestLimitUnit+'">' +
                '<a href="/borrower/detail/tenderDetail/'+bidId+'" target="_blank">' +
                '<span class="mc1">'+index.bidId+'</span>' +
                '<span class="mc2">'+index.status+'</span>' +
                '<span class="mc3">'+index.raiseAmount+'</span>' +
                '<span class="mc4">'+index.forRepayAmount+'</span>' +
                '<span class="mc5">'+index.repaymentAmount+'</span>' +
                '<span class="mc6">'+index.endRefundTime+'</span>' +
                '</a>' +
                '<span class="mc7"><font class="servicePay">服务费支付</font></span>' +
                '</li>';
            });
            $(".management-list ul").html(html);
            //拼接字符串 end
          }
        },
        error: function(err){
          $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">接口出错，请刷新页面重试！</p>');
        }
      });
    },
    //tab切换
    tabChange: function(){
      var _this = this;
      $('.management-title li').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type = $(this).index();
        if(type==0){
          _this.tenderList(0,true);
        }else{
          _this.projectList(0,true);
        }
      });
    },
    //分页
    pagination: function(pages,whichList){
      var _this = this;
      $('.pagination').pagination(pages,{
        num_edge_entries: 2, //边缘页数
        num_display_entries: 4, //主体页数
        items_per_page: 1, //每页显示1项
        prev_text:"上一页",
        next_text:"下一页",
        callback:function(currentPage){
          if(whichList==0){
            _this.tenderList(currentPage,false);
          }else{
            _this.projectList(currentPage,false);
          }
        }
      });
    },
    //还款
    repayment: function(){
      $('body').on('click','.trendPay',function(){
        $('#Repayment').show();
      });
    },
    //关闭弹出框
    close: function(){
      $('.close').on('click',function(){
        $(this).parents('.mask').hide();
      });
      $(".cancel").on('click',function(){
        $(this).parents('.mask').hide();
      })
    }
  };
  vender.init();
});