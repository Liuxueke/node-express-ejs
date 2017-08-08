const ajax = require('../../utils/ajax');
const promise = require('bluebird');
const logger = require('../../utils/logger').logger();

module.exports = function(req,elem){
  return new promise(function(resolve, reject){
    ajax(req,{
      type: elem.type,
      url: elem.url,
      data: elem.data
    }).then( function(result){
      resolve(result);
      //session失效清楚session
      if(result['error_code'] == '100013' || result['error_code'] == '100016' || result['error_code'] == '300001'){
        req.session.destroy();
      }
      //打印错误信息
      if(result['error_code'] && result['error_code'] != '000000' && result['error_code'] != null){
        logger.error(result['error_msg']+'from "'+elem.url+'"');
      }
    }).catch(function(err){
      reject(err);
      logger.error('error is from "'+elem.url+'"');
    })
  })
};