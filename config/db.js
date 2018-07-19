let mysql = require("mysql");
module.exports =  mysql.createPool({
    host:     "localhost",
    user:     "lin",
    password: "g7845120",
    database: "blog"
});
