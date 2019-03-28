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
      path: "/6",
      name: "animation",
      component: () =>
      import("./views/animation.vue")
    },
    {
      path: "/7",
      name: "texture",
      component: () =>
      import("./views/texture.vue")
    },
    {
      path: "/8",
      name: "texture2",
      component: () =>
      import("./views/texture2.vue")
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting  texture2
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    // 再敲一遍，，，╯▂╰玩了几天都忘了
    {
      path: "/double",
      name: "double",
      component: () =>
        import("./double/double.vue")
    },
    {
      path: "/double2",
      name: "double2",
      component: () =>
        import("./double/double2.vue")
    },
    {
      path: "/double3",
      name: "double3",
      component: () =>
        import("./double/double3.vue")
    },
    {
      path: "/double4",
      name: "double4",
      component: () =>
        import("./double/double4.vue")
    },
    {
      path: "/double5",
      name: "double5",
      component: () =>
        import("./double/double5.vue")
    },
  ]
});
