import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Light {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.setLight()
    }

    setLight() {
        const pointLight = new THREE.PointLight(0xffffff, 5)
        pointLight.position.set(0, -2, 1)
        this.scene.add(pointLight)
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
        this.scene.add(pointLightHelper)
        let ambientLight = new THREE.AmbientLight(0xffffff, 1) // 环境光
        this.scene.add(ambientLight)
    }
}
