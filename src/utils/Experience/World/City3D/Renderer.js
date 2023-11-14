import * as THREE from 'three'
import Experience from '../../ThreeCity3D'

export default class Renderer {
    constructor(renderderConfig) {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.renderderConfig = renderderConfig
        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        })
        this.instance.useLegacyLights = true
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderderConfig.clearAlpha ? this.instance.setClearAlpha(this.renderderConfig.clearAlpha) : this.instance.setClearAlpha(0)
        // this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    resize() {
        this.instance.setSize(this.sizes?.width, this.sizes.height)
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update() {
        this.instance.render(this.scene, this.camera?.instance)
    }

    info(message = '当前内存：') {
        console.log(message, this.instance.info.memory)
    }

    dispose() {
        this.instance.clear()
        this.instance.setSize(0, 0)
        this.instance.dispose()
        this.info('清空内存后：')
    }
}
