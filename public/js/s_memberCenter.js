$(function (){
  var vender={
    init:function (){
      this.showModal();
    },
    showModal:function (){
      $(".right-box li").on("click",function (){
        if($(this).find("i").hasClass("disabled")){
          return false;
        }else{
          var type= $(this).data("type");
          if(type){
            $("#"+type+"-modal").show();
          }
        }

      });
      /*关闭弹框*/
      $(".close").on("click",function (){
        $(this).parents(".modal-box").hide();
      });
    }
  };
  vender.init();
});