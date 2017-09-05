const cors = require('koa-cors');
let config={
    // origin:'http://localhost:8082',
    MaxAge:10,
    credentials:true,
    allowHeaders:"Origin, X-Requested-With, Content-Type, Accept"
}
console.log()
module.exports=cors(config)     