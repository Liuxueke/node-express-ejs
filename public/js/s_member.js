$(function (){
  var vender = {
    init:function (){
      this.echarts();
      this.editUserName();
    },
    echarts:function (){
      if($('#main').length>0){
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
          tooltip: {
            trigger: 'item',
          },
          legend:{
            width:'164px',
            height:'164px',
          },
          series: [
            {
              name:'访问来源',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              radius:['90%','100%'],
              data:[
                {value:$('#balance').text(), name:'可用余额'},
                {value:$('#cashFrozen').text(), name:'申购中金额'},
                {value:$('#expectPrincipal').text(), name:'待收金额'}
              ]
            }
          ],
          color:['#00acea','#f7aa50','#f7505c']
        };
        myChart.setOption(option);
      }
    },
    editUserName:function (){
      var _this = this;
      _this.oldName = $(".name").html();
      /*点击编辑*/
      $('body').on('click','.edit-btn',function (){
        var editHtml = "<input type='text' value='' class='new-user-name'><a href='javascript:;' class='save-btn'>[确定]</a><a href='javascript:;' class='cancel'>[取消]</a><span class='error'></span>";
        $(".edit").html(editHtml);
      });
      /*取消编辑*/
      $('body').on('click','.cancel',function (){
        var oldHtml = "<div class='name-box'><span class='name'>"+_this.oldName+"</span><a href='javascript:;' class='edit-btn'></a></div>";
        $(".edit").html(oldHtml);
      });
      /*保存编辑*/
      $('body').on('click','.save-btn',function (){
        var newName = $(".new-user-name").val().trim();
        if(newName == ""){
          $(".error").html("用户名不能为空！");
        }else if(!newName.match("^([\\u4e00-\\u9fa5]|[a-zA-Z0-9])+$")){
          $(".error").html("只能为字母、数字或中文！");
        }else{
          layer.confirm('用户昵称设置后不可修改，确定要保存？', {
            btn: ['确定','取消'] //按钮
          }, function(index){
            layer.close(index);
            $.ajax({
              type:'post',
              url:'/edit_userName',
              data:{username:newName},
              dataType:'json',
              success:function (result){
                if(result.code == 'iss.success'){
                  _this.oldName = newName;
                  var newHtml = "<div class='name-box'><span class='name'>"+_this.oldName+"</span></div>";
                  $(".edit").html(newHtml);
                }else{
                  $(".error").html(result.msg);
                }
              },
              error:function (err){}
            });
          }, function(index){
            var oldHtml = "<div class='name-box'><span class='name'>"+_this.oldName+"</span><a href='javascript:;' class='edit-btn'></a></div>";
            $(".edit").html(oldHtml);
            layer.close(index);
          });
        }
      });
      /*去除错误信息*/
      $("body").on("focus",".new-user-name",function (){
        $(".error").html("");
      });
    }
  };
  vender.init();
});