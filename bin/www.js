/**
 * Created by yangxiaoyang on 2017/5/12.
 */

const pm2 = require('pm2');

pm2.connect(function(err){
  if(err){
    console.log(err);
    process.exit(2);
  }
  pm2.start({
    script: './app.js',
    exec_mode: 'cluster',
    instance: 4,
    watch: true,
    max_memory_restart: '100M'
  },function(err,apps){
    pm2.disconnect();
    if(err) throw err
  });
});