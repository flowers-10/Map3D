import * as THREE from 'three'
import SizeManager from './SizeManager'
import CameraManager from './CameraManager'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'

interface RendererOptions {
  canvas: HTMLCanvasElement
  sizes: SizeManager
  scene: THREE.Scene
  camera: CameraManager
  postprocessing?: boolean
  composer?: EffectComposer
}

class Renderer {
  canvas: HTMLCanvasElement
  sizes: SizeManager
  scene: THREE.Scene
  camera: CameraManager
  instance?: THREE.WebGLRenderer
  postprocessing: boolean // 是否开启后处理
  composer: EffectComposer | undefined // 合成器
  constructor({
    canvas,
    sizes,
    scene,
    camera,
    postprocessing = false,
    composer = undefined,
  }: RendererOptions) {
    this.canvas = canvas
    this.sizes = sizes
    this.scene = scene
    this.camera = camera
    this.postprocessing = postprocessing
    this.composer = composer
    this.setInstance()
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      alpha: true, // 透明度
      antialias: true, // 抗锯齿
      canvas: this.canvas,
    })
    this.instance.setSize(this.sizes.width!, this.sizes.height!)
    this.instance.setPixelRatio(this.sizes.pixelRatio)
  }

  resize() {
    this.instance!.setSize(this.sizes.width!, this.sizes.height!)
    this.instance!.setPixelRatio(this.sizes.pixelRatio)
  }

  update() {
    this.postprocessing && this.composer
      ? this.composer.render()
      : this.instance?.render(this.scene, this.camera.instance!)
  }

  destroy() {
    this.instance?.dispose()
    this.instance?.forceContextLoss()
  }
}

export default Renderer
