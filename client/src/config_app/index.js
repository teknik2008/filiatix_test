let base=location.origin+'';
base='http://localhost:8081'
export  default {
    domain:base,
    urls:{
        
        filesList:{
            method:'get',
            url:base+'/files'
        },
        infoList:{
            method:'get',
            url:base+'/info'
        },
        fileUpload:{
            method:'post',
            url:base+'/'
        }
    }
}