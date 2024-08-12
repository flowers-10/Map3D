<template>
  <div style="box-sizing: border-box;background: #000;">
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
import gsap from "gsap";
import * as THREE from "three";
import * as d3geo from "d3-geo";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

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
import parentJson from "../../assets/JSON/parentJson.json";
import subJson from "../../assets/JSON/subJson.json";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const canvasDom = ref();
const instance = ref();

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

CONFIG_OPT.sources = [
  {
    name: "locationTexture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show: true,
    path: "/texture/blue-location.png",
  },
  {
    name: "locationTextureGreen",
    type: "TEXTURE",
    show: true,
    path: "/texture/green-location.png",
  },
  {
    name: "locationTextureRed",
    type: "TEXTURE",
    show: true,
    path: "/texture/red-location.png",
  },
  {
    name: "locationTextureYellow",
    type: "TEXTURE",
    show: true,
    path: "/texture/yellow-location.png",
  },
  {
    name: "border1Texture",
    type: "TEXTURE",
    show: true,
    path: "/texture/rotationBorder1.png",
  },
  {
    name: "border2Texture",
    type: "TEXTURE",
    show: true,
    path: "/texture/rotationBorder2.png",
  },
  {
    name: "focusMoveBgTexture",
    type: "TEXTURE",
    show: true,
    path: "/texture/focus_move_bg.png",
  },

  {
    name: "bgTexture",
    type: "TEXTURE",
    show: true,
    path: "/texture/bg.png",
  },
];

const series = [
  {
    show: true,
    mapShow: false,
    lineShow: true,
    textShow: false,
    name: "轮廓地图",
    mapId: 0,
    mapType: "parentJson",
    shader: false,
    castShadow: false,
    receiveShadow: false,
    lineConfig: {
      depth: 0.111, 
      color: "#A0E5FF",
      linewidth: 0.002,
    },
    textConfig: {
      textType: "dom", 
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      textStyle: {
        arrangement: "horizontal",
        fontSize: 20,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
      filterList: [],
      filterStyle: {
        arrangement: "vertical",
        fontSize: 28,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
    },
    extrudeFacesConfig: {
      color: "#3EB8F3",
      transparent: true,
      metalness: 1,
      roughness: 1,
      extrudeSettings: {
        depth: 0.11,
        bevelEnabled: false,
        bevelSegments: 1,
        bevelSize: 0,
        bevelThickness: 0,
      },
    },
    crossSectionConfig: {
      transparent: true,
      color: "#2B61A6",
    },
  },
  {
    show: true,
    mapShow: true,
    lineShow: true,
    textShow: true,
    name: "区域地图",
    mapId: 1,
    mapType: "subJson",
    shader: true,
    castShadow: true,
    receiveShadow: true,
    lineConfig: {
      depth: 0.11,
      color: "#ffffff",
      linewidth: 0.001,
    },
    textConfig: {
      textType: "dom",
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      textStyle: {
        arrangement: "horizontal",
        fontSize: 18,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
      filterList: [],
      filterStyle: {
        arrangement: "vertical",
        fontSize: 28,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
    },
    extrudeFacesConfig: {
      color: "#3a7abd",
      transparent: true,
      metalness: 1,
      roughness: 1,
      extrudeSettings: {
        depth: 0.1,
        bevelEnabled: false,
        bevelSegments: 1,
        bevelSize: 0,
        bevelThickness: 0,
      },
    },
    crossSectionConfig: {
      transparent: true,
      color: "#2B61A6",
    },
  },
];

const maps = new THREE.Group();
const json: any = {
  parentJson,
  subJson,
};

const createCenter = (mapJson: any, instance: ThreeInstance) => {
  const path = d3geo.geoPath();
  const bounds = path.bounds(mapJson);
  const width = bounds[1][0] - bounds[0][0];
  const height = bounds[1][1] - bounds[0][1];
  const scaleX = instance.sizes.width / width;
  const scaleY = instance.sizes.height / height;
  let scale = Math.min(scaleX, scaleY);

  const center = d3geo.geoCentroid(mapJson);

  return { center, scale };
};

let crossSectionUniforms: any = null;
let customUniforms: any = null;

const createMap = (mapJson: any, option: any, projection: any) => {
  const { lineConfig, extrudeFacesConfig, crossSectionConfig, textConfig } =
    option;
  const texture = instance.value.resources.items.bgTexture;
  texture.repeat.set(2, 2);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  customUniforms = {
    uTime: { value: 0 },
    depth: { value: extrudeFacesConfig.extrudeSettings.depth },
  };
  crossSectionUniforms = {
    iTime: { value: 0 },
    iTexture: { value: texture },
  };
  const map = new THREE.Group();
  map.name = option.name;

  const crossSectionMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhongMaterial,
    shininess: 200,
    color: crossSectionConfig.color,
    transparent: crossSectionConfig.transparent,
    map: texture,
    uniforms: customUniforms,
    vertexShader: ``,
    fragmentShader: ``,
  });

  const extrudeFacesMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    metalness: extrudeFacesConfig.metalness,
    roughness: extrudeFacesConfig.roughness,
    color: extrudeFacesConfig.color,
    transparent: extrudeFacesConfig.transparent,
    uniforms: customUniforms,
    vertexShader: ``,
    fragmentShader: ``,
  });
  const lineMaterial = new LineMaterial({
    color: lineConfig.color,
    linewidth: lineConfig.linewidth,
  });

  mapJson.features.forEach((elem: any) => {
    const region: any = new THREE.Group();
    const lineRegion: any = new THREE.Group();
    const textRegion: any = new THREE.Group();
    const regionMap: any = new THREE.Group();
    regionMap.name = elem.properties.name;

    region.name = "region";
    lineRegion.name = "lineRegion";
    textRegion.name = "textRegion";
    const { coordinates } = elem.geometry;
    coordinates.forEach((multiPolygon: any) => {
      multiPolygon.forEach((polygon: any) => {
        if (option.mapShow) {
          const shape = new THREE.Shape();
          for (let i = 0; i < polygon.length; i++) {
            let [x, y] = projection(polygon[i]);

            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
          }
          const geometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeFacesConfig.extrudeSettings
          );
          if (option.shader) {
            crossSectionMaterial.onBeforeCompile = (shader) => {
              shader.uniforms.iTime = crossSectionUniforms.iTime;

              shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                skyVertexCommon
              );

              shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                skyBeginVertex
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <common>",
                skyFragmentCommon
              );

              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <opaque_fragment>",
                skyOutputFragment
              );
            };

            extrudeFacesMaterial.onBeforeCompile = (shader) => {
              shader.uniforms.uTime = customUniforms.uTime;
              shader.uniforms.depth = customUniforms.depth;
              shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                mapVertexCommon
              );
              shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                mapBeginVertex
              );
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <common>",
                mapFragmentCommon
              );
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <opaque_fragment>",
                mapOutputFragment
              );
            };
          }
          const mesh = new THREE.Mesh(geometry, [
            crossSectionMaterial,
            extrudeFacesMaterial,
          ]);
          mesh.name = elem.properties.name;

          region.add(mesh);
        }
        if (option.lineShow) {
          const lineGeometry = new LineGeometry();
          const pointArray = [];
          for (let i = 0; i < polygon.length; i++) {
            let [x, y] = projection(polygon[i]);
            pointArray.push(new THREE.Vector3(x, -y, option.depth));
          }
          lineGeometry.setPositions(
            pointArray.map(({ x, y, z }) => [x, y, z]).flat()
          );

          const line = new Line2(lineGeometry, lineMaterial);
          lineRegion.add(line);
        }
      });
    });
    region.properties = elem.properties;
    lineRegion.properties = elem.properties;
    if (option.textShow) {
      let { x = 0, y = 0, z = 0 } = textConfig.rotation || {};
      if (textConfig.textType === "dom") {
        const { center } = createCenter(elem, instance.value);
        let [x, y] = projection(center);
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = [x, -y, lineConfig.depth + 0.1];

        particlesGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute([0, 0, 0], 3)
        );
        const particlesMaterial = new THREE.PointsMaterial({
          color: "#000",
          size: 0.02,
        });
        particlesMaterial.transparent = true;
        particlesMaterial.depthWrite = false;
        const particles = new THREE.Points(
          particlesGeometry,
          particlesMaterial
        );
        particles.position.fromArray(positions);
        particles.rotation.set(x, y, z);
        textRegion.add(particles);
      }
    }

    regionMap.add(region);
    regionMap.add(lineRegion);
    regionMap.add(textRegion);
    map.add(regionMap);
  });

  maps.add(map);
  instance.value.scene.add(maps);
};

onMounted(() => {
  instance.value = new ThreeInstance(canvasDom.value, CONFIG_OPT);
  let { center, scale } = createCenter(parentJson, instance.value);
  const projection = d3geo
    .geoMercator()
    .center(center)
    .scale(scale * 0.1)
    .translate([0, 0]);
  instance.value.resources.on("ready", () => {
    series.forEach((item: any) => {
      if (item.show) {
        createMap(json[item.mapType], item, projection);
      }
    });
  });

  instance.value.time.on("tick", () => {
    if (customUniforms && customUniforms.uTime) {
      customUniforms.uTime.value = instance.value.time.elapsedTime * 0.5;
    }
    if (crossSectionUniforms && crossSectionUniforms.iTime) {
      crossSectionUniforms.iTime.value = instance.value.time.elapsedTime;
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
