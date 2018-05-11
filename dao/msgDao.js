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
                "INSERT INTO msgmap(id,msg,type,Is_read,user_Id,friend_Id,time) VALUES (?,?,?,?,?,?,?)",
                [id,arg.msg,arg.type,arg.Is_read,arg.user_Id,arg.friend_Id,new Date()],
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

exports.updateFriendList = function (msg) {//更新usermap表
    let promise =new Promise((resolve, reject) => {
        let sSql = "UPDATE friendmap SET msg=? WHERE id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [msg],
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


exports.selectMsgList = function () {//查找 friendmap表 所有用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM   msgmap ";
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

exports.selectMsg = function (user_Id,friend_Id) {//查找 friendmap表 用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM msgmap WHERE user_Id=?,friend_Id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [user_Id,friend_Id],
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


