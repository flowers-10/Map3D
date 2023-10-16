import * as THREE from "three";
import * as d3 from "d3";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import json from './json/china.json'
import px from "./textures/cube/px.png";
import py from "./textures/cube/py.png";
import pz from "./textures/cube/pz.png";
import nx from "./textures/cube/nx.png";
import ny from "./textures/cube/ny.png";
import nz from "./textures/cube/nz.png";

// 墨卡托投影转换
const projection = d3
  .geoMercator()
  .center([104.0, 37.5])
  .scale(80)
  .translate([0, 0]);

// 地图材质颜色
const COLOR_ARR = ["#0465BD", "#357bcb", "#3a7abd"];
// const HIGHT_COLOR = '#4fa5ff'

export default class lineMap {
  constructor(container, el) {
    this.container = container ? container : document.body;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.provinceInfo = el;
  }

  init() {
    this.provinceInfo =
      this.provinceInfo || document.getElementById("provinceInfo");
    this.group = new THREE.Object3D(); // 标注

    this.selectedObject = null;
    // 渲染器
    if (!this.renderer) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    }
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // 清除背景色，透明背景
    this.renderer.setClearColor(0xffffff, 0);

    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    // 场景
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // 相机 透视相机
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      5000
    );
    this.camera.position.set(0, -40, 70);
    this.camera.lookAt(0, 0, 0);

    this.setController(); // 设置控制

    this.setLight(); // 设置灯光
    this.loadMapData();
    this.animate();
  }

  loadMapData() {
    let _this = this;

    let jsonData = json;

    _this.initMap(jsonData);
  }

  initMap(chinaJson) {
    // 建一个空对象存放对象
    this.map = new THREE.Object3D();

    let _this = this;

    // 加载贴图材质
    const urls = [px, nx, py, ny, pz, nz];

    // 绘制地图
    new THREE.CubeTextureLoader().load(
      urls,
      function (cubeTexture) {
        chinaJson.features.forEach((elem, index) => {
          // 定一个省份3D对象
          const province = new THREE.Object3D();
          // 每个的 坐标 数组
          const coordinates = elem.geometry.coordinates;
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

              const geometry = new THREE.ExtrudeGeometry(
                shape,
                extrudeSettings
              );

              const material = new THREE.MeshStandardMaterial({
                metalness: 1,
                color: color,
              });

              const material1 = new THREE.MeshStandardMaterial({
                metalness: 1,
                roughness: 1,
                color: color,
              });

              const mesh = new THREE.Mesh(geometry, [material, material1]);
              if (index % 2 === 0) {
                mesh.scale.set(1, 1, 1.2);
              }

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

          _this.map.add(province);
        });

        _this.scene.environment = cubeTexture;
        // 销毁贴图
        cubeTexture.dispose();
        _this.scene.add(_this.map);
        // this.renderer.render();
      },
      () => {},
      (e) => {
        console.log(e);
      }
    );
  }

  setLight() {
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(20, -50, 50);
    this.scene.add(pointLight);
  }

  setController() {
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.update();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.camera.updateMatrixWorld();
    this.controller.update();
    this.renderer.render(this.scene, this.camera);
  }
  // 丢失 context
  destroyed() {
    if (this.renderer) {
      this.renderer.forceContextLoss();
      this.renderer.dispose();
      this.renderer.domElement = null;
      this.renderer = null;
    }
    window.removeEventListener("resize", this.resizeEventHandle);
  }
}
