/*!
 * qqface v1.0.0
 * http://www.linchaoqun.com
 * Date: 2016-08-23
 * ie.:
	var oQQFace = new QQFace();
	var sString = "[微笑]  /::) /墨镜";
	var s = oQQFace.replace(sString);
 */
"use strict";
(function(){
    var root = this;
    var qqFace = function(path){
        this.path = path || "images/faceIcon/";
        this.init();
    };
    /** @private */
    qqFace.prototype.init = function(){
        var self = this;
        self.map = [];
        var a = [],b = [];// 存储正则子项
        if(!this.data){
            console.error("请导入qqfaceConfig.js");
            return;
        }
        for (var i in this.data) {
            var item0 = this.data[i][0],
                item1 = this.data[i][1],
                item2 = this.data[i][2];
            if(item0 && item0 != "/:"){
                a.push(self.escape_rx(item0));
                self.map[item0] = i;
            }
            if(item1){
                b.push(item1);
                self.map[item1] = i;
            }
            if(item2){
                b.push(item2);
                self.map[item2] = i;
            }
        }
        self.rx_en =  new RegExp("(" + a.join("|") + ")", "g");// ie. /::)
        self.rx_CN = new RegExp(("\\/(" + b.join("|") + ")"), "g");// ie. /微笑 /wx
        self.rx_CN_bracket = new RegExp(("\\[(" + b.join("|") + ")\\]"), "g");// ie. [微笑]
    };
    /** @private */
    qqFace.prototype.escape_rx = function(text){
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    /**
    * @param{String} s 要转换的字符串s
    * @return 转换为带表情的字符串
    **/
    qqFace.prototype.replace = function(s){
        var self = this;
        var aRex = [self.rx_CN_bracket];
        for(var i in aRex){
            s = s.replace(aRex[i],function(){
                return self.html(self.map[arguments[1]]);
            });
        }
        return s;
    };
    /** @private */
    qqFace.prototype.html = function(id){
        return "<img src='" + this.path + "faceIcon/" + id + ".png' width='24' height='24' style='width:24px;height:24px;border:none;'>";
    };

    // export
    if (typeof define === "function" && define.amd){
        define(function() { return qqFace; });
    }else{
        root.QQFace = qqFace;
    }
}).call(function(){
    return this || (typeof window !== "undefined" ? window : global);
}());
