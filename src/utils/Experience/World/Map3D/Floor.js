import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Floor {
    constructor() {
        this.experience = new Experience()

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x031837,
            metalness: 0,
            roughness: 1,
            opacity: 0.5,
            transparent: true,
        })
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 1, 1), groundMaterial)
        ground.position.z = 0
        ground.receiveShadow = true

        this.experience.scene.add(ground)
    }
}
