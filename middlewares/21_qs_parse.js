

// module.exports=function* (next) {
// 	let url=Url.parse(this.url);
// 	let query=url?qs.parse(url.query):{};
// 	this.queryObj=query;
// 	yield next;
// }

// let response=async  (ctx, next)=>{
//    ctx.resJson=function(success,params,code){
//        let res=new Response(success,params,code);
//        ctx.body= res;
//     }
//     await next(); 
// }
const Url = require('url');
const qs = require('qs');

module.exports=async (ctx,next) =>{
	
    function query(){
        let url=Url.parse(ctx.url);
	    let queryObj=url?qs.parse(url.query):{};
        return queryObj;
    }
	ctx.getQuery=query;

	await next(); 
}