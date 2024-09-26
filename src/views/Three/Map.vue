<template>
  <div style="box-sizing: border-box; background: black">
    <div
      style="
        position: absolute;
        top: 20px;
        left: 20px;
        color: aliceblue;
        font-size: 20px;
      "
    >
      threejs路由切换时上一个场景会占用内存,重新刷新即可解决，此问题等待后续版本优化！
      todo: 地图动画待添加！
    </div>
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as AUTO from "three-auto";
import ChinaJson from "../../assets/JSON/Zhejiang.json";

const canvasDom = ref();
const instance = ref<AUTO.ThreeInstance>();
onMounted(() => {
  instance.value = new AUTO.ThreeAuto(canvasDom.value, {
    id: "_scene",
    name: "Hello three auto",
    camera: {
      type: "PerspectiveCamera",
      fov: 75,
      near: 0.1,
      far: 1000,
      position: {
        x: 0,
        y: 0,
        z: 20,
      },
      lookAt: true,
      controls: {
        show: true,
        enableDamping: true,
        enablePan: true,
        minPolarAngle: 0,
        maxPolarAngle: Math.PI,
        minAzimuthAngle: 0,
        maxAzimuthAngle: Number.MAX_VALUE,
      },
    },
    size: {
      type: "window",
      id: "",
    },
    renderer: {
      antialias: true,
      alpha: true,
      clearAlpha: 1,
      clearColor: "#000000",
    },
    series: [
      {
        name: "轮廓地图",
        id: 0,
        type: "map",
        castShadow: false,
        receiveShadow: false,
        json: ChinaJson,
        itemStyle: {
          depth: 1,
          bevelEnabled: false,
          bevelSegments: 1,
          bevelSize: 0,
          bevelThickness: 0,
          extrudeFaces: {
            material: "MeshNormalMaterial",
            color: "#ccc",
            opacity: 1,
            metalness: 1,
            roughness: 1,
          },
          crossSection: {
            material: "MeshNormalMaterial",
            opacity: 0.8,
            color: "#000",
          },
          lineStyle: {
            show: true,
            color: "#A0E5FF",
            width: 2,
          },
          label: {
            show: true,
            distance: 1.3,
            rotation: {
              x: 0,
              y: 0,
              z: 0,
            },
            textStyle: {
              padding: "8px",
              "font-size": "20px",
              color: "#fff",
              bold: true,
              "font-weight": 400,
              "font-style": "normal",
            },
          },
        },
      },
    ],
  });
  instance.value.time.on("tick", () => {});
});
onBeforeUnmount(() => {
  instance.value?.scene?.remove();
  if (!instance.value) return;
  (instance.value as any).dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>