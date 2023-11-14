import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import Experience from '../../ThreeMap3D'

export default class OutlineEffect {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.renderer = this.experience.renderer.instance
        this.createPass()
    }
    createPass() {
        
        // add after defining renderer
        this.composer = new EffectComposer(this.renderer)

        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)

        const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera)
        this.composer.addPass(outlinePass)
        outlinePass.visibleEdgeColor = new THREE.Color(0xA0E5FF) // 设置颜色
        outlinePass.edgeStrength = 3 //边缘强度
        outlinePass.edgeGlow = 1 //缓缓接近
        outlinePass.edgeThickness = 2 //边缘厚度
        outlinePass.pulsePeriod = 0 //脉冲周期
        outlinePass.selectedObjects = [this.experience.world.map3D.map];
       

        /* 伽马矫正 */
        const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
        this.composer.addPass(gammaCorrectionPass)

        const effectFXAA = new ShaderPass(FXAAShader)
        effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
        this.composer.addPass(effectFXAA)
    }

    update() {
        this.composer.render()
    }
}
