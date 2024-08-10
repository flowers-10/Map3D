<template>
  <div style="box-sizing: border-box">
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import gsap from "gsap";
import * as THREE from "three";
import * as d3geo from "d3-geo";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import {
  mapVertexCommon,
  mapBeginVertex,
} from "../../Shader/Map3D/vertexShader";
import {
  mapFragmentCommon,
  mapOutputFragment,
} from "../../Shader/Map3D/fragmentShader";
import {
  skyVertexCommon,
  skyBeginVertex,
} from "../../Shader/StattySky/vertexShader";
import {
  skyFragmentCommon,
  skyOutputFragment,
} from "../../Shader/StattySky/fragmentShader";
import ThreeInstance from "../../core/ThreeInstance";
import { CONFIG_OPT } from "../../core/config/configOpt";

const canvasDom = ref();
const instance = ref();

CONFIG_OPT.camera.position = {
  x: 600,
  y: 600,
  z: 600,
};

CONFIG_OPT.sources = [
  {
    name: "locationTexture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show:true,
    path: "/texture/blue-location.png",
  },
  {
    name: "locationTextureGreen",
    type: "TEXTURE",
    show:true,
    path: "/texture/green-location.png",
  },
  {
    name: "locationTextureRed",
    type: "TEXTURE",
    show:true,
    path: "/texture/red-location.png",
  },
  {
    name: "locationTextureYellow",
    type: "TEXTURE",
    show:true,
    path: "/texture/yellow-location.png",
  },
  {
    name: "border1Texture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show:true,
    path: "/texture/rotationBorder1.png",
  },
  {
    name: "border2Texture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show:true,
    path: "/texture/rotationBorder2.png",
  },
  {
    name: "focusMoveBgTexture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show:true,
    path: "/texture/focus_move_bg.png",
  },

  {
    name: "bgTexture",
    type: "TEXTURE",
    show:true,
    path: "/texture/bg.png",
  },
  {
    name: "fontLang",
    type: "FONT",
    show:true,
    path: "/font/TsangerYuYangT_W03_Regular.json",
  },
];

onMounted(() => {
  instance.value = new ThreeInstance(canvasDom.value, CONFIG_OPT);
  instance.value.resources.on("ready", () => {
    // Setup
  });

  instance.value.time.on("tick", () => {});
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
