import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

import Experience from "../../ThreeMap3D";

export default class Css2DRenderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    const div = document.getElementById("tag");
    // HTML元素转化为threejs的CSS2模型对象
    const tag = new CSS2DObject(div);
    tag.position.set(0,0,0.8);
    this.scene.add(tag);
    this.setInstance();
  }

  setInstance() {
    this.instance = new CSS2DRenderer();
    this.instance.setSize(this.sizes.width, this.sizes.height);
    console.log(this.instance.domElement,9999);
    this.instance.domElement.style.pointerEvents = 'none';
    this.instance.domElement.style.zIndex = 999;
    this.instance.domElement.style.position = 'absolute';
    this.instance.domElement.style.top = 0;
    document.body.appendChild(this.instance.domElement);

  }

  resize() {
    this.instance.setSize(this.sizes?.width, this.sizes.height);
  }

  update() {
    this.instance.render(this.scene, this.camera?.instance);
  }

  info(message = "当前内存：") {
    console.log(message, this.instance.info.memory);
  }

  dispose() {
    this.instance.clear();
    this.instance.setSize(0, 0);
    this.instance.dispose();
    this.info("清空内存后：");
  }
}
