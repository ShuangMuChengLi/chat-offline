/**
 * Created by lin on 2017/4/17.
 */
require("./../css/base.less");
import 'element-ui/lib/theme-chalk/index.css';
import Vue from "vue";
import vue_resource from "vue-resource";
import ElementUI from "element-ui";
import router from "../config/cms-route";
require("socket.io-client");
require("query-string");
require("./util/util");
require("lodash");
Vue.use(vue_resource);
Vue.use(ElementUI);

new Vue({
    router,
    el:"#app",
    data () {
        return {
        };
    },
    methods:{

    },
    mounted:function () {

    }
});
