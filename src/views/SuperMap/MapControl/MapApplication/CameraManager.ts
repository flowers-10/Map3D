import * as THREE from 'three'
import SizeManager from './SizeManager'
import {CameraManagerInstance} from '../types'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

interface CameraManagerOptions {
  sizes: SizeManager
  scene: THREE.Scene
  canvas: HTMLCanvasElement
}

/**
 * 相机管理类
 */
class CameraManager {
  instance: CameraManagerInstance | null = null
  sizes: SizeManager
  scene: THREE.Scene
  canvas: HTMLCanvasElement
  options: {isOrthographic: boolean} & {isOrthographic: boolean}
  controls?: OrbitControls
  wWidth: number = 0
  wHeight: number = 0
  constructor(
    {sizes, scene, canvas}: CameraManagerOptions,
    options: {isOrthographic: boolean} = {isOrthographic: false},
  ) {
    this.sizes = sizes
    this.scene = scene
    this.canvas = canvas
    this.options = Object.assign({isOrthographic: false}, options)
    this.setInstance()
  }
  // 监听键盘事件切换相机模式
  addEvent() {
    if (this.instance) {
      document.addEventListener('keydown', event => {
        const currentPosition = new THREE.Vector3().copy(
          this.instance!.position,
        )
        switch (event.key) {
          case 'o': // O键 - 正交相机
          case 'O':
            this.setCamera()
            this.instance!.position.copy(currentPosition)
            this.instance!.updateProjectionMatrix()
            break
          case 'p': // P键 - 透视相机
          case 'P':
            this.setCamera(false)
            this.instance!.position.copy(currentPosition)
            this.instance!.updateProjectionMatrix()
            break
        }
      })
    }
  }
  // 设置相机实例
  setInstance() {
    this.instance = null
    this.setCamera(this.options.isOrthographic)
    const instance = this.instance as CameraManagerInstance
    if (instance) {
      instance.position.set(10, 10, 10)
      this.scene.add(instance)
    }
  }
  setCamera(useOrthographic = true) {
    const aspectRatio = this.sizes.width / this.sizes.height
    if (useOrthographic) {
      const frustumSize = 120 // 视图大小
      this.instance = new THREE.OrthographicCamera(
        -frustumSize * aspectRatio,
        frustumSize * aspectRatio,
        frustumSize,
        -frustumSize,
        1,
        10000,
      )
    } else {
      this.instance = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000)
    }
    this.setControls()
    this.getCameraViewSize()
  }
  // 获取相机视图大小
  getCameraViewSize() {
    if (this.instance instanceof THREE.PerspectiveCamera) {
      const fovRad = (this.instance.fov * Math.PI) / 180
      const height = 2 * Math.tan(fovRad / 2) * this.instance.position.z
      const width = height * this.instance.aspect
      this.wWidth = width
      this.wHeight = height
    } else {
      this.wWidth = this.instance!.top - this.instance!.bottom
      this.wHeight = this.instance!.right - this.instance!.left
    }
    return [this.wWidth, this.wHeight]
  }
  // 相机控制器
  setControls() {
    this.controls = new OrbitControls(this.instance!, this.canvas)
    // 启用阻尼 可用于给控件给人以一种重量感
    this.controls.enableDamping = true
    this.controls.update()
  }
  // 调整相机尺寸
  resize() {
    if (this.instance) {
      const aspectRatio = this.sizes.width / this.sizes.height
      // 正交相机
      if (this.instance instanceof THREE.OrthographicCamera) {
        const frustumSize = 120
        this.instance.left = -frustumSize * aspectRatio
        this.instance.right = frustumSize * aspectRatio
        this.instance.top = frustumSize
        this.instance.bottom = -frustumSize
      } else {
        this.instance.aspect = aspectRatio
      }
      this.instance.updateProjectionMatrix()
    }
  }
  // 更新相机控制器
  update() {
    if (this.controls) {
      this.controls.update()
    }
  }
  // 销毁
  destroy() {
    this.instance = null
    this.controls = undefined
    this.controls!.dispose()
  }
}

export default CameraManager
