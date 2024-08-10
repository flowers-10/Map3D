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
import parentJson from "../../assets/JSON/parentJson.json";
import subJson from "../../assets/JSON/subJson.json";

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
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show: true,
    path: "/texture/rotationBorder1.png",
  },
  {
    name: "border2Texture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
    show: true,
    path: "/texture/rotationBorder2.png",
  },
  {
    name: "focusMoveBgTexture",
    type: "TEXTURE", // type类型 {texture:纹理,gltfModel:3D模型, cubeTexture:环境贴图}
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
    mapShow: false, // 地图显示
    lineShow: true, // 是否生成线
    textShow: false, // 是否生成区域名称
    name: "轮廓地图",
    mapId: 0,
    mapType: "parentJson", // 类型只有两种 parentJson:当前地区的包含子区域的json,subJson:只包含当前地区的整块json (必填项)
    shader: false, // 着色器特效开关 (开启影响性能)
    castShadow: false, // 投射阴影 开启影响性能
    receiveShadow: false, // 接受阴影 开启影响性能
    lineConfig: {
      depth: 0.111, // 线要放到的高度
      color: "#A0E5FF",
      linewidth: 0.002,
    },
    textConfig: {
      textType: "dom", // text3D （可能有锯齿） or canvas (过滤字体暂未开放)
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
      filterList: [
        "长宁区",
        "静安区",
        "普陀区",
        "徐汇区",
        "黄浦区",
        "虹口区",
        "杨浦区",
      ], // 需要特殊处理的
      filterStyle: {
        arrangement: "vertical",
        fontSize: 28,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
    },
    // 拉伸面配置
    extrudeFacesConfig: {
      color: "#3EB8F3",
      transparent: true,
      metalness: 1,
      roughness: 1,
      extrudeSettings: {
        depth: 0.11, // 地图拉伸深度
        bevelEnabled: false, //禁止倒角,默认true
        bevelSegments: 1, //倒圆角：倒角细分精度，默认3
        bevelSize: 0, //倒角尺寸:垂直拉伸方向
        bevelThickness: 0, //倒角尺寸:拉伸方向
      },
    },
    // 横截面配置
    crossSectionConfig: {
      transparent: true,
      color: "#2B61A6",
    },
  },
  {
    show: true, // 总体显示
    mapShow: true, // 地图显示
    lineShow: true, // 边框线显示
    textShow: true, // 地图文字
    name: "区域地图",
    mapId: 1,
    mapType: "subJson", // 类型
    shader: true, // 着色器开关
    castShadow: true,
    receiveShadow: true,
    lineConfig: {
      depth: 0.11, // 线要放到的高度
      color: "#ffffff",
      linewidth: 0.001,
    },
    textConfig: {
      textType: "dom", // text3D （可能有锯齿） or canvas (过滤字体暂未开放)
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
      filterList: [
        "长宁区",
        "静安区",
        "普陀区",
        "徐汇区",
        "黄浦区",
        "虹口区",
        "杨浦区",
      ], // 需要特殊处理的
      filterStyle: {
        arrangement: "vertical",
        fontSize: 28,
        color: "#ffffff",
        bold: true,
        lineHeight: 20,
        fontFamily: "Arial",
      },
    },
    // 拉伸面配置
    extrudeFacesConfig: {
      color: "#3a7abd",
      transparent: true,
      metalness: 1,
      roughness: 1,
      extrudeSettings: {
        depth: 0.1, // 地图拉伸深度
        bevelEnabled: false, //禁止倒角,默认true
        bevelSegments: 1, //倒圆角：倒角细分精度，默认3
        bevelSize: 0, //倒角尺寸:垂直拉伸方向
        bevelThickness: 0, //倒角尺寸:拉伸方向
      },
    },
    // 横截面配置
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
  const map = new THREE.Group();
  map.name = option.name;
  const texture = instance.value.resources.items.bgTexture;
  texture.repeat.set(2, 2); // 在x和y方向上重复两次纹理
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  // 使用公共材质用来提升性能
  // 横截面公共材质
  const material = new THREE.MeshPhongMaterial({
    shininess: 200,
    color: crossSectionConfig.color,
    transparent: crossSectionConfig.transparent,
    map: texture,
  });
  material.color.convertSRGBToLinear();
  // 拉伸面公共材质
  const material1 = new THREE.MeshStandardMaterial({
    metalness: extrudeFacesConfig.metalness,
    roughness: extrudeFacesConfig.roughness,
    color: extrudeFacesConfig.color,
    transparent: extrudeFacesConfig.transparent,
  });
  // 文字公共材质
  const textMaterial = new THREE.MeshBasicMaterial({
    wireframe: false,
    color: textConfig.textStyle.color,
  });
  // 线公共材质
  const lineMaterial = new LineMaterial({
    color: lineConfig.color,
    linewidth: lineConfig.linewidth,
  });

  // 总地图
  mapJson.features.forEach((elem: any) => {
    // 高亮对象
    // 区域3D对象和区块线3D对象
    const region: any = new THREE.Group();
    const lineRegion: any = new THREE.Group();
    const textRegion: any = new THREE.Group();
    const regionMap: any = new THREE.Group();
    regionMap.name = elem.properties.name;

    region.name = "region";
    lineRegion.name = "lineRegion";
    textRegion.name = "textRegion";
    // 坐标数组
    const { coordinates } = elem.geometry;
    // 遍历坐标数组生成地图块
    coordinates.forEach((multiPolygon: any) => {
      // 获得地图块详情数据开始绘制地图
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
          //  拉伸几何体
          const geometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeFacesConfig.extrudeSettings
          );
          if (option.shader) {
            // 横截面部分材质
            crossSectionUniforms = {
              iTime: { value: 0 },
              iTexture: { value: texture },
            };
            material.onBeforeCompile = (shader) => {
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
            customUniforms = {
              uTime: { value: 0 },
              depth: { value: extrudeFacesConfig.extrudeSettings.depth },
            };
            // 拉伸部分材质
            material1.onBeforeCompile = (shader) => {
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
          const mesh = new THREE.Mesh(geometry, [material, material1]);
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
    // 将geo的属性放到省份模型中
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

  instance.value.time.on("tick", () => {});
});
onBeforeUnmount(() => {
  console.log('我被卸载');
  
  instance.value.dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
