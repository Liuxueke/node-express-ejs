const ajax = require('./ajax');
const promise = require('bluebird');
const config = require('../config');
const uuid = require('node-uuid');
const ajaxImg = require('./ajaxImg');
const logger=require('../utils/logger').logger();

var requestCatalog = {
  /*刷新sessionId*/
  refreshSession:function (req,data){
    return new promise(function (resolve,reject){
      ajax(req,{
        type:'get',
        url:'/login/refresh/token',
        data:data
      }).then(function(result){
        resolve(result);
        if(result['error_code'] && result['error_code'] != '000000' && result['error_code'] != null){
          logger.error(result['error_msg']+' "/login/refresh/token"')
        }
      }).catch(function (err){
        reject(err);
        logger.error('error is form "/login/refresh/token"');
      })
    })
  },
  //获取产品列表
  getProductList:function (req){
    return new promise(function (resolve,reject){
      ajax(req,{
        type:"get",
        url:"/product/product/sale_list",
        data:{}
      }).then(function (result){
        var productList={
          newProductList:[],
          productList:[]
        };
        if(!result['error_code']){
          result.list.forEach(function (item){
            if(item.tip==1 || item.tip==2){
              productList.newProductList.push(item);
            }else{
              productList.productList.push(item);
            }
          });
        }
        resolve(productList);
        if(result['error_code'] && result['error_code'] != '000000' && result['error_code'] != null){
          logger.error(result['error_msg']+' "/product/product/sale_list"')
        }
      }).catch(function (err){
        reject(err);
        logger.error('error is form "/product/product/sale_list"');
      });
    })
  },
  /*获取图片验证码*/
  getCodeImg:function (req,res,next){
    var id = uuid.v4();
    req.session.imgUuid = id;
    ajaxImg(req,{
      type:'get',
      url:'/login/tools/captcha',
      data:{
        uuid:id
      }
    }).then(function(result){
      var buff = new Buffer(result,'binary');
      res.writeHead(200,{'content-type':"image/png"});
      res.end(buff);
    }).catch(function(err){
      logger.error('error is form "/login/tools/captcha"');
    });
  },
  /*验证图片验证码*/
  checkImg:function (req,data){
    return new promise(function (resolve,reject){
      ajax(req,{
        url:'/login/tools/captcha_valid',
        type:'get',
        data:data
      }).then(function (result){
        resolve(result);
        if(result['error_code'] && result['error_code'] != '000000' && result['error_code'] != null){
          logger.error(result['error_msg']+' "/login/tools/captcha_valid"')
        }
      }).catch(function (err){
        reject(err);
        logger.error('error is form "/login/tools/captcha_valid"');
      })
    });
  }
};
module.exports = requestCatalog;
