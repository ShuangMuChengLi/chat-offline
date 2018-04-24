/**
 * Created by lin on 2017/9/27.
 */
let socketIO = require("socket.io");
let _ = require("lodash");
let users = require("../db/users");
let userList = getUserList();

let rooms = [];
function getUser( userId) {
    return userList[userId];
}
function getSocket(sockets , id) {
    for(let key in sockets){
        if(sockets[key].id === id){
            return sockets[key]
        }
    }
    return null;
}
function getUserList() {
    let userList = {};
    for(let item of users){
        for(let subItem of item.members){
            userList[subItem.id] = subItem;
        }
    }
    return userList;
}
let socketService = function (server) {
    let io = socketIO.listen(server);

    io.on("connection", function (socket) {

        let userId = socket.handshake.query.userId;
        if(userId){
            let user = getUser(userId);
            user.active = true;
            io.emit('updateUser',users);
            userList[userId].socketId = socket.id;
        }
        socket.on("disconnect",function () {
            if(userId){
                let user = getUser(userId);
                user.active = false;
                io.emit('updateUser',users);
            }
        });
        // 更新用户信息
        socket.on("updateUser",()=>{
            io.emit('updateUser',users);
        });
        // 创建房间
        socket.on("createRoom",(data)=>{
            if(userList[data.target].socketId){
                let roomId;
                let attempt1 = data.target + "-" + userId;
                let attempt2 = userId + "-" + data.target;
                if(!_.has(socket.rooms,attempt1) && !_.has(socket.rooms,attempt2)){
                    roomId = attempt1;
                    let targetSocket = getSocket(io.sockets.connected , userList[data.target].socketId);
                    if(targetSocket){
                        targetSocket.join(roomId);
                        socket.join(roomId)
                    }

                }
            }
        });
        for(let dept of users){
            socket.join(dept.id);
        }
        // console.log(socket.client)
        // for(let item in io.sockets.clients){
        //     console.log(item)
        // }
        //
        // socket.emit("message", {
        //     type:"system",
        //     msg:"欢迎进入聊天室",
        // });
        // let roomId = socket.handshake.query.roomId;
        //
        // socket.join(roomId);
        // socket.in(roomId).emit("message", {
        //     type:"system",
        //     msg:"进入聊天室",
        // });
        socket.on("message",(data)=>{
            if(data.type === "text"){
                let roomId;
                if(data.targetType === "depart"){
                    roomId = data.targetId;
                }else{
                    let attempt1 = data.targetId + "-" + userId;
                    let attempt2 = userId + "-" + data.targetId;
                    if(_.has(socket.rooms,attempt1)){
                        roomId = attempt1;
                    }else if(_.has(socket.rooms,attempt2)){
                        roomId = attempt2;
                    }else{
                        return false;
                    }
                }

                io.to(roomId).emit("message", {
                    type:"msg",
                    msg:data.msg,
                    name:"",
                    target:data.targetId,
                    userId:userId,
                    targetType:data.targetType
                });
                // socket.emit("me", {
                //     type:"msg",
                //     msg:data.msg,
                //     name:"",
                //     target:data.targetId,
                //     userId:userId
                // });
            }

        });
    });
};
module.exports = socketService;
