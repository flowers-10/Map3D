import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '../../ThreeCity3D'


export default class Camera {
    constructor(config) {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.cameraConfig = config
        this.setInstance()
        this.setControls()
    }
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            this.cameraConfig.fov,
            this.sizes?.width / this.sizes?.height,
            this.cameraConfig.near,
            this.cameraConfig.far,
        )
        this.instance.position.set(this.cameraConfig.position.x, this.cameraConfig.position.y, this.cameraConfig.position.z)
        if (this.cameraConfig.lookAt) {
            this.instance.lookAt(this.scene.position)
        }
        this.scene.add(this.instance)
    }
    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }
    resize() {
        this.instance.aspect = this.sizes?.width / this.sizes?.height
        this.instance.updateProjectionMatrix()
    }
    update() {
        this.controls.update()
    }
    dispose() {
        this.controls.dispose()
    }
}
