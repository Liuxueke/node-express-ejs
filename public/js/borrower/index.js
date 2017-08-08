$(function(){
  var vender = {
    //页面初始化
    init: function(){
      this.tabChange();
      this.repayment();
      this.close();
      this.tenderList(0,true);
      this.surePay();
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
            var isShow = 'buttonHide';
            result.list.forEach(function(index,item){
              if(index.showButton){
                isShow = '';
              }
              html += '<li data-bidName="'+index.bidName+'" data-loanAmount="'+index.loanAmount+'" data-yearIncome="'+index.yearIncome+'" data-interestLimit="'+index.interestLimit+'" data-needcharg="'+index.forRepayAmount+'">' +
                '<a href="/borrower/detail/tenderDetail/'+index.bidId+'" target="_blank">' +
                '<span class="mc1">'+index.bidId+'</span>' +
                '<span class="mc2">'+index.status+'</span>' +
                '<span class="mc3">'+index.loanAmount+'</span>' +
                '<span class="mc4">'+index.forRepayAmount+'</span>' +
                '<span class="mc5">'+index.repaymentAmount+'</span>' +
                '<span class="mc6">'+index.endRefundTime+'</span>' +
                '</a>' +
                '<span class="mc7 '+isShow+'"><font class="repay trendPay">还款</font></span>' +
                '</li>';
            });
            $(".management-list ul").html(html);
            //拼接字符串 end
          }
        },
        error: function(){
          $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">接口错误，请刷新页面重试！</p>');
        }
      });
    },
    //项目列表
    projectList: function( currentPage, initPage){
      var _this = this;
      $.ajax({
        url: '/project/project_list',
        data: {
          page_no: currentPage,//当前页
          page_size: 10//当前页数
        },
        type: 'post',
        dataType: 'json',
        success: function(result){
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
            var isShow = 'buttonHide';
            result.list.forEach(function(index,item){
              if(index.showButton){
                isShow = ''
              }
              html += '<li data-bidName="'+index.projectName+'" data-loanAmount="'+index.loanAmount+'" data-yearIncome="'+index.yearIncome+'" data-interestLimit="'+index.serviceCharge+'" data-needcharg="'+index.needCharge+'">' +
                '<a href="/borrower/detail/projectDetail/'+index.projectId+'" target="_blank">' +
                '<span class="mc1">'+index.projectId+'</span>' +
                '<span class="mc2">'+index.status+'</span>' +
                '<span class="mc3">'+index.creditAmount+'</span>' +
                '<span class="mc4">'+index.charge+'</span>' +
                '<span class="mc5">'+index.backServiceCharge+'</span>' +
                '<span class="mc6">'+index.createTime+'</span>' +
                '</a>' +
                '<span class="mc7 '+isShow+'"><font class="repay servicePay">服务费支付</font></span>' +
                '</li>';
            });
            $(".management-list ul").html(html);
            //拼接字符串 end
          }
        },
        error: function(err){
          $(".management-list").html('<p style="text-align: center; padding-top: 50px; font-size: 14px;">接口错误，请刷新页面重试！</p>');
        }
      });
    },
    //tab切换
    tabChange: function(){
      var _this = this;
      $('.management-title li').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var type = $(this).index();
        $('.management-column-box').eq(type).show().siblings().hide();
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
      $('body').on('click','.repay',function(){

        var numbering = $(this).parents('li').find('.mc1').html();
        var naming = $(this).parents('li').attr('data-bidName');
        var amounting = $(this).parents('li').find('.mc3').html();
        var rating = $(this).parents('li').attr('data-yearIncome');
        var terming = $(this).parents('li').attr('data-interestLimit');
        var needPaying = $(this).parents('li').attr('data-needcharg');

        if($(this).hasClass('trendPay')){
          $(".maskTit").text('标的还款确认');
          $(".numbering span").text('标的编号');
          $(".naming span").text('标的名称');
          $(".amounting span").text('放款金额');
          $(".rating span").text('年化利率');
          $(".terming span").text('借款期限');
          $(".needPaying span").text('需还款金额');

          $(".maskBottom a:eq(0)").addClass('trendSurePay');
          $(".terming div").html(terming+'天');
        }else{
          $(".maskTit").text('项目还款确认');
          $(".numbering span").text('项目编号');
          $(".naming span").text('项目名称');
          $(".amounting span").text('项目金额');
          $(".rating span").text('年化利率');
          $(".terming span").text('服务费率');
          $(".needPaying span").text('需支付服务费');

          $(".maskBottom a:eq(0)").addClass('projectSurePay');
          $(".terming div").html(terming+'%');
        }

        $(".numbering div").html(numbering);
        $(".naming div").html(naming);
        $(".amounting div").html(amounting+'元');
        $(".rating div").html(rating+'%');
        $(".needPaying div").html(needPaying+'元');

        $('#Repayment').show();
      });
    },
    //确认还款
    surePay: function(){
      $('body').on('click','.surePay', function(){
        if($(this).hasClass('disabled')){
          return false;
        }
        $(this).addClass('disabled');
        var id = $(this).parents('.maskBox').find('.numbering').html();
        if($(this).hasClass('trendSurePay')){
          //标的还款
          $.ajax({
            url: '/repayment/pay',
            data: {
              bid_id: id
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code=='iss.success'){
                window.location.href = '/borrower/repaymentSuccess';
              }else{
                //余额不足
                $('#Repayment').hide();
                $('#shortageOverage').show();
              }
              $('.surePay').removeClass('disabled');
            },
            error: function(){
              alert('接口出错，请刷新页面重试！');
            }
          })
        }else{
          //项目服务费支付
          $.ajax({
            url: '/pay_charge/pay',
            data: {
              project_id: id
            },
            type: 'post',
            dataType: 'json',
            success: function(result){
              if(result.code == 'iss.success'){
                window.location.href = '/borrower/serviceFeePaySuccess';
              }else{
                //余额不足
                $('#Repayment').hide();
                $('#shortageOverage').show();
              }
              $('.surePay').removeClass('disabled');
            },
            error: function(){
              alert('接口出错，请刷新页面重试！');
            }
          })
        }
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