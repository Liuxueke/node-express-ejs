$(function (){
  var vender={
    init:function (){
      this.openLayer();
    },
    openLayer:function (){
      $('.submitBtn').on('click',function (){
        layer.open({
          title:'<p class="warmTip">温馨提示：</p>',
          type : 1,
          content : $('#modalBox'),
          closeBtn : 2,
          shadeClose : false,
          area : [ '620px', '350px' ],
          skin : 'layer_style1'
        })
      });
    }
  };
  vender.init();
});