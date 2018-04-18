/**
 * Created by lin on 2017/9/27.
 */
let socketIO = require("socket.io");
let userMap = {
    1:"林超群",
    2:"周润发",
    3:"周星驰",
};
let socketService = function (server) {
    let io = socketIO.listen(server);
    io.on("connection", function (socket) {
        socket.emit("message", {
            type:"system",
            msg:"欢迎进入聊天室",
        });
        let roomId = socket.handshake.query.roomId;
        let userId = socket.handshake.query.userId;
        socket.join(roomId);
        socket.in(roomId).emit("message", {
            type:"system",
            msg:userMap[userId] + "进入聊天室",
        });
        socket.on("message",(data)=>{
            if(data.type === "text"){
                io.in(roomId).emit("message", {
                    type:"msg",
                    msg:data.msg,
                    name:userMap[userId],
                    userId:userId
                });
            }

        });
    });
};
module.exports = socketService;
