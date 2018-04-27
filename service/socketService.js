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
function sendTo(connection, message) {
    connection.emit("m",message);
}

let videoUsers = {};
let socketService = function (server) {
    let io = socketIO.listen(server);

    io.on("connection", function (socket) {
        let connection = socket;
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
        socket.on("msg",(data)=>{
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

                io.to(roomId).emit("msg", {
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
        connection.on('m', function(message) {
            var data;
            //accepting only JSON messages
            try {
                data = JSON.parse(message);
            } catch (e) {
                console.log("Invalid JSON");
                data = {};
            }
            //switching type of the user message
            switch (data.type) {
                case "login":
                    console.log("User logged", data.name);
                    //if anyone is logged in with this username then refuse
                    if(videoUsers[data.name]) {
                        sendTo(connection, {
                            type: "login",
                            success: false
                        });
                    } else {
                        //save user connection on the server
                        videoUsers[data.name] = connection;
                        connection.name = data.name;
                        sendTo(connection, {
                            type: "login",
                            success: true
                        });
                    }
                    break;
                case "offer":
                    //for ex. UserA wants to call UserB
                    console.log("Sending offer to: ", data.name);
                    //if UserB exists then send him offer details
                    var conn = videoUsers[data.name];
                    if(conn != null) {
                        //setting that UserA connected with UserB
                        connection.otherName = data.name;
                        sendTo(conn, {
                            type: "offer",
                            offer: data.offer,
                            name: connection.name
                        });
                    }
                    break;
                case "answer":
                    console.log("Sending answer to: ", data.name);
                    //for ex. UserB answers UserA
                    var conn = videoUsers[data.name];
                    if(conn != null) {
                        connection.otherName = data.name;
                        sendTo(conn, {
                            type: "answer",
                            answer: data.answer
                        });
                    }
                    break;
                case "candidate":
                    console.log("Sending candidate to:",data.name);
                    var conn = videoUsers[data.name];
                    if(conn != null) {
                        sendTo(conn, {
                            type: "candidate",
                            candidate: data.candidate
                        });
                    }
                    break;
                case "leave":
                    console.log("Disconnecting from", data.name);
                    var conn = videoUsers[data.name];
                    conn.otherName = null;
                    //notify the other user so he can disconnect his peer connection
                    if(conn != null) {
                        sendTo(conn, {
                            type: "leave"
                        });
                    }
                    break;
                default:
                    sendTo(connection, {
                        type: "error",
                        message: "Command not found: " + data.type
                    });
                    break;
            }
        });
        //when user exits, for example closes a browser window
        //this may help if we are still in "offer","answer" or "candidate" state
        connection.on("disconnect", function() {
            if(connection.name) {
                delete videoUsers[connection.name];
                // if(connection.otherName) {
                //     console.log("Disconnecting from ", connection.otherName);
                //     var conn = videoUsers[connection.otherName];
                //     conn.otherName = null;
                //     if(conn != null) {
                //         sendTo(conn, {
                //             type: "leave"
                //         });
                //     }
                // }
            }
        });
    });
};
module.exports = socketService;
