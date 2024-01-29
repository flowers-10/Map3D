import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import Experience from '../../ThreeMap3D'

export default class OutlineEffect {
    constructor(config) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.renderer = this.experience.renderer.instance
        this.createPass(config)
    }
    // 创建高亮边框后处理器
    async createPass(config) {
        // 抗锯齿配置(注意samples越大，性能越差)
        const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
            samples: this.renderer.getPixelRatio() === 1 && config.antiAliasing ? 2 : 0,
        })
        // add after defining renderer
        this.composer = new EffectComposer(this.renderer, renderTarget)

        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)
        // 创建后处理通道
        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera)
        // 添加后处理通道
        this.composer.addPass(outlinePass)
        // 后处理配置
        outlinePass.visibleEdgeColor = new THREE.Color(0xa0e5ff) // 设置颜色
        outlinePass.edgeStrength = config.edgeStrength //边缘强度
        outlinePass.edgeGlow = config.edgeGlow //缓缓接近
        outlinePass.edgeThickness = config.edgeThickness //边缘厚度
        outlinePass.pulsePeriod = config.pulsePeriod //脉冲周期
        await this.experience.world.map3D.getProjection()
        const map = this.experience.world.map3D.map.children
        const arr = []
        map[map.length >= config.showIndex ? config.showIndex : 0].children.forEach((item) => {
            if (item.children) {
                item.children.forEach((itemX) => {
                    if (itemX.name === 'region') {
                        arr.push(itemX.children[0])
                    }
                })
                
            }
        })
        outlinePass.selectedObjects = arr
        /* 伽马矫正 */
        if (config.gamma) {
            const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
            this.composer.addPass(gammaCorrectionPass)
            console.log('Using gamma')
        }

        /* 抗锯齿 */
        if (config.antiAliasing && this.renderer.getPixelRatio() === 1 && !this.renderer.capabilities.isWebGL2) {
            const effectFXAA = new ShaderPass(FXAAShader)
            effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
            this.composer.addPass(effectFXAA)
            console.log('Using FXAA')
        }
    }

    update() {
        this.composer.setSize(this.sizes?.width, this.sizes.height)
        this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
        this.composer.render()
    }
}
