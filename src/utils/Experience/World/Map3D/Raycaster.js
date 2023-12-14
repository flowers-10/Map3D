import * as THREE from "three";
import gsap from 'gsap';
import Experience from "../../ThreeMap3D";

export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.mouse = this.experience.mousemove.mouse;
    this.mouseOffset = this.experience.mousemove.eventOffset;
    this.camera = this.experience.camera.instance;
    this.objectsToTest = this.experience.world.sprite.spriteGroup.children;
    this.objectsToMap = this.experience.world.map3D.map.children;
    this.currentIntersect = null;
    this.raycaster = new THREE.Raycaster();
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.objectsToTest,
      true
    );

    const div = document.getElementById("three_tooltip");
    if (div) {
      if (!intersects.length) {
        div.style.display = "none";
      } else {
        div.style.display = "block";
        div.style.top = this.mouseOffset.y + "px";
        div.style.left = this.mouseOffset.x + 10 + "px";
      }
    }
    if (this.objectsToMap[1]) {
      const regionIntersects = this.raycaster.intersectObjects(
        this.objectsToMap[1].children,
        true
      );
      if (regionIntersects.length) {
        if (!this.currentIntersect) {
          console.log("mouse enter");
        }
        // 证明进入了region区域
        if (
          regionIntersects[0]?.object.type === "Mesh" &&
          regionIntersects[0]?.object.name !== "text"
        ) {
          // 鼠标移动到了别的区块
          if (
            regionIntersects[0]?.object.uuid !==
            this.currentIntersect?.object.uuid
          ) {
            // 当前的区块
            console.log("before current intersect");
            this.currentIntersect?.object.scale.set(1, 1, 1);
            gsap.to(this.currentIntersect?.object.scale,{duration: 1, x:1,y:1,z:1})
            this.currentIntersect?.object.material[0].color.set('#0E2649')
            this.currentIntersect = regionIntersects[0];

            // 之后的区块
            console.log("after current intersect");
            // this.currentIntersect?.object.scale.set(1, 1, 2);
            gsap.to(this.currentIntersect?.object.scale,{duration: 1, x:1,y:1,z:2})
            this.currentIntersect?.object.material[0].color.set('#000000')

          }
        }
      } else {
        if (this.currentIntersect) {
          console.log("mouse leave");
          gsap.to(this.currentIntersect?.object.scale,{duration: 1, x:1,y:1,z:1})
        }
        this.currentIntersect = null;
      }
    }
  }
}
