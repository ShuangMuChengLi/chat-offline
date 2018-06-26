let express = require("express");
let router = express.Router();
let userDao = require("../dao/userDao");
let url = require("url");
let qs = require("querystring");//解析参数的库

router.get("/", async function (routeReq, routeRes, next) {
    let content = null;
    content = await userDao.selectUserList().catch((err)=>{
        next(err);
        return [];
    });
    //     .catch(err)=>{
    //     next(err);
    //     return false;
    // };
    if(!content){
        return [];
    }

    routeRes.writeHead(200,{"Content-Type": "application/json;charset=utf-8"});
    let respontData = {
        status:200,
        msg:"操作成功",
        data:content
    }
    let data = JSON.stringify(respontData);
    routeRes.end(data);

});

module.exports = router;

