import Vue from "vue";
import Router from "vue-router";
import testwebgl from "./views/testwebgl.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: testwebgl
    },
    {
      path: "/1",
      name: "home",
      component: () =>
      import(/* webpackChunkName: "about" */ "./views/testwebgl1.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    }
  ]
});