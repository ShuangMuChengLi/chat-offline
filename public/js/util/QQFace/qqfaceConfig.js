/*!
 * qqface v1.0.0
 * http://www.linchaoqun.com
 *
 * Copyright 2016, linchaoqun
 * Date: 2016-08-23
 * ie.:
	var oQQFace = new QQFace();
	var sString = "[微笑]  /::) /墨镜";
	var s = oQQFace.replace(sString);
 */
"use strict";
(function(){
    var fnData = function(QQFace){
        /** @private */
        QQFace.prototype.data = {
            "0":["/::)","微笑","wx"],
            "1":["/::~","撇嘴","pz"],
            "2":["/::B","色","se"],
            "3":["/::|","发呆","fd"],
            "4":["/:8-)","得意","dy"],
            "5":["/::<","流泪","ll"],
            "6":["/::$","害羞","hx"],
            "7":["/::X","闭嘴","bz"],
            "8":["/::Z","睡","shui"],
            "9":["/::’(","大哭","dk"],
            "10":["/::-|","尴尬","gg"],
            "11":["/::@","发怒","fn"],
            "12":["/::P","调皮","tp"],
            "13":["/::D","呲牙","cy"],
            "14":["/::O","惊讶","jy"],
            "15":["/::(","难过","ng"],
            "16":["/::+","酷","kuk"],
            "17":["/:–b","冷汗","lengh"],
            "18":["/::Q","抓狂","zk"],
            "19":["/::T","吐","tuu"],
            "20":["/:,@P","偷笑","tx"],
            "21":["/:,@-D","可爱","ka"],
            "22":["/::d","白眼","baiy"],
            "23":["/:,@o","傲慢","am"],
            "24":["/::g","饥饿","jie"],
            "25":["/:|-)","困","kun"],
            "26":["/::!","惊恐","jk"],
            "27":["/::L","流汗","lh"],
            "28":["/::>","憨笑","hanx"],
            "29":["/::,@","大兵","db"],
            "30":["/:,@f","奋斗","fendou"],
            "31":["/::-S","咒骂","zhm"],
            "32":["/:?","疑问","yiw"],
            "33":["/:,@x","嘘...","xu"],
            "34":["/:,@@","晕","yun"],
            "35":["/::8","折磨","zhem"],
            "36":["/:,@!","哀","shuai"],
            "37":["/:!!!","骷髅","kl"],
            "38":["/:xx","敲打","qd"],
            "39":["/:bye","再见","zj"],
            "40":["/:wipe","擦汗","ch"],
            "41":["/:dig","抠鼻","kb"],
            "42":["/:handclap","鼓掌","gz"],
            "43":["/:&-(","糗大了","qd"],
            "44":["/:B-)","坏笑","huaix"],
            "45":["/:<@","左哼哼","zhh"],
            "46":["/:@>","右哼哼","yhh"],
            "47":["/::-O","哈欠","hq"],
            "48":["/:>-|","鄙视","bs"],
            "49":["/:P-(","委屈","wq"],
            "50":["/::’|","快哭了","kk"],
            "51":["/:X-)","阴险","yx"],
            "52":["/::*","亲亲","qq"],
            "53":["/:@x","吓","xia"],
            "54":["/:8*","可怜","kel"],
            "55":["/:pd","菜刀","cd"],
            "56":["/:<W>","西瓜","xig"],
            "57":["/:beer","啤酒","pj"],
            "58":["/:basketb","篮球","lq"],
            "59":["/:oo","乒乓","pp"],
            "60":["/:coffee","咖啡","kf"],
            "61":["/:eat","饭","fan"],
            "62":["/:pig","猪头","zt"],
            "63":["/:rose","玫瑰","mg"],
            "64":["/:fade","凋谢","dx"],
            "65":["/:showlove","示爱","sa"],
            "66":["/:heart","爱心","xin"],
            "67":["/:break","心碎","xs"],
            "68":["/:cake","蛋糕","dg"],
            "69":["/:li","闪电","shd"],

            "70":["/:bome","炸弹","zhd"],
            "71":["/:kn","刀","dao"],
            "72":["/:footb","足球","zq"],
            "73":["/:ladybug","瓢虫","pch"],
            "74":["/:shit","便便","bb"],
            "75":["/:moon","月亮","yl"],
            "76":["/:sun","太阳","ty"],
            "77":["/:gift","礼物","lw"],
            "78":["/:hug","拥抱","yb"],
            "79":["/:strong","强","qiang"],
            "80":["/:weak","弱","ruo"],
            "81":["/:share","握手","ws"],
            "82":["/:v","胜利","shl"],
            "83":["/:@)","抱拳","bq"],
            "84":["/:jj","勾引","gy"],
            "85":["/:@@","拳头","qt"],
            "86":["/:bad","差劲","cj"],
            "87":["/:lvu","爱你","aini"],
            "88":["/:no","bu","no"],
            "89":["/:ok","hd","ok"],
            "90":["/:love","爱情","aiq"],
            "91":["/:<L>","飞吻","fw"],
            "92":["/:jump","跳跳","tiao"],
            "93":["/:shake","发抖","fad"],
            "94":["/:<O>","怄火","oh"],
            "95":["/:circle","转圈","zhq"],
            "96":["/:kotow","磕头","kt"],
            "97":["/:turn","回头","ht"],
            "98":["/:skip","跳绳","tsh"],
            "99":["/:","挥手","hsh"],
            "100":["/:#-0","激动","jd"],
            "101":["/:","街舞","jw"],
            "102":["/:kiss","献吻","xw"],
            "103":["/:<&","左太极","zuotj"],
            "104":["/:&>","右太极","youtj"]
        };
    };
    if (typeof define === "function" && define.amd){
        define(["qqface"],function(QQFace) {
            fnData(QQFace);
        });
    }else{
        fnData(QQFace);
    }
})();
