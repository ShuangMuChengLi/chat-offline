const log4js = require("log4js");
const log = log4js.getLogger("../log/app");
let db = require("../config/db");
const uuidV4 = require("uuid/v4");
exports.addUserList = function (arg) {
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
                "INSERT INTO userMap (id,name,online) VALUES (?,?,?)",
                [id,arg.name,arg.online],
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
// exports.selectUserList = function () {
//     let promise =new Promise((resolve, reject) => {
//         let sSql = "SELECT * FROM userMap ";
//         // console.log(sSql);
//         db.getConnection(function (err,connection) {
//             if(err){
//                 log.error(err);
//                 reject(err);
//                 return;
//             }
//             connection.query(
//                 sSql,
//                 function (err, rows) {
//                     connection.release();
//                     if(err){
//                         log.error(err);
//                         reject(err);
//                         return;
//                     }
//                     var string = JSON.stringify(rows);
//                     resolve(string);
//                 }
//             );
//         })
//
//     });
//     return promise;
// };

exports.updateUserList = function (id , online) {//更新usermap表
    let promise =new Promise((resolve, reject) => {
        let sSql = "UPDATE userMap SET online=? WHERE id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [online , id],
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows.id);
                }
            );
        })

    });
    return promise;
};


exports.selectUserList = function () {//查找 usermap表 所有用户
    let promise = new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM userMap ";
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

exports.selectUser = function (id) {//查找 usermap表 某一用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM userMap WHERE id=?";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [id],
                function (err, rows) {
                    connection.release();
                    if(err){
                        log.error(err);
                        reject(err);
                        return;
                    }
                    resolve(rows[0]);
                }
            );
        })

    });
    return promise;
};

exports.getFriendsListByUserId = function (id) {//查找 usermap表 某一用户
    let promise =new Promise((resolve, reject) => {
        let sSql = "SELECT * FROM usermap AS o WHERE o.id IN (SELECT friend_Id FROM friendmap WHERE user_Id = ?)";
        // let sSql = "SELECT * from usersMap\n" +
        //     "where id in (select other_userId from friendmap where userId = ?)";
        // console.log(sSql);
        db.getConnection(function (err,connection) {
            if(err){
                log.error(err);
                reject(err);
                return;
            }
            connection.query(
                sSql,
                [id],
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


