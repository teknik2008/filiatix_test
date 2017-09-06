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


let pool = mysql.createPool({ host, user, password, database, connectionLimit ,queryFormat});

module.exports = pool;