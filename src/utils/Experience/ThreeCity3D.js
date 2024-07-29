import * as THREE from "three";

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from "./Utils/Resources.js";

import sources from "./World/City3D/sources";
import Camera from "./World/City3D/Camera.js";
import Renderer from "./World/City3D/Renderer";
import City3D from "./World/City3D/City3D";

let instance = null;

export default class Experience {
  constructor(canvas, options) {
    //  Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    // Global access
    window.experience = this;

    // 选项
    this.canvas = canvas;
    const { camera, renderer } = options;
    // 初始化
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources([
      {
        name: "shanghai",
        type: "gltfModel",
        path: '/gltf/shanghai.gltf',
      },
    ]);
    this.camera = new Camera(camera);
    // this.light = new Light()
    this.renderer = new Renderer(renderer);
    this.world = new City3D();

    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {
    this.camera?.resize();
    this.renderer?.resize();
  }
  update() {
    this.camera?.update();
    this.world.update();
    this.renderer?.update();
  }

  dispose() {
    // 取消订阅
    this.sizes?.off("resize");
    this.time?.off("tick");
    /* 销毁场景里的几何体 材质等 */
    this.scene?.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          for (const key of child.material) {
            const value = child.material[key];
            // console.log(value);

            if (
              value &&
              value.hasOwnProperty("dispose") &&
              typeof value.dispose === "function"
            ) {
              value.dispose();
            }
          }
        }
      }
    });
    // 清空场景
    this.scene?.clear();
    // 销毁渲染器
    this.renderer?.dispose();
    // 销毁轨道控制器
    this.camera?.dispose();
    // 销毁实例
    instance = null;
  }
}
