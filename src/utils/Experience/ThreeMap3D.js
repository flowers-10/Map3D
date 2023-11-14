import * as THREE from 'three'

import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Mousemove from './Utils/Mousemove'
import Resources from './Utils/Resources.js'

import sources from './World/Map3D/sources'
import Light from './World/Map3D/Light'
import Camera from './World/Map3D/Camera.js'
import Renderer from './World/Map3D/Renderer'
import World from './World/Map3D/World'
import BloomPass from './World/Map3D/BloomPass'
import Raycaster from './World/Map3D/Raycaster'
import OutlineEffect from './World/Map3D/OutlineEffect'
import Css2DRenderer from './World/Map3D/css2DRenderer.js'

let instance = null

export default class Experience {
    constructor(canvas, options) {
        //  Singleton
        if (instance) {
            return instance
        }
        instance = this
        // Global access
        window.experience = this

        // 选项
        this.canvas = canvas
        const { camera, renderer } = options
        // 初始化
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.mousemove = new Mousemove()
        this.camera = new Camera(camera)
        this.light = new Light()
        this.renderer = new Renderer(renderer)
        this.css2DRenderer = new Css2DRenderer()
        this.world = new World()
        // this.bloomPass = new BloomPass()
        this.outlineEffect = new OutlineEffect()
        this.raycaster = new Raycaster()
        this.sizes.on('resize', () => {
            this.resize()
        })
        this.time.on('tick', () => {
            this.update()
        })
        this.mousemove.on('mousemove', () => {
            this.mouse()
        })
    }
    resize() {
        this.camera?.resize()
        this.renderer?.resize()
        this.css2DRenderer.resize()
    }
    update() {
        this.camera?.update()
        this.world?.update()
        // this.raycaster.update()
        // this.bloomPass?.update()
        this.outlineEffect?.update()
        // this.renderer?.update()
        this.css2DRenderer.update()
    }
    mouse() {
        // tooltip移动
    }

    clearGroup(group) {
        if (!group.children.length) return
        // 释放 几何体 和 材质
        const clearCache = (item) => {
            item.geometry?.dispose()
        }
        // 递归释放物体下的 几何体 和 材质
        const removeObj = (obj) => {
            let arr = obj.children.filter((x) => x)
            arr.forEach((item) => {
                if (item.children.length) {
                    removeObj(item)
                } else {
                    clearCache(item)
                    item.clear()
                }
            })
            obj.clear()
            arr = null
        }

        // 移除 group
        removeObj(group)
    }
    dispose() {
        // 取消订阅
        this.sizes?.off('resize')
        this.sizes?.release()
        this.time?.off('tick')
        this.time?.release()
        this.mousemove?.off('mousemove')
        this.mousemove?.release()
        /* 销毁场景里的几何体 材质等 */
        this.scene?.traverse((child) => {
            child.geometry?.dispose()
            if (child instanceof THREE.Group || child instanceof THREE.Object3D) {
                this.clearGroup(child)
            }
        })
        this.scene?.clear()
        this.renderer?.dispose()
        this.camera?.dispose()
        // 销毁实例
        this.sizes = null
        this.time = null
        this.scene = null
        this.resources = null
        this.mousemove = null
        this.camera = null
        this.light = null
        this.renderer = null
        instance = null
        window.experience = null
    }
}
