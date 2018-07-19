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
                        <a href="javascript:void(0)" @click="getDesktopFromRemote()"
                           title="查看对方电脑">
                            <img src="images/share.png">
                        </a>
                        <a href="javascript:void(0)" @click="shareDesktopToRemote()"
                           title="请求远程协助">
                            <img src="images/share-there.png">
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
        <el-dialog title="视频" :visible.sync="videoDialogVisible" class="file-dialog" @close="vidioClose">
            <div id="callPage" class="call-page">
                <video id="localVideo" autoplay controls></video>
                <video id="remoteVideo" autoplay controls></video>
                <div class="row text-center">
                    <div class="col-md-12">
                        <el-button type="primary" @click="callBtn">呼叫</el-button>
                        <el-button type="danger">挂断</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="桌面共享" :visible.sync="desktopDialogVisible" class="file-dialog" width="100%" top="0"
                   @close="desktopClose">
            <video autoplay id="desktopVideo" controls width="100%"></video>
        </el-dialog>
    </div>
</template>

<script>
    import io from "socket.io-client";
    const queryString = require("query-string");
    const util = require("../../js/util/util");
    const conf = require("../../config/conf");
    const webRTCConfig = require("../../config/webRTC-config");
    export default {
        data() {
            return {
                desktopConn: null,
                videoConn: null,
                localVideo: null,
                remoteVideo: null,
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
                videoStream: null,
                cloneVideoStream: null,
                videoReady: false,
                targetReady: false,
                time: 0,
                desktopDialogVisible: false,
                desktopVideo: false,
                beShared: false,
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
            }
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
                    userId: this.userId
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
                this.socket.on("call", (data) => {
                    let beShared = !data.shareMe;// 是否被分享桌面
                    let msg;
                    if (!data.business) {
                        msg = "正在呼叫您，是否接受视频通话？";
                    } else {
                        if (beShared) {
                            msg = "请求共享您的桌面，是否接受？";
                        } else {
                            msg = "分享他的桌面给您，是否接受？";
                        }
                    }
                    this.$confirm(data.from.userName + msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        this.changeRoom({
                            id: data.from.userId,
                            online: true
                        });
                        this.targetReady = true;
                        if (!data.business) {
                            this.initVidio();
                        } else {
                            this.beShared = beShared;
                            this.initConnection();
                            setTimeout(async () => {
                                if (beShared) {
                                    let stream = await this.initDesktop();
                                    this.desktopConn.addStream(stream);
                                    this.callBtn("desktop");
                                } else {
                                    this.socket.emit("ready", {
                                        targetId: this.targetId
                                    });
                                    this.desktopDialogVisible = true;
                                }
                            }, 1000);
                        }
                    }, () => {

                    });

                });
                this.socket.on("ready", async (data) => {
                    let stream = await this.initDesktop();
                    this.desktopConn.addStream(stream);
                    this.callBtn("desktop");
                });
                this.socket.on("m", (data) => {
                    switch (data.type) {
                        case "offer":
                            this.handleOffer(data);
                            break;
                        case "answer":
                            this.handleAnswer(data);
                            break;
                        case "candidate":
                            this.handleCandidate(data);
                            break;
                        default:
                            break;
                    }
                });
            },
            vidioClose() {
                this.videoDialogVisible = false;

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
                this.videoConn.close();
                stop(this.cloneVideoStream);
                stop(this.videoStream);
                this.cloneVideoStream = null;
                this.videoStream = null;
                this.time = 0;
            },
            desktopClose(){

            },
            callBtn(business) {
                let conn = this.getConn(business);
                conn.createOffer((offer) => {
                    this.send({
                        business: business || "",
                        type: "offer",
                        offer: offer
                    });
                    try {
                        conn.setLocalDescription(offer);
                    } catch (e) {
                        console.error(e)
                    }

                }, function (error) {
                    alert("Error when creating an offer");
                });
            },

            async initVidio() {
                this.videoDialogVisible = true;
                await new Promise((resolve,reject)=>{
                    setTimeout(()=>{
                        resolve();
                    });
                });
                this.localVideo = document.getElementById("localVideo");
                this.remoteVideo = document.getElementById("remoteVideo");
                navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((videoStream) => {
                    this.videoStream = videoStream;
                    this.cloneVideoStream = videoStream.clone();
                    this.cloneVideoStream.removeTrack(this.cloneVideoStream.getAudioTracks()[0]);
                    this.localVideo.srcObject = this.cloneVideoStream;
                    let configuration = webRTCConfig.iceConf;
                    this.videoConn = new webkitRTCPeerConnection(configuration);
                    this.videoConn.ontrack = (e) => {
                        this.remoteVideo.srcObject = e.streams[0];
                    };
                    videoStream.getTracks().forEach(
                        (track) => {
                            this.videoConn.addTrack(
                                track,
                                videoStream
                            );
                        }
                    );
                    this.videoConn.onicecandidate = (event) => {
                        if (event.candidate !== null) {
                            this.send({
                                type: "candidate",
                                candidate: event.candidate
                            });
                        }
                    };
                    if (this.targetReady) {
                        this.callBtn();
                    } else {
                        this.socket.emit("call", {
                            targetId: this.targetId
                        })
                    }
                }, function (error) {
                    console.error(error);
                });
            },
            initConnection() {
                let configuration = webRTCConfig.iceConf;
                this.desktopConn = new webkitRTCPeerConnection(configuration);
                this.desktopConn.onaddstream = (e) => {
                    document.getElementById("desktopVideo").srcObject = e.stream;
                };
                this.desktopConn.onicecandidate = (event) => {
                    if (event.candidate) {
                        this.send({
                            business: "desktop",
                            type: "candidate",
                            candidate: event.candidate
                        });
                    }
                };
            },
            async shareDesktopToRemote() {
                this.initConnection();
                setTimeout(() => {
                    this.socket.emit("call", {
                        business: "desktop",
                        shareMe: true,
                        targetId: this.targetId
                    })
                }, 1000);

            },
            async getDesktopFromRemote() {
                this.desktopDialogVisible = true;
                this.initConnection();
                this.socket.emit("call", {
                    business: "desktop",
                    shareMe: false,
                    targetId: this.targetId
                })
            },
            initDesktop() {
                let promise = new Promise((resovle, reject) => {
                    chrome.runtime.sendMessage(webRTCConfig.EXTENSION_ID, 'version', response => {
                        if (!response) {
                            console.log('No extension');
                            return;
                        }
                        const request = {sources: ['window', 'screen', 'tab']};
                        chrome.runtime.sendMessage(webRTCConfig.EXTENSION_ID, request, response => {
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
                                        resovle(returnedStream);

                                    })
                                    .catch(err => {
                                        resovle(err);
                                        console.error('Could not get stream: ', err);
                                    });
                            } else {
                                console.error('Could not get stream');
                            }
                        });
                    });
                })
                return promise;
            },
            //alias for sending JSON encoded messages
            send(message) {
                if (!message.name && this.currentDialog.id) {
                    message.name = this.currentDialog.id;
                }
                this.socket.emit("m", JSON.stringify(message));
            },
            getConn(business){
                let conn;
                if(business === "desktop"){
                    conn = this.desktopConn;
                }else{
                    conn = this.videoConn;
                }
                return conn;
            },
            handleOffer(data) {
                let conn = this.getConn(data.business);
                conn.setRemoteDescription(new RTCSessionDescription(data.offer));
                conn.createAnswer((answer) => {
                    conn.setLocalDescription(answer);
                    this.send({
                        type: "answer",
                        answer: answer,
                        business:data.business
                    });
                }, function (error) {
                    alert("Error when creating an answer");
                });
            },
            handleAnswer(data) {
                let conn = this.getConn(data.business);
                conn.setRemoteDescription(new RTCSessionDescription(data.answer));
            },
            handleCandidate(data) {
                let conn = this.getConn(data.business);
                try {
                    conn.addIceCandidate(new RTCIceCandidate(data.candidate));
                } catch (e) {
                    console.error(e)
                }
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
