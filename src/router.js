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
      name: "testwebgl1",
      component: () =>
      import("./views/testwebgl1.vue")
    },
    {
      path: "/2",
      name: "testwebgl2",
      component: () =>
      import("./views/testwebgl2.vue")
    },
    {
      path: "/3",
      name: "multiPoint",
      component: () =>
      import("./views/multiPoint.vue")
    },
    {
      path: "/4",
      name: "triangle",
      component: () =>
      import("./views/triangle.vue")
    },
    {
      path: "/5",
      name: "matrix",
      component: () =>
      import("./views/matrix.vue")
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
