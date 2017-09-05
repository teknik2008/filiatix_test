
// Parse application/json, application/x-www-form-urlencoded
// NOT form/multipart!
// var bodyParser = require('koa-bodyparser');
// module.exports = bodyParser({formLimit:'10mb'});


   const koaBody = require('koa-body');
   
    module.exports = koaBody({formLimit:'100mb',multipart :true});