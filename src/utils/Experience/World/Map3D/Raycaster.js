import * as THREE from 'three'
import Experience from '../../ThreeMap3D'


export default class Raycaster {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.mouse = this.experience.mousemove.mouse
        this.mouseOffset = this.experience.mousemove.eventOffset
        this.camera = this.experience.camera.instance
        this.objectsToTest = this.experience.world.sprite.spriteGroup.children
        this.raycaster = new THREE.Raycaster()
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest, true)
        const div = document.getElementById('three_tooltip')
        if (div) {
            if (!intersects.length) {
                div.style.display = 'none'
            } else {
                div.style.display = 'block';
                div.style.top = this.mouseOffset.y + 'px'
                div.style.left = this.mouseOffset.x + 10 + 'px'
            }
        }
    }
}
