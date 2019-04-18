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
    {
      path: "/double6",
      name: "double6",
      component: () =>
        import("./double/double6.vue")
    },
    {
      path: "/double7",
      name: "double7",
      component: () =>
        import("./double/double7.vue")
    },
    {
      path: "/double8",
      name: "double8",
      component: () =>
        import("./double/double8.vue")
    },
    {
      path: "/double9",
      name: "double9",
      component: () =>
        import("./double/double9.vue")
    },
    {
      path: "/double10",
      name: "double10",
      component: () =>
        import("./double/double10.vue")
    },
    {
      path: "/double11",
      name: "double11",
      component: () =>
        import("./double/double11.vue")
    },
    {
      path: "/double12",
      name: "double12",
      component: () =>
        import("./double/double12.vue")
    },
    {
      path: "/double13",
      name: "double13",
      component: () =>
        import("./double/double13.vue")
    },
    {
      path: "/double14",
      name: "double14",
      component: () =>
        import("./double/double14.vue")
    },
    {
      path: "/double15",
      name: "double15",
      component: () =>
        import("./double/double15.vue")
    },
    {
      path: "/double16",
      name: "double16",
      component: () =>
        import("./double/double16.vue")
    },
  ]
});
