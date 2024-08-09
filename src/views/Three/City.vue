<template>
  <div class="w-screen h-screen flex justify-center items-center text-9xl">
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as THREE from "three";
import gsap from "gsap";
import ThreeInstance from "../../core/ThreeInstance";
import { CONFIG_OPT } from "../../core/config/configOpt";
import { fragmentShader } from "../../Shader/City3D/fragmentShader";
import { vertexShader } from "../../Shader/City3D/vertexShader";

const canvasDom = ref();
const instance = ref();

CONFIG_OPT.camera.position = {
  x: 600,
  y: 600,
  z: 600,
};

CONFIG_OPT.sources = [
  {
    name: "shanghai",
    type: "GLTF",
    show: true,
    path: "/gltf/shanghai.gltf",
  },
];

const uniforms = {
  height: { value: 20 },
  uFlowColor: {
    value: new THREE.Color("#5588aa"),
  },
  uCityColor: {
    value: new THREE.Color("#1B3045"),
  },
};
const shader = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
  });

const setCityMaterial = (object: any, instance: ThreeInstance) => {
  const city = new THREE.Mesh(object.geometry, shader);
  city.position.set(object.position.x, object.position.y, object.position.z);
  city.name = "city";
  instance.scene.add(city);
  city.rotateX(-Math.PI / 2);
};
// 设置材质线条勾勒着色器
const setCityLineMaterial = (object: any, instance: ThreeInstance) => {
  const edges = new THREE.EdgesGeometry(object.geometry, 1);
  //设置模型的材质
  const lineMaterial = new THREE.LineBasicMaterial({
    // 线的颜色
    color: "rgba(38,133,254)",
  });
  //把数据组合起来
  const lineS = new THREE.LineSegments(edges, lineMaterial);
  //设置数据的位置
  lineS.position.set(object.position.x, object.position.y, object.position.z);
  //添加到场景
  instance.scene.add(lineS);

  lineS.rotateX(-Math.PI / 2);
};

onMounted(() => {
  instance.value = new ThreeInstance(canvasDom.value, CONFIG_OPT);
  instance.value.resources.on("ready", () => {
    // Setup
    instance.value.resources.items.shanghai.scene.traverse((child: any) => {
      // 设置线框材质
      if (child.isMesh) {
        //这个判断模型是楼房还是其他  加载不同的材质
        if (["CITY_UNTRIANGULATED"].includes(child.name)) {
          // 拿到模型线框的Geometry
          setCityLineMaterial(child, instance.value);
          setCityMaterial(child, instance.value);
        } else if (["ROADS"].includes(child.name)) {
          //道路
          const material = new THREE.MeshBasicMaterial({
            color: "rgb(41,46,76)",
          });
          const mesh = new THREE.Mesh(child.geometry, material);
          mesh.rotateX(-Math.PI / 2);
          mesh.position.set(
            child.position.x,
            child.position.y,
            child.position.z
          );
          instance.value.scene.add(mesh);
        } else {
          //地面
          const material = new THREE.MeshBasicMaterial({
            color: "#040912",
          });
          const mesh = new THREE.Mesh(child.geometry, material);
          instance.value.scene.add(mesh);
          mesh.rotateX(-Math.PI / 2);
          mesh.position.set(
            child.position.x,
            child.position.y,
            child.position.z
          );
        }
      }
    });
  });

  instance.value.time.on("tick", () => {
    uniforms.height.value += 0.2;
    if (uniforms.height.value > 100) {
      uniforms.height.value = 0;
    }
  });
});
onBeforeUnmount(() => {
  instance.value.dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
