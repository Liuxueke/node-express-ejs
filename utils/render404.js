module.exports = function (res){
  let renderDate = {
    page:{
      title:"404"
    }
  };
  res.render('404',renderDate)
};