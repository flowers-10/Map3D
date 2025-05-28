<template>
  <div style="box-sizing: border-box; background: black">
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
    shadow: {
      show: true,
      width: 1000,
      height: 1000,
      color: "#000",
      opacity: 0.1,
      rotation: { x: 0, y: 0, z: 0 },
    },
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
        enable: true,
        enableDamping: true,
        enablePan: true,
      },
    },
    size: {
      type: "window",
    },
    renderer: {
      antialias: true,
      alpha: true,
      clearAlpha: 1,
      clearColor: "#fff",
    },
    series: [
      {
        shadow: true,
        name: "轮廓地图",
        id: 0,
        type: "map",
        json: ChinaJson,
        animation: true,
        animationDuration: 350,
        animationEasing: "power1.inOut",
        animationDelay: 0,
        selectedOffset: 2.5,
        eventName: "click",
        data: [],
        tooltip: {
          className: "three-auto-tooltip",
          background: "rgba(255,255,255,1)",
          show: true,
          borderWidth: 1,
          padding: "15px 20px",
          hideDelay: 100,
          textStyle: {
            "font-size": "18px",
            color: "#000000",
            "font-weight": 400,
            "font-style": "normal",
          },
        },
        label: {
          type: "css3",
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
        itemStyle: {
          depth: 1,
          bevelEnabled: false,
          bevelSegments: 1,
          bevelSize: 0,
          bevelThickness: 0,
          extrudeFaces: {
            material: "MeshNormalMaterial",
            color: "red",
            opacity: 1,
            metalness: 1,
            roughness: 1,
          },
          crossSection: {
            material: "MeshNormalMaterial",
            opacity: 1,
            color: "red",
          },
          lineStyle: {
            show: true,
            color: "#A0E5FF",
            width: 2,
          },
        },
      },
    ],
    // postprocess: {
    //   type: 'moebius',
    // }
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
