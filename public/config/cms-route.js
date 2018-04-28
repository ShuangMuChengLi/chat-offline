/**
 * Created by lin on 2017/5/4.
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const index = resolve => {
    require.ensure(["../html/components/index-component.vue"], () => {
        resolve(require("../html/components/index-component.vue"));
    });
};
const list = resolve => {
    require.ensure(["../html/components/list-component.vue"], () => {
        resolve(require("../html/components/list-component.vue"));
    });
};
const routes = [
    { path: "/:userId", component: index },
    { path: "/", component: list },
];
export default new VueRouter({
    routes // （缩写）相当于 routes: routes
});
