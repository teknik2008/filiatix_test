var mysql = require('promise-mysql');
let host = process.env.DB_HOST
let user = process.env.DB_USER
let password = process.env.DB_PASS
let database = process.env.DB_BASE
let connectionLimit = 10
let queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};


let pool_w = mysql.createPool({ host, user, password, database, connectionLimit ,queryFormat});
pool_w.query('select 1+1').then(()=>{
    console.log('connect to db ok')
}).catch(err=>{
    console.log('connect to db fail')
    console.log(err)
});

module.exports = pool_w;