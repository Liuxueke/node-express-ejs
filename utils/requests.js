const ajax = require('./ajax');
const promise = require('bluebird');
const logger=require('../utils/logger').logger();
module.exports=function (req,option,res){
  return new promise(function (resolve,reject){
    ajax(req,{
      url:option.url,
      type:option.type,
      data:option.data
    }).then(function (result){
      if(result['error_code']=='100016' || result['error_code']=='100013' || result['error_code']=='300001'){
        resolve(Object.assign({'isLogin':false},result));
        res.clearCookie('sessionid_cook_key');
        req.session.destroy();
      }else{
        if(result.length){
          resolve(Object.assign({'isLogin':true},{"list":result}));
        }else{
          resolve(Object.assign({'isLogin':true},result));
        }
      }
      if(result['error_code'] && result['error_code'] != '000000'){
        logger.error(result['error_msg']+' "'+option.url+'"');
      }
    }).catch(function (err){
      reject({err:err,url:option.url});
      logger.error('error is form "'+option.url+'"');
    })
  });
};