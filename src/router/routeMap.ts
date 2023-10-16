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
    path: "/BaseMap",
    component: () => import("../views/Index/BaseMap.vue"),
    name: "BaseMap",
    meta: {
      navLink: "基础3D地图",
    },
  },
  {
    path: "/Vue2MapDrill",
    component: () => import("../views/Index/vue2Version.vue"),
    name: "Vue2MapDrill",
    meta: {
      navLink: "3D地图下钻Vue2版本",
    },
  },
  {
    path: "/Vue3MapDrill",
    component: () => import("../views/Point/vue3Version.vue"),
    name: "Vue3MapDrill",
    meta: {
      navLink: "3D地图下钻Vue3版本",
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
  
];
