/**
 * Created by MZ on 2017/5/15.
 */
var request = require('request');
var configs = require('../config');
var promise = require('bluebird');
const cryrto = require('crypto');
var ajax = function (req,options){
  //处理headers
  var  userHeaders = req.headers;
  var clientIp = getClientIp(req);
  var agent = userHeaders['user-agent'];
  userHeaders['IP']=clientIp;
  userHeaders['AGENT']=agent;
  userHeaders['REFER']=userHeaders['refer'];
  userHeaders['DEVICETYPE']= configs.commonHeader.DEVICETYPE;
  userHeaders['SOURCECHANNEL']=configs.commonHeader.SOURCECHANNEL;
  //处理签名
  const appkey = configs.authSign.appkey;
  const secert = configs.authSign.secret;
  const timestamp = parseInt(new Date().getTime()) + '';
  let signArray = [];
  let urlArray = [];
  let urlData = {};
  signArray.push('appkey'+appkey);
  urlArray.push('appkey='+appkey);
  signArray.push('timestamp'+timestamp);
  urlArray.push('timestamp='+timestamp);
  for(let index in options.data){
    signArray.push(index+options.data[index]);
    urlArray.push(index+'='+options.data[index]);
  }
  let signStr = secert+signArray.sort().join('')+secert;
  const sign = cryrto.createHash('sha1').update(utf16to8(signStr)).digest('hex').toUpperCase();
  Object.assign(urlData,{appkey:appkey},{timestamp:timestamp},{sign:sign});
  // return hash.digest('hex');
  urlArray.push('sign='+sign);
  return new promise(function (resolve,reject){
    if(options.type ==='get'){
      request({
        method:options.type,
        url:configs.serverUrl+options.url+'?'+urlArray.sort().join('&'),
        data:{},
        headers: userHeaders,
        encoding:null
      },function (error,response,body){
        if(!error && response.statusCode == 200){
          resolve(body)
        }else{
          reject(error)
        }
      });
    }else{
      request({
        method:options.type,
        url:configs.serverUrl+options.url+'?'+urlArray.sort().join('&'),
        data:Object.assign(options.data,urlData),
        headers: userHeaders,
        encoding:null
      },function (error,response,body){
        if(!error && response.statusCode == 200){
          resolve(body)
        }else{
          reject(error)
        }
      });
    }

  });
};


function utf16to8(str)  {
  var out, i, len, c;
  out = "";
  len = str.length;
  for(i = 0; i < len; i++){
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF){
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
    }
  }
  return out;
}

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}


module.exports = ajax;