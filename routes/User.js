/**
 * Created by lin on 2017/5/10.
 */
let express = require("express");
const io = require("socket.io-client");
let router = express.Router();
let users = require("../db/users");
function getUser(obj,  userId) {
    for(let item of obj){
        for(let subItem of item.members){
            if(userId === subItem.id){
                return subItem;
            }
        }
    }
    return false;
}
/* GET users listing. */
router.get("/", function(routeReq, routeRes, next) {
    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    routeRes.end(JSON.stringify(users));
});
router.put("/", function(routeReq, routeRes, next) {
    let result = {};
    let userId = routeReq.body.userId;
    let active = routeReq.body.active;
    let user = getUser(users, userId);

    routeRes.writeHead(200, {"Content-Type": "application/json;charset=utf-8"});
    if(user){
        const socket = io.connect("http://localhost:5001");
        user.active = active;
        socket.emit("updateUser");
        result.users = users;
        result.status = 200;
        result.msg = "更新成功";
        routeRes.end(JSON.stringify(result));
    }else{
        result.users = users;
        result.status = 204;
        result.msg = "未找到该用户";
        routeRes.end(JSON.stringify(result));
    }


});

module.exports = router;
