<template>
    <div class="wrapper">
        <div :style="{height:style.iWindowHeight + 'px'}">
            <div class="left" :style="{height:style.iWindowHeight + 'px'}">
                <h2 class="user-info">用户：{{userInfo.name}}</h2>
                <div>
                    <ul class="userList" id="userList">
                        <li v-for="user in users"
                            v-if="user.id !== userId"
                            @click="changeRoom(user)"
                            :class="{'current-dialog':currentDialog.id === user.id}">
                            <el-badge :is-dot="false" class="item">
                                <img src="../../images/user.png" class="photo"/>
                            </el-badge>
                            <span>{{user.name}}</span>
                            <div class="state" :class="{active:user.online}">
                            </div>
                        </li>
                    </ul>
                    <!--<div>-->
                    <!--<el-button>默认按钮</el-button>-->
                    <!--</div>-->
                </div>
            </div>
            <div class="right" id="right">
                <div class="content" id="messagesWrap" ref="messagesWrap"
                     :style="{height:style.iWindowHeight - 201 + 'px'}">
                    <ul ref="messages" class="message">
                        <li v-for="item in currentDialog.msgList"
                            :class="{'sys-info':item.type === 'system' ,
                                'clearfix':item.type === 'msg',
                                'me':item.type === 'msg' && item.userId === userId}">
                            <template v-if="item.type === 'system'">
                                <span class="info">系统提示：</span>{{item.msg}}
                            </template>
                            <template v-if="item.type === 'msg'">
                                <div class="dialogue-user"><img src="images/user.png">
                                    <div class="who">{{item.name}}</div>
                                </div>
                                <div class="dialogue-content">
                                    <div class="bubble">
                                        <div v-html="item.msg"></div>
                                        <div class="tail"></div>
                                    </div>
                                </div>
                            </template>
                        </li>
                    </ul>
                </div>
                <div class="input-wrap ">
                    <div class="faceContent" v-show="faceListVisible">
                        <ul class="clearfix">
                            <li v-for="item in 104" @click="faceSelect(item)">
                                <img :src="'images/face/faceIcon/' + item + '.png'">
                            </li>
                        </ul>
                    </div>
                    <div class="tool">
                        <a href="javascript:void(0)" id="faceIcon" @click="faceListVisible = !faceListVisible"
                           title="发送表情">
                            <img src="images/face.png">
                        </a>
                        <a href="javascript:void(0)" @click="dialogVisible = !dialogVisible" title="发送图片">
                            <img src="images/img.png">
                        </a>
                        <a href="javascript:void(0)" @click="initVidio()"
                           title="视频通讯">
                            <img src="images/video.png">
                        </a>
                        <a href="javascript:void(0)" @click="initDesktop()"
                           title="桌面共享">
                            <img src="images/share.png">
                        </a>
                    </div>
                    <div contenteditable="true" class="input" v-html="inputMsg" ref="editor"></div>
                    <div class="submit" @click="submitMsg" v-show="currentDialog.online">发送</div>
                </div>
            </div>
        </div>
        <el-dialog title="上传" :visible.sync="dialogVisible" class="file-dialog" size="tiny">
            <el-upload
                class="upload-demo"
                action="/upload"
                drag
                ref="upload"
                :on-success="uploadHandler"
                :on-remove="uploadHandler"
                list-type="picture">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传图片、pdf、html文件，且不超过500kb</div>
            </el-upload>
            <div class="dialog-footer">
                <a href="javascript:void(0)" class="dialog-btn gray-btn" @click="dialogClose()">
                    <span>关闭</span>
                </a>
                <a href="javascript:void(0)" class="dialog-btn green-btn" @click="dialogSure()">
                    <span>确定</span>
                </a>
            </div>
        </el-dialog>
        <el-dialog title="视频" :visible.sync="videoDialogVisible" class="file-dialog" @close="vidioClose" >
            <div id="callPage" class="call-page">
                <video id="localVideo" autoplay :src="localVideoSrc" controls></video>
                <video id="remoteVideo" autoplay :src="remoteVideoSrc" controls></video>
                <!--<div class="row text-center">-->
                    <!--<div class="col-md-12">-->
                        <!--<el-button type="primary" @click="callBtn">呼叫</el-button>-->
                        <!--<el-button type="danger">挂断</el-button>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </el-dialog>
        <el-dialog title="桌面共享" :visible.sync="desktopDialogVisible" class="file-dialog" @close="vidioClose" width="100%"  top="0">
                <video autoplay :src="desktopVideoSrc" controls width="100%"></video>
        </el-dialog>
    </div>
</template>

<script>
    import io from "socket.io-client";

    const queryString = require("query-string");
    const util = require("../../js/util/util");
    const conf = require("../../config/conf");
    export default {
        data() {
            return {
                yourConn: null,
                localVideoSrc: null,
                remoteVideoSrc: null,
                loading: false,
                dialogVisible: false,
                videoDialogVisible: false,
                faceListVisible: false,
                inputMsg: "",
                roomId: "",
                targetId: "",
                userId: "",
                style: {
                    iWindowHeight: 0,
                },
                currentDialog: {
                    id: "",
                    msgList: [],
                    online: false,
                    targetType: ""
                },
                targetType: null,
                allMsgList: null,
                socket: {},
                fileList: [],
                users: [],
                myStream: null,
                cloneStream: null,
                videoReady:false,
                targetVideoReady:false,
                time:0,
                desktopDialogVisible:false,
                desktopVideoSrc:false,
            };
        },
        watch: {},
        computed: {
            userInfo() {
                for (let key in this.users) {
                    let item = this.users[key];
                    if (item.id === this.userId) {
                        return item;
                    }
                }
                return {};
            },
//            userList() {
//                let userList = {};
//                for (let item of this.users) {
//                    for (let subItem of item.members) {
//                        userList[subItem.id] = subItem;
//                    }
//                }
//                return userList;
//            }
        },
        created: function () {
        },
        mounted: function () {
            this.init();
        },
        methods: {

            async init() {
                this.roomId = this.$route.params.roomId;
                this.userId = this.$route.params.userId;
                document.addEventListener("keydown", this.keydownEnter);
                this.initStyle();
                await this.initSocket();
            },
            // 初始化socket
            initSocket() {
                let $refMessageList = this.$refs.messages;
                let $refMessagesWrap = this.$refs.messagesWrap;
                let search = queryString.stringify({
                    userId: this.userId,
//                    roomId: this.roomId
                });
                let url = window.location.origin + "?" + search;
                this.socket = io(url);
                this.socket.on("updateUser", (users) => {
                    this.users = users;
                    if (!this.allMsgList) {
                        this.allMsgList = {};
                        for (let dept of this.users) {
                            this.allMsgList[dept.id] = [];
                        }
                    }
                });
                this.socket.on("msg", (data) => {
                    if (data.userId === this.userId) {
                        if (!this.allMsgList[data.target]) {
                            this.allMsgList[data.target] = [];
                        }
                        this.allMsgList[data.target].push(data);
                    } else {
                        if (!this.allMsgList[data.userId]) {
                            this.allMsgList[data.userId] = [];
                        }
                        this.allMsgList[data.userId].push(data);
                    }
                    // 滚动到底部
                    setTimeout(() => {
                        $refMessagesWrap.scrollTop = $refMessageList.scrollHeight;
                    }, 100);
                });
                this.socket.on("call",(data)=>{
                    let msg = "";
                    if(!data.business){
                        msg = "正在呼叫您，是否接受视频通话？";
                    }else{
                        msg = "分享桌面给您，是否接受？";
                    }
                    this.$confirm(data.from.userName + msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.changeRoom({
                            id: data.from.userId,
                            online:true
                        });
                        this.targetVideoReady = true;
                        if(!data.business){
                            this.initVidio();
                        }else{
                            console.log("initDesktopRTCPeerConnection");
                            this.initDesktopRTCPeerConnection();
                        }
                    },() => {
                    });
                });
                this.socket.on("m",  (msg)=> {
                    var data = msg;
                    switch (data.type) {
                        //when somebody wants to call us
                        case "offer":
                            console.log("get offer")
                            this.handleOffer(data.offer, data.business);

                            break;
                        case "answer":
//                            return;
                            console.log("get answer" , data)
                            this.handleAnswer(data.answer, data.business);
                            break;
                        //when a remote peer sends an ice candidate to us
                        case "candidate":
                            console.log("get candidate")
                            this.handleCandidate(data.candidate, data.business);

                            break;
//                        case "leave":
//                            handleLeave();
//                            break;
                        default:
                            break;
                    }
                });
            },
            vidioClose() {
                this.videoDialogVisible = false;
                this.localVideoSrc = null;

                function stop(stream) {
                    let tracks = stream.getAudioTracks();
                    for (let item of tracks) {
                        item.stop();
                    }
                    tracks = stream.getVideoTracks();
                    for (let item of tracks) {
                        item.stop();
                    }
                }

                stop(this.cloneStream);
                stop(this.myStream);
                this.cloneStream = null;
                this.myStream = null;
            },
            callBtn(business) {
                // create an offer
                console.log("createOffer   setLocalDescription")
                this.yourConn.createOffer( (offer)=> {
                    this.send({
                        business:business||"",
                        type: "offer",
                        offer: offer
                    });
                    try {
                        this.yourConn.setLocalDescription(offer);
                    }catch (e){
                        console.error(e)
                    }

                }, function (error) {
                    alert("Error when creating an offer");
                });
            },
            async initVidio() {
                this.videoDialogVisible = true;
                //**********************
                //Starting a peer connection
                //**********************
                //getting local video stream
                navigator.mediaDevices.getUserMedia({video: true, audio: true}, (myStream) => {
                    this.myStream = myStream;
                    this.cloneStream = myStream.clone();
                    this.cloneStream.removeTrack(this.cloneStream.getAudioTracks()[0]);
                    //displaying local video stream on the page
                    this.localVideoSrc = window.URL.createObjectURL(this.cloneStream);
                    //using Google public stun server
                    var configuration = {
//                         "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
                    };
                    this.yourConn = new webkitRTCPeerConnection(configuration);
                    // setup stream listening
//                    if(this.targetVideoReady){
                        this.yourConn.addStream(myStream);
//                    }

                    //when a remote user adds stream to the peer connection, we display it
                    this.yourConn.onaddstream = (e) => {
                        console.log("onaddstream")
                        this.remoteVideoSrc = window.URL.createObjectURL(e.stream);
                    };
                    // Setup ice handling
                    this.yourConn.onicecandidate = (event) => {
                        if(this.time)return;
                        this.time = 1;
                        console.log("onicecandidate")
                        if (event.candidate) {
                            this.send({
                                type: "candidate",
                                candidate: event.candidate
                            });
                        }
                    };
                    if(this.targetVideoReady){
                        this.callBtn();
                    }else{
                        this.socket.emit("call",{
                            targetId:this.targetId
                        })
                    }
                }, function (error) {
                    console.log(error);
                });
            },

            handleOffer(offer, business) {
                console.log("handleOffer setRemoteDescription createAnswer setLocalDescription ---" + business)
                this.yourConn.setRemoteDescription(new RTCSessionDescription(offer));
//                create an answer to an offer
                this.yourConn.createAnswer( (answer)=> {
                    this.yourConn.setLocalDescription(answer);
                    console.log("setLocalDescription",answer)
                    this.send({
                        business:business|| "",
                        type: "answer",
                        answer: answer
                    });
                }, function (error) {
                    alert("Error when creating an answer");
                });
            },
            handleAnswer() {
                console.log("handleAnswer  setRemoteDescription", + arguments)
//                this.yourConn.setRemoteDescription(new RTCSessionDescription(answer));
            },
            handleCandidate(candidate) {
                console.log("handleCandidate   addIceCandidate")
                try{
                    this.yourConn.addIceCandidate(new RTCIceCandidate(candidate));
                }catch (e){
                    console.error(e)
                }

            },
            //alias for sending JSON encoded messages
            send(message) {
                if (!message.name && this.currentDialog.id) {
                    message.name = this.currentDialog.id;
                }
                this.socket.emit("m", JSON.stringify(message));
            },
            initDesktopRTCPeerConnection(){
                this.desktopDialogVisible = true;
                var configuration = {
//                   "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
                };
                this.yourConn = new webkitRTCPeerConnection(configuration);
                // Setup ice handling
                this.yourConn.onaddstream = (e) => {
                    console.log("onaddstream")
                    this.desktopVideoSrc = window.URL.createObjectURL(e.stream);
                };
                this.yourConn.onicecandidate = (event) => {
                    console.log("onicecandidate")
                    if (event.candidate) {
                        this.send({
                            business: "desktop",
                            type: "candidate",
                            candidate: event.candidate
                        });
                    }
                };
                this.callBtn("desktop");
            },
            initDesktop() {
//                this.desktopDialogVisible = true;
                const EXTENSION_ID = 'gkfjdjcjhgcigbpfelijdadlijincmkh';

                chrome.runtime.sendMessage(EXTENSION_ID, 'version', response => {
                    if (!response) {
                        console.log('No extension');
                        return;
                    }
                    console.log('Extension version: ', response.version);
                    const request = { sources: ['window', 'screen', 'tab'] };
                    let stream;

                    chrome.runtime.sendMessage(EXTENSION_ID, request, response => {
                        if (response && response.type === 'success') {
                            navigator.mediaDevices
                                .getUserMedia({
                                    video: {
                                        mandatory: {
                                            chromeMediaSource: 'desktop',
                                            chromeMediaSourceId: response.streamId
                                        }
                                    }
                                })
                                .then(returnedStream => {
                                    //using Google public stun server
                                    var configuration = {
//                                       "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
                                    };
                                    this.yourConn = new webkitRTCPeerConnection(configuration);
                                    // setup stream listening
                                    this.yourConn.addStream(returnedStream);
//                                    this.desktopVideoSrc = window.URL.createObjectURL(returnedStream);

                                    // Setup ice handling
                                    this.yourConn.onicecandidate = (event) => {
                                        console.log("onicecandidate")
                                        if (event.candidate) {
                                            this.send({
                                                business: "desktop",
                                                type: "candidate",
                                                candidate: event.candidate
                                            });
                                        }
                                    };
                                    this.socket.emit("call",{
                                        business: "desktop",
                                        targetId:this.targetId
                                    })
                                })
                                .catch(err => {
                                    console.error('Could not get stream: ', err);
                                });
                        } else {
                            console.error('Could not get stream');
                        }
                    });
                });
            },
            changeRoom(item) {
                let id = item.id;
                this.targetId = id;
                this.currentDialog.online = item.online;
                this.currentDialog.msgList = this.allMsgList[id];
                this.currentDialog.id = item.id;
                if (!this.allMsgList[id]) {
                    this.allMsgList[id] = [];
                }
            },
//            async updateState(){
//                let data = await this.$http.put("/user", {userId : this.userId, active:true}).catch((e)=>{
//                    return false;
//                });
//                if(data){
//                    this.users = data.body;
//                }
//            },
            async getUsers() {
                let data = await this.$http.get("/user").catch((e) => {
                    return false;
                });
                if (data) {
                    this.users = data.body;
                }
            },
            // 表情选择
            faceSelect(item) {
                this.insertText("<img src='images/face/faceIcon/" + item + ".png'>");
                this.faceListVisible = false;
            },
            uploadHandler(response, file, fileList) {
                this.fileList = [];
                for (let item of fileList) {
                    if (item.response && item.response.code && item.response.code === "success") {
                        this.fileList.push(conf.fileServiceHost + "/" + item.response.path);
                    }
                }
            },
            // 文件对话框取消
            dialogClose() {
                this.dialogVisible = false;
                this.fileList = [];
                this.$refs.upload.clearFiles();
            },
            // 文件对话框确定
            dialogSure() {
                this.dialogVisible = false;
                for (let item of this.fileList) {
                    this.insertText("<div class='dialogue-img-wrap'><img src='" + item + "'/></div>");
                }
                this.fileList = [];
                this.$refs.upload.clearFiles();
            },
            // 光标控制,插入内容
            insertText(str) {
                let obj = this.$refs.editor;
                if (document.selection) {
                    let sel = document.selection.createRange();
                    sel.text = str;
                } else if (typeof obj.selectionStart === "number" && typeof obj.selectionEnd === "number") {
                    let startPos = obj.selectionStart,
                        endPos = obj.selectionEnd,
                        cursorPos = startPos,
                        tmpStr = obj.innerHTML;
                    obj.innerHTML = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
                    cursorPos += str.length;
                    obj.selectionStart = obj.selectionEnd = cursorPos;
                } else {
                    obj.innerHTML += str;
                }
            },
            // 回车事件
            keydownEnter(e) {
                util.keydownEnter(e, () => {
                    this.submitMsg();
                });
            },
            // 发送文本
            submitMsg() {
                let emitObj = {
                    msg: this.$refs.editor.innerHTML,
                    type: "text",
                    targetId: this.targetId,
                };
                this.socket.emit("msg", emitObj);
                this.$refs.editor.innerHTML = "";
            },
            // 初始化样式
            initStyle() {
                function initStyle() {
                    this.style.iWindowHeight = document.documentElement.clientHeight;
                }

                initStyle.call(this);
                window.addEventListener("resize", () => {
                    initStyle.call(this);
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../css/index";
</style>
