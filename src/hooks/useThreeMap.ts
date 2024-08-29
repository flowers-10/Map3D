CONFIG_OPT.camera = {
  fov: 75,
  near: 0.1,
  far: 1000,
  position: {
    x: 0,
    y: 0,
    z: 1.6,
  },
  lookAt: true,
  controls: {
    show: true,
    enableDamping: true,
    minPolarAngle: Math.PI * 0.25,
    maxPolarAngle: Math.PI * 0.75,
    minAzimuthAngle: -Math.PI * 0.45,
    maxAzimuthAngle: Math.PI * 0.25,
    enablePan: false,
  },
};

CONFIG_OPT.light = [
  {
    type: "point", // 点光源
    color: "#3e99e5", // 颜色
    intensity: 3, // 强度
    distance: 500,
    helper: false, // 助手
    lightId: 0,
    lightName: "光源1",
    position: {
      x: -10,
      y: 48,
      z: 50,
    },
  },
  //  实现渐变色
  {
    type: "point", // 点光源
    color: "#3e99e5", // 颜色
    intensity: 3, // 强度
    distance: 285,
    helper: false, // 助手
    lightId: 1,
    lightName: "光源2",
    position: {
      x: 1,
      y: -5,
      z: 50,
    },
  },
  // 侧边特效打光
  {
    type: "point", // 点光源
    color: "#3e99e5", // 颜色
    intensity: 10, // 强度
    distance: 285,
    helper: false, // 助手
    lightId: 2,
    lightName: "光源3",
    position: {
      x: 1,
      y: -28,
      z: 3,
    },
  },
];

const useThree = (canvas: HTMLCanvasElement) => {
    const instance: AUTO.ThreeAuto = new AUTO.ThreeAuto(canvas);
    const resources = new AUTO.Resources(sources)
};
