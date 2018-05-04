/**
 * Created by lin on 2017/9/27.
 */
let socketIO = require("socket.io");
let _ = require("lodash");
let usersList = require("../db/usersMap");
function sendTo(connection, message) {
    connection.emit("m",message);
}

let usersMap = {};
let socketService = function (server) {
    let io = socketIO.listen(server);

    io.on("connection", function (socket) {
        let connection = socket;
        let userId = socket.handshake.query.userId;
        if(userId){
            let i = _.findIndex(usersList, {id:userId});
            if(i !== -1){
                usersMap[userId] = {};
                usersMap[userId].name = usersList[i].name;
                usersMap[userId].socket = socket;
                usersList[i].online = true;
            }
        }
        socket.on("disconnect",function () {
            if(userId){
                delete  usersMap[userId];
                let i = _.findIndex(usersList, {id:userId});
                if(i !== -1){
                    usersList[i].online = false;
                }
                io.emit('updateUser',usersList);
            }
        });
        io.emit('updateUser',usersList);
        // 更新用户信息
        socket.on("updateUser",()=>{
            io.emit('updateUser',usersList);
        });

        // 对方视讯已经初始化
        // socket.on("videoReady",(data)=>{
        //
        //     let conn = usersMap[data.targetId].socket;
        //     conn.emit("targetReady");
        // });
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
                usersMap[data.targetId].socket.emit("msg", {
                    type:"msg",
                    msg:data.msg,
                    name:"",
                    target:data.targetId,
                    userId:userId
                });
                socket.emit("msg", {
                    type:"msg",
                    msg:data.msg,
                    name:"",
                    target:data.targetId,
                    userId:userId
                });
            }
        });
        // 呼叫
        socket.on("call",(data)=>{
            let conn = usersMap[data.targetId].socket;
            conn.emit("call" , {
                business:data.business || "",
                from :{
                    userId:userId,
                    userName: usersMap[data.targetId].name
                }
            })
        });
        socket.on('m', function(message) {
            let data;
            //accepting only JSON messages
            try {
                data = JSON.parse(message);
            } catch (e) {
                console.log("Invalid JSON");
                data = {};
            }
            let conn;
            //switching type of the user message
            switch (data.type) {
                case "offer":
                    //for ex. UserA wants to call UserB
                    console.log("Sending offer to: ", data.name);
                    //if UserB exists then send him offer details
                    conn = usersMap[data.name].socket;
                    if(conn !== null) {
                        //setting that UserA connected with UserB
                        connection.otherName = data.name;
                        sendTo(conn, {
                            business:data.business || "",
                            type: "offer",
                            offer: data.offer,
                            name: connection.name
                        });
                    }
                    break;
                case "answer":
                    console.log("Sending answer to: ", data.name);
                    //for ex. UserB answers UserA
                    conn = usersMap[data.name].socket;
                    if(conn !== null) {
                        connection.otherName = data.name;
                        console.log(data.answer)
                        sendTo(conn, {
                            business:data.business || "",
                            type: "answer",
                            answer: data.answer
                        });
                    }
                    break;
                case "candidate":
                    console.log("Sending candidate to:",data.name);
                    conn = usersMap[data.name].socket;
                    if(conn !== null) {
                        sendTo(conn, {
                            business:data.business || "",
                            type: "candidate",
                            candidate: data.candidate
                        });
                    }
                    break;
                case "leave":
                    console.log("Disconnecting from", data.name);
                    conn = usersMap[data.name].socket;
                    conn.otherName = null;
                    //notify the other user so he can disconnect his peer connection
                    if(conn !== null) {
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
        // connection.on("disconnect", function() {
        //     if(connection.name) {
        //         delete users[connection.name];
        //         // if(connection.otherName) {
        //         //     console.log("Disconnecting from ", connection.otherName);
        //         //     let conn = users[connection.otherName];
        //         //     conn.otherName = null;
        //         //     if(conn !== null) {
        //         //         sendTo(conn, {
        //         //             type: "leave"
        //         //         });
        //         //     }
        //         // }
        //     }
        // });
    });
};
module.exports = socketService;
