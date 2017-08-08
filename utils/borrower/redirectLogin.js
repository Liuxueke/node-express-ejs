module.exports = function(result,res){
  var invalidSession = false;
  result.forEach(function(item,index){
    if(item['error_code'] == '100013' || item['error_code'] == '100016' || item['error_code'] == '300001'){
      invalidSession = true
    }
  });
  if(invalidSession){
    res.redirect('/borrower/login');
  }else{
    let renderDate = {
      page:{
        title:"404"
      }
    };
    res.render('404',renderDate)
  }
};