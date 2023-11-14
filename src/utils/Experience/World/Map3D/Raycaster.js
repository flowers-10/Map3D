import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.mouse = this.experience.mousemove.mouse
        this.camera = this.experience.camera.instance
        this.objectsToTest = this.experience.world.sprite.spriteGroup.children
        this.raycaster = new THREE.Raycaster()
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest, true)
        console.log(intersects);

        if (!intersects.length) {
        }else {
            
        }
        // for (const intersect of intersects) {
        //     if (intersect.object instanceof THREE.Mesh) {
        //         if (intersect.object.parent) {
        //             if (intersect.object.parent.properties) {
        //                 //   provinceInfo.style.display = "flex";
        //                 //   provinceInfo.innerHTML = intersect.object.parent.properties?.name;
        //             }
        //         }
        //     }
        // }
        // for (const object of this.objectsToTest) {
        //     if (!intersects.find((intersect) => intersect.object === object)) {
        //         // object.material.color.set('#ff0000')
        //         // console.log(object);
        //     }
        // }
    }
}
