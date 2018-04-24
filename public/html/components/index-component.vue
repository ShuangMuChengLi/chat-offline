<template>
    <div class="wrapper">
        <div :style="{height:style.iWindowHeight + 'px'}">
            <div class="left" :style="{height:style.iWindowHeight + 'px'}">
                <h1>用户：{{userInfo.name}}</h1>
                <div>
                    <ul class="user-list">
                        <li v-for="item in users" >
                            <h2 class="left-title" @click="changeRoom('depart' ,item.id)"  :class="{'current-dialog':currentDialog.id === item.id}">{{item.name}}</h2>
                            <ul class="userList" id="userList">
                                <li v-for="user in item.members"
                                    v-if="user.id !== userId"
                                    @click="changeRoom('user' ,user.id)"
                                    :class="{'current-dialog':currentDialog.id === user.id}">
                                    <el-badge :value="1" class="item">
                                        <img src="../../images/user.png" class="photo"/>
                                    </el-badge>
                                    <span>{{user.name}}</span>
                                    <div class="state" :class="{active:user.active}">
                                    </div>
                                </li>
                            </ul>
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
                        <a href="javascript:void(0)" id="faceIcon" @click="faceListVisible = !faceListVisible">
                            <img src="images/face.png">
                        </a>
                        <a href="javascript:void(0)" @click="dialogVisible = !dialogVisible">
                            <img src="images/img.png">
                        </a>
                    </div>
                    <div contenteditable="true" class="input" v-html="inputMsg" ref="editor"></div>
                    <div class="submit" @click="submitMsg">发送</div>
                </div>
            </div>
        </div>
        <el-dialog title="上传"  :visible.sync="dialogVisible" class="file-dialog" size="tiny">
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
                loading: false,
                dialogVisible: false,
                faceListVisible: false,
                inputMsg: "",
                roomId: "",
                targetId:"",
                targetId:"",
                userId: "",
                style: {
                    iWindowHeight: 0,
                },
                currentDialog: {
                    id:"",
                    msgList:[]
                },
                allMsgList:null,
                socket: {},
                fileList: [],
                users: [],
            };
        },
        watch: {},
        computed:{
            userInfo(){
                for(let key in this.userList){
                    let item = this.userList[key];
                    if(item.id === this.userId){
                        return item;
                    }
                }
                return {};
            },
            userList() {
                let userList = {};
                for(let item of this.users){
                    for(let subItem of item.members){
                        userList[subItem.id] = subItem;
                    }
                }
                return userList;
            }
        },
        created: function () {
        },
        mounted: function () {
            this.init();
        },
        methods: {
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
                    if(!this.allMsgList){
                        this.allMsgList = {};
                        for(let dept of this.users){
                            this.allMsgList[dept.id] = [];
                        }
                    }
                });
                this.socket.on("message", (data) => {
                    console.log(data,data.userId , this.userId);
                    if(data.targetType === "depart"){
                        this.allMsgList[data.target].push(data);
                    }else{
                        if(data.userId === this.userId){
                            this.allMsgList[data.target].push(data);
                        }else{
                            if(!this.allMsgList[data.userId]){
                                this.allMsgList[data.userId] = [];
                            }
                            this.allMsgList[data.userId].push(data);
                        }
                    }

                    // 滚动到底部
                    setTimeout(() => {
                        $refMessagesWrap.scrollTop = $refMessageList.scrollHeight;
                    }, 100);
                });
            },
            changeRoom(type, id) {
                this.targetId = id;
                if(type !== "depart"){
                    this.socket.emit("createRoom", {
                        target: id
                    });
                    this.targetType = "person";
                }else{
                    this.targetType = "depart";
                }
                if(!this.allMsgList[id]){
                    this.allMsgList[id] = [];
                }
                this.currentDialog = {
                    msgList : this.allMsgList[id],
                    id : id
                }
            },
            async init() {
                this.roomId = this.$route.params.roomId;
                this.userId = this.$route.params.userId;
                document.addEventListener("keydown", this.keydownEnter);
                this.initStyle();
                await this.initSocket();
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
                    targetId :this.targetId,
                    targetType:this.targetType
                };
                this.socket.emit("message", emitObj);
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
