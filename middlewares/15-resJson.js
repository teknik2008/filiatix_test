function Response(success,params,code) {
    if(!params&&typeof success !=='boolean'){
        params=success;
        success=true;
    }
    if(success==false&&typeof params =='string'){
        let _params=params;
        params={err_mes:_params};
        if(typeof code =='number'){
            params.code=code;
        }
    }else if(success==false&&typeof code =='number'){;
        params.code=code
    }
    if(success==false&&typeof params =='number'){
        let _params=params;
        params={code:_params}
    }
      
      
    this[success?'response':'error']=params;
    this.success=success;
}


let response=async  (ctx, next)=>{
   ctx.resJson=function(success,params,code){
       let res=new Response(success,params,code);
       ctx.body= res;
    }
    await next(); 
}

module.exports=response

// async () => {
//   const start = new Date();
  
//   const ms = new Date() - start;
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// };