/**
 * Created by lin on 2017/7/28.
 */
let moment = require("moment");
module.exports = {
    /**
     * 移除对象中值为空的键值对
     * @param obj
     */
    objectRemoveValueIsNull(obj){
        for(let i in obj){
            let item = obj[i];
            if(this.isNull(item)){
                delete obj[i];
            }
        }
    },
    /**
     * 判断为空
     * @param arg1
     * @returns {boolean}
     */
    isNull(arg1){
        return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean";
    },
    /**
     * 判断对象为无属性对象
     * @param e
     * @returns {boolean}
     */
    isEmptyObject(e) {
        for (let t in e) return !1;
        return !0;
    },
    /**
     * 计算年龄
     * @param birthday   1999-10-08
     * @returns {Number}
     */
    getAge(birthday){
        let birthdayTimestamp = new Date(moment(birthday,"YYYY-MM-DD").format()).getTime();
        let nowTimestamp = new Date().getTime();
        let tempTime = nowTimestamp - birthdayTimestamp;
        let age = parseInt(tempTime/1000/60/60/24/365);
        return age;
    },
    /**
     * 回车键事件
     * @param e  事件
     * @param fn  回调函数
     */
    keydownEnter(e,fn){
        let theEvent = e || window.event;
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            fn();
        }
    },
    /**
     * 超出省略
     * @param s 字符串
     * @param len 最大长度
     * @returns {String}
     */
    beyondShowDot(s,len){
        let stringLength = s.length;
        if(stringLength <= len){
            return s;
        }else{
            return s.substr(0,len) + "...";
        }
    },
    fnGetBase64 (obj,fn){
        const file = obj.files[0];
        let fileType;
        //防止空指针
        if(typeof(file) === "undefined"){
            return false;
        }
        //判断类型是不是图片
        if(!file.type){
            alert("该款手机不支持相册上传，请使用拍照上传。或者窗口提交");
            return false;
        }
        if(/image\/\w+|video\/\w+/.test(file.type)){
            // fileType = file.type.split("/")[1];
            fileType = file.type;
        }else{
            alert("请上传正确图片类型");
            return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
            fn(this.result,fileType);
        };
    }
};
