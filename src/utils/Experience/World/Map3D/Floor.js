import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Floor {
    constructor(config) {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.floorGroup = new THREE.Group()
        this.resources.on('ready', () => {
            this.initFloor(config)
        })
    }
    initFloor(config) {
        // const texture1 = this.resources.items.border1Texture
        // const texture2 = this.resources.items.border2Texture
        // const texture3 = this.resources.items.border2Texture
        // const groundMaterial1 = new THREE.MeshBasicMaterial({
        //     map: texture1,
        //     color: '#fff',
        //     metalness: 0,
        //     roughness: 1,
        //     opacity: 1,
        //     transparent: true,
        // })
        // const groundMaterial2 = new THREE.MeshBasicMaterial({
        //     map: texture2,
        //     color: '#fff',
        //     metalness: 0,
        //     roughness: 1,
        //     opacity: 1,
        //     transparent: true,
        // })
        config.series.forEach((item, index) => {
            if (item.show) {
                const map = this.resources.items[item.map]
                const material = new THREE.MeshBasicMaterial({
                    map,
                    color: '#fff',
                    transparent: true,
                })
                material.opacity = item.opacity
                const ground = new THREE.Mesh(new THREE.PlaneGeometry(item.size, item.size, 1, 1), material)
                ground.position.z = +item.depth - index * 0.01
                ground.size = item.size
                ground.speed = item.speed
                ground.mapName = item.map
                this.floorGroup.add(ground)
            }
        })
        this.experience.scene.add(this.floorGroup)
    }
    update() {
        const group = this.floorGroup.children || []
        if (group) {
            group.forEach((item) => {
                if (item.mapName === 'focusMoveBgTexture') {
                    const scale = (this.time.elapsedTime % (item.size * 2)) * item.speed
                    item.scale.set(scale, scale, scale)
                } else {
                    item.rotation.z = -this.time.elapsedTime * item.speed
                }
            })
        }
    }
}
