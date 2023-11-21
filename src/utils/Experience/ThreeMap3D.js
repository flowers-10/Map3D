import * as THREE from 'three'

import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Mousemove from './Utils/Mousemove'
import Resources from './Utils/Resources.js'

import Light from './World/Map3D/Light'
import Camera from './World/Map3D/Camera.js'
import Renderer from './World/Map3D/Renderer'
import World from './World/Map3D/World'
import BloomPass from './World/Map3D/BloomPass'
import Raycaster from './World/Map3D/Raycaster'
import OutlineEffect from './World/Map3D/OutlineEffect'

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
        const { camreaConfig, rendererConfig, sources, passConfig, sizeConfig, lightConfig, worldConfig } = options
        // 初始化
        this.sizes = new Sizes(sizeConfig)
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.mousemove = new Mousemove()
        this.camera = new Camera(camreaConfig)
        this.light = new Light(lightConfig)
        this.renderer = new Renderer(rendererConfig)
        this.world = new World(worldConfig)
        this.passConfig = passConfig
        if (passConfig.type !== 'none') {
            this.bloomPass = new BloomPass(passConfig.bloomConfig)
            this.outlineEffect = new OutlineEffect(passConfig.outlineConfig)
        }
        this.raycaster = new Raycaster()
        this.sizes.on('resize', () => {
            this.resize()
        })
        this.time.on('tick', () => {
            this.update()
        })
    }
    resize() {
        this.camera?.resize()
        this.renderer?.resize()
    }
    update() {
        this.camera?.update()
        this.world?.update()
        this.raycaster.update()
        switch (this.passConfig.type) {
            case 'outline':
                this.outlineEffect?.update()
                break
            case 'bloom':
                this.bloomPass?.update()
                break
            case 'none':
                this.renderer?.update()
                break
            default:
                this.renderer?.update()
                break
        }
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
