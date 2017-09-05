let port =  process.env.PORT ||8081;
let baseUrl = 'http://localhost' + ':' + port;


module.exports = {
  site: {
    port,
    domain: baseUrl
  },
  datebase: {
    name: 'db.sqlite',
  },
  app:{
    timeSaveLincs:60*60*24*15
  }
} 