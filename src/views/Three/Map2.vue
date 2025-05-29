<template>
  <div style="box-sizing: border-box; background: black">
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as AUTO from "three-auto";
import * as THREE from "three";
import ZhejiangJSON from "../../assets/JSON/Zhejiang.json";
import ChinaJSON from "../../assets/JSON/china1.json";

const canvasDom = ref();
const instance = ref<AUTO.ThreeAuto>();
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
      fov: 45,
      near: 1,
      far: 10000,
      position: {
        x: 0,
        y: 0,
        z: 40,
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
      clearColor: "#000",
    },
    series: [
      {
        shadow: true,
        name: "轮廓地图",
        id: 0,
        type: "map",
        json: ZhejiangJSON,
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
    resource: [
      {
        name: "side",
        type: "TEXTURE",
        path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMxSURBVHgB7dZBDcJQFADBB/kCuHAgAQckHAA3Tf27aIXsjIjNXv7bfgyQdB0gSwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgbN2erwGaHACECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCErfv7M0CTA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCw9fj+BmhyABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB2Amb1BS2MWc5zAAAAAElFTkSuQmCC",
      },
    ],
    light: [
      {
        type: "ambient",
        intensity: 1,
        color: "#fff",
      },
     
    ],
    // postprocess: {
    //   type: 'moebius',
    // }
  });
  instance.value.resource?.on("ready", () => {
    const children = instance.value?.series?.seriesGroup?.children;
    if (children) {
      children[0].children.forEach((item) => {
        item.children.forEach((item:any) => {
          if (item.type === "Mesh") {
            // 创建顶面材质（带渐变效果）
            const topMapMaterial = new THREE.MeshStandardMaterial({
              color: 16777215, // 白色
              transparent: true,
              opacity: 0.5,
            });
            const directionMap: Record<"x" | "y" | "z", number> = {
              x: 1,
              y: 2,
              z: 3,
            };
            const startColor = 2781042,
              endColor = 860197,
              gradientSize = 15,
              direction = "x";
           
            // 获取侧面纹理
            const sideTexture = instance.value?.resource?.items.get("side");
            sideTexture.wrapS = THREE.RepeatWrapping;
            sideTexture.wrapT = THREE.RepeatWrapping;
            sideTexture.repeat.set(1, 1.5);
            sideTexture.offset.y += 0.065;

            // 创建侧面材质（带流动纹理）
            const sideMaterial = new THREE.MeshStandardMaterial({
              color: 16777215, // 白色
              map: sideTexture,
              fog: false,
              opacity: 0,
              side: THREE.DoubleSide,
            });
            item.material = [topMapMaterial, sideMaterial];

            instance.value?.time.on("tick", () => {
              sideTexture.offset.y += 0.0001; // 纹理Y轴偏移，产生流动效果
            });
          }
        });
      });
    }
  });
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
