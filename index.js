require('dotenv').config()
const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const config = require('config');
const router=require('./router');

const app = new Koa();

let middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
middlewares.forEach(function (middleware) {
    if (middleware.indexOf('_not') > -1) return;
    app.use(require('./middlewares/' + middleware));
}); 
app.use(router.routes()); 
app.listen(config.site.port);

 
 