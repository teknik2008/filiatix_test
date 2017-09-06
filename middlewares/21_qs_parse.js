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