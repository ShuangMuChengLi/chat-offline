const log4js = require("log4js");
const log = log4js.getLogger("../log/app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
exports.addFriend= function (arg) {
    let promise =new Promise((resolve, reject) => {
        // let sSql = "INSERT INTO userMap (id, name,online) VALUES (?,?,?)";
        // console.log(arg);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            let id = uuidV4();
            connection.query(
                "INSERT INTO friendmap(id,user_Id,friend_Id) VALUES (?,?,?)",
                [id,arg.user_Id,arg.friend_Id],
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        })

    });
    return promise;
};

exports.updateFriendList = function (friend_Id) {//更新usermap表
    let promise =new Promise((resolve, reject) => {
        let sSql = "UPDATE friendmap SET friend_Id=? WHERE id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [friend_Id],
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows[0].id);
                }
            );
        })

    });
    return promise;
};


exports.selectFriendList = function () {//查找 friendmap表 所有用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM   friendmap ";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        })

    });
    return promise;
};

exports.selectFiend = function (user_Id) {//查找 friendmap表 用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM friendmap WHERE user_Id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [user_Id],
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows);
                }
            );
        })

    });
    return promise;
};


