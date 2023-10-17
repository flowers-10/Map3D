<template>
  <div ref="box" class="china-chart">
    <canvas class="webgl"></canvas>
  </div>
</template>
<script>
import * as THREE from "three";
import * as d3 from "d3";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import jsonData from "./json/china.json";

export default {
  name: "Map",

  data() {
    return {};
  },
  mounted() {
    /**
     * Base
     */
    // Debug

    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Object
     */
    // 墨卡托投影转换
    const projection = d3
      .geoMercator()
      .center([104.0, 37.5])
      .scale(80)
      .translate([0, 0]);

    // 地图材质颜色
    const COLOR_ARR = ["#0465BD", "#357bcb", "#3a7abd"];
    // 建一个空对象存放对象
    const map = new THREE.Object3D();
    jsonData.features.forEach((elem, index) => {
      // 定一个省份3D对象
      const province = new THREE.Object3D();
      // 每个的 坐标 数组
      const { coordinates } = elem.geometry;
      const color = COLOR_ARR[index % COLOR_ARR.length];
      // 循环坐标数组
      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const shape = new THREE.Shape();

          for (let i = 0; i < polygon.length; i++) {
            let [x, y] = projection(polygon[i]);

            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
          }

          const extrudeSettings = {
            depth: 4,
            bevelEnabled: true,
            bevelSegments: 1,
            bevelThickness: 0.2,
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

          // 平面部分材质
          const material = new THREE.MeshStandardMaterial({
            metalness: 1,
            color: color,
          });
          // 拉高部分材质
          const material1 = new THREE.MeshStandardMaterial({
            metalness: 1,
            roughness: 1,
            color: color,
          });

          const mesh = new THREE.Mesh(geometry, [material, material1]);
          // 设置高度将省区分开来
          if (index % 2 === 0) {
            mesh.scale.set(1, 1, 1.2);
          }
          // 给mesh开启阴影
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh._color = color;
          province.add(mesh);
        });
      });
      // 将geo的属性放到省份模型中
      province.properties = elem.properties;
      if (elem.properties.centorid) {
        const [x, y] = projection(elem.properties.centorid);
        province.properties._centroid = [x, y];
      }
      map.add(province);
    });
    map.rotation.x = Math.PI * 0;
    map.rotation.y = Math.PI * 0;
    map.rotation.z =Math.PI * 0;
    scene.add(map);

    /**
     * Lights
     */
    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(20, 50, 50);
    scene.add(pointLight);

    /**
     * Sizes
     */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    window.addEventListener("resize", () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(1, 100, 1);
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Animate
     */
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update controls
      controls.update();

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  },
  beforeDestroy() {},
  methods: {},
};
</script>
<style scoped>
.china-chart {
  position: relative;
  width: 100%;
  height: 100vh;
}
.webgl {
  position: absolute;
  color: #fff;
  user-select: none;
}
</style>
