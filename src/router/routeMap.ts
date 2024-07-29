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
    component: () => import("../views/Echarts/BaseMap.vue"),
    name: "BaseMap",
    meta: {
      navLink: "基础地图",
    },
  },
  {
    path: "/Map3DVue2",
    component: () => import("../views/Echarts/Map3DVue2.vue"),
    name: "Map3DVue2",
    meta: {
      navLink: "3D地图下钻Vue2版本",
    },
  },
  {
    path: "/Map3DVue3",
    component: () => import("../views/Echarts/Map3DVue3.vue"),
    name: "Map3DVue3",
    meta: {
      navLink: "3D地图下钻Vue3版本",
    },
  },
  // {
  //   path: "/Vue3Point",
  //   component: () => import("../views/Point/index.vue"),
  //   name: "Vue3Point",
  //   meta: {
  //     navLink: "城市消费水平",
  //   },
  // },
  // {
  //   path: "/ThreeMap",
  //   component: () => import("../views/Three/Map.vue"),
  //   name: "ThreeMap",
  //   meta: {
  //     navLink: "Threejs地图",
  //   },
  // },
  {
    path: "/ThreeCity",
    component: () => import("../views/Three/City.vue"),
    name: "ThreeCity",
    meta: {
      navLink: "Threejs城市",
    },
  },
];
