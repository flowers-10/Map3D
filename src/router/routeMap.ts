export const routes = [
  {
    path: "/",
    component: () => import("../views/Index/index.vue"),
    name: "Home",
    meta: {
      navLink: "首页",
    },
  },
  {
    path: "/Vue2MapDrill",
    component: () => import("../views/Index/vue2Version.vue"),
    name: "Vue2MapDrill",
    meta: {
      navLink: "地图下钻Vue2版本",
    },
  },
  {
    path: "/Vue3MapDrill",
    component: () => import("../views/Index/vue3Version.vue"),
    name: "Vue3MapDrill",
    meta: {
      navLink: "地图下钻Vue3版本",
    },
  },
];
