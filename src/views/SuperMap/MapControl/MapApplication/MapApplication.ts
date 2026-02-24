import EventEmitter from '../../utils/EventEmitter'
import {MapControlOptions} from '../types'
import * as THREE from 'three'
import CameraManager from './CameraManager'
import SizeManager from './SizeManager'
import TimeManager from './TimeManager'
import Renderer from './Renderer'
import {geoMercator} from 'd3-geo'

// 默认配置
const defaultConfig = {
  // 地图中心点
  geoProjectionCenter: [0, 0] as [number, number],
  // 地图缩放比例
  geoProjectionScale: 120,
  // 地图平移
  geoProjectionTranslate: [0, 0] as [number, number],
  // 是否正交投影
  isOrthographic: false,
}

class MapApplication extends EventEmitter {
  container: HTMLCanvasElement
  canvas: HTMLCanvasElement
  scene: THREE.Scene
  camera: CameraManager
  render: Renderer
  sizes: SizeManager
  time: TimeManager
  config: {
    geoProjectionCenter: [number, number]
    geoProjectionScale: number
    geoProjectionTranslate: [number, number]
    isOrthographic: boolean
  }
  constructor(container: HTMLCanvasElement, options: MapControlOptions) {
    super()
    this.container = container
    this.config = Object.assign({}, defaultConfig, {
      geoProjectionCenter: options.centroid,
    })
    this.canvas = container
    this.scene = new THREE.Scene()
    this.sizes = new SizeManager({canvas: container})
    this.time = new TimeManager()
    this.camera = new CameraManager(
      {
        sizes: this.sizes,
        scene: this.scene,
        canvas: container,
      },
      {
        isOrthographic: this.config.isOrthographic,
      },
    )
    this.render = new Renderer({
      canvas: container,
      sizes: this.sizes,
      scene: this.scene,
      camera: this.camera,
    })
    this.sizes.on('resize', () => {
      this.resize()
    })
    this.time.on('tick', () => {
      this.update()
    })
  }

  // 地理投影
  geoProjection(coordinates: [number, number]) {
    const {geoProjectionCenter, geoProjectionScale, geoProjectionTranslate} =
      this.config
    return geoMercator()
      .center(geoProjectionCenter)
      .scale(geoProjectionScale)
      .translate(geoProjectionTranslate)(coordinates)
  }

  // 设置坐标轴
  setAxesHelper(size = 250) {
    if (!size) return false
    const axesHelper = new THREE.AxesHelper(size)
    this.scene.add(axesHelper)
  }

  resize() {
    this.camera.resize()
    this.render.resize()
  }

  update() {
    this.camera.update()
    this.render.update()
  }

  destroy() {
    this.sizes.destroy()
    this.time.destroy()
    this.camera.destroy()
    this.render.destroy()
    // 遍历场景并清理资源
    this.scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        for (const materialKey in object.material) {
          const material = object.material[materialKey]
          material &&
            typeof material.dispose == 'function' &&
            material.dispose()
        }
      }
    })
    this.container.parentNode?.removeChild(this.container)
  }
}
export default MapApplication
