const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const cookie = require('cookie-parser');
const ejs = require('ejs-mate');
const staticDir = path.join(__dirname,'public');
const bodyParser = require('body-parser');
const layout = require('express-layout');
const routerIndex = require('./router/');
const routerPost = require('./router/post');//本地请求
const errorPageMiddlewares = require('./middlewares/error_page');
const config = require('./config');
const favicon = require('serve-favicon');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const redisClient= redis.createClient({
  port:config.redisOptions.port,
  host:config.redisOptions.host,
  prefix:config.redisOptions.prefix
});
const log4js=require('./utils/logger');


//模板引擎设置
app.set('views',path.join(__dirname,'views'));
app.set('view engine','html');
app.engine('html',ejs);
app.use(layout());
app.locals.config = config;
//日志打印
log4js.use(app,'info');
app.use(cookie('',{httpOnly:false}));
app.use('/public',express.static(staticDir));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

app.use(session({
  store:new redisStore({
    client:redisClient
  }),
  secret:config.session.secret,
  resave:false,
  saveUninitialized:false,
  cookie:config.session.cookie
}));
app.use(errorPageMiddlewares.errorPage);
app.use('/',routerIndex);
app.use('/',routerPost);
app.use('/*',function(req,res){
  if (!res.headersSent) {
    res.render404();
  }
});
app.listen(config.port,'0.0.0.0',function(){
  console.log('server is running at http://localhost:5510/')
});


