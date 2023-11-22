import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from '../../ThreeMap3D'
import * as dat from "lil-gui";

export default class Camera {
    constructor(config) {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.gui = this.experience.gui
        this.cameraConfig = config
        this.setInstance()
        config.controls.show ? this.setControls() : null
    }
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            this.cameraConfig.fov,
            this.sizes?.width / this.sizes?.height,
            this.cameraConfig.near,
            this.cameraConfig.far,
        )
        this.instance.position.set(this.cameraConfig.position.x, this.cameraConfig.position.y, this.cameraConfig.position.z)
        this.gui
        .add(this.instance.position, "x")
        .min(-5)
        .max(5)
        .step(0.1)
        .name("Cx");
        this.gui
        .add(this.instance.position, "y")
        .min(-5)
        .max(5)
        .step(0.1)
        .name("Cy");
        this.gui
        .add(this.instance.position, "z")
        .min(-2)
        .max(2)
        .step(0.02)
        .name("Cz");
        if (this.cameraConfig.lookAt) {
            this.instance.lookAt(this.scene.position)
        }
        this.scene.add(this.instance)
    }
    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        const config = this.cameraConfig.controls
        this.controls.enableDamping = config.enableDamping
        // 设置旋转角度限制
        this.controls.minPolarAngle = config.minPolarAngle // 最小极角为45度
        this.controls.maxPolarAngle = config.maxPolarAngle // 最大极角为135度
        this.controls.minAzimuthAngle = config.minAzimuthAngle // 最小方位角为-45度
        this.controls.maxAzimuthAngle = config.maxAzimuthAngle // 最大方位角为45度
        this.controls.enablePan = config.enablePan
    }
    resize() {
        this.instance.aspect = this.sizes?.width / this.sizes?.height
        this.instance.updateProjectionMatrix()
    }
    update() {
        this.controls?.update()
    }
    dispose() {
        this.controls?.dispose()
    }
}
