const assert = require("chai").assert;
describe("selectUser",function () {
    it("insertUser",function (done) {
        const userDao = require("../../dao/userDao");
        let arg = {
            name : "小小小小1",
            online : "0",
        }
        userDao.addUserList(arg).then((data) =>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        })
    });
    it("selectUser",function (done) {
        const userDao = require("../../dao/userDao");
        userDao.selectUserList().then((data) =>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        })
    });

    it("insertFriend",function (done) {
        const friendDao = require("../../dao/friendDao");
        let arg = {
            user_Id : "4",
            friend_Id : "3",
        }
        friendDao.addFriend(arg).then((data) =>{
            console.log(data);
            done();
        },(err)=>{
            console.log(err);
            done();
        })
    });
    it("GETFriend",function (done) {
        const userDao = require("../../dao/userDao");
        userDao.getFriendsListByUserId("3").then((data) =>{//获取列表
            console.log(data);
        }).catch((err)=>{
            console.log(err);
            return [];
        });
    });




})
