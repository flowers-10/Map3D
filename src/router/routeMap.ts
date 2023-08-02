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
  {
    path: "/Vue3Point",
    component: () => import("../views/Point/index.vue"),
    name: "Vue3Point",
    meta: {
      navLink: "城市消费水平",
    },
  },
  {
    path: "/ScrollBar",
    component: () => import("../views/ScrollBar/index.vue"),
    name: "ScrollBar",
    meta: {
      navLink: "滚动柱状图",
    },
  },
];
