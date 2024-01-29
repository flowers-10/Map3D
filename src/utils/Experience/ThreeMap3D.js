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

/**
 * @constructor 
 * @param { HTMLCanvasElement } canvas
 * @param { * } options
 * @param { Sizes } sizes
 * @param { Time } time
 * @param { Scene } scene
 * @param { Resources } resources
 * @param { Mousemove } mousemove
 * @param { Camera } camera
 * @param { Light } light
 * @param { Renderer } renderer
 * @param { World } world
 * @param { OutlineEffect } outlineEffect
 * @param { BloomPass } bloomPass
 * @param { Raycaster } raycaster

 */
export default class Experience {
  constructor(canvas, options, sourceData = null) {
    //  Singleton
    if (instance) {
      return instance
    }
    instance = this
    // Global access
    window.experience = this

    // 选项
    this.canvas = canvas
    if (!options) return
    const { cameraConfig, rendererConfig, sources, passConfig, sizeConfig, lightConfig, worldConfig } = options
    // 初始化
    this.sizes = new Sizes(sizeConfig) // 尺寸
    this.time = new Time() // 动画相关
    this.scene = new THREE.Scene() // 场景
    this.resources = new Resources(sources) // 资源管理
    this.mousemove = new Mousemove() // 鼠标移动
    this.camera = new Camera(cameraConfig) // 相机
    this.light = new Light(lightConfig) // 灯光
    this.renderer = new Renderer(rendererConfig) // 渲染器
    this.world = new World(worldConfig, sourceData) // 世界
    this.passConfig = passConfig // 后处理配置项
    // 后处理
    switch (passConfig.type) {
      case 'outline':
        this.outlineEffect = new OutlineEffect(passConfig.outlineConfig) // 边框高亮效果
        break
      case 'bloom':
        this.bloomPass = new BloomPass(passConfig.bloomConfig) // 辉光效果
        break
      case 'none':
        break
      default:
        break
    }
    this.raycaster = new Raycaster(worldConfig.tooltipConfig) // 射线检测
    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
  }

  // 浏览器尺寸变化时触发
  resize() {
    this.camera?.resize()
    this.renderer?.resize()
  }
  // 每一帧触发一次
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
  // 清空Group释放内存
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
  // 卸载所有占用内存的实例
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
