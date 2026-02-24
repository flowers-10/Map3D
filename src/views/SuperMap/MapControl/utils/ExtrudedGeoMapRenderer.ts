import * as THREE from 'three'
import * as d3 from 'd3'
import {LoadAssets} from './infoData'
import TimeManager from '../MapApplication/TimeManager'
import {normalizeGeoJSON} from './base'
import {FeatureCollection} from '../types'

type ExtrudedGeoMapRendererConfig = {
  position: THREE.Vector3
  center: [number, number]
  data: string
  renderOrder: number
  topFaceMaterial: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial
  sideMaterial: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial
  depth: number
}
/**
 * 带有挤压效果的地图渲染器
 * 将GeoJSON数据渲染为具有高度和材质的3D地图
 * 支持顶面和侧面使用不同材质
 */
export class ExtrudedGeoMapRenderer {
  mapGroup: THREE.Group<THREE.Object3DEventMap>
  config: ExtrudedGeoMapRendererConfig
  /** 资源管理器 */
  assets: LoadAssets
  /** 时间管理器 */
  time: TimeManager
  constructor(
    {assets, time}: {assets: LoadAssets; time: TimeManager},
    config: ExtrudedGeoMapRendererConfig,
  ) {
    this.mapGroup = new THREE.Group()
    this.config = {
      ...{
        position: new THREE.Vector3(0, 0, 0),
        center: [0, 0],
        data: '',
        renderOrder: 1,
        topFaceMaterial: new THREE.MeshLambertMaterial({
          color: 0x18263b,
          transparent: true,
          opacity: 1,
        }),
        sideMaterial: new THREE.MeshLambertMaterial({
          color: 0x7152b,
          transparent: true,
          opacity: 1,
        }),
        depth: 0,
      },
      ...config,
    }
    this.assets = assets
    this.time = time

    this.mapGroup.position.copy(this.config.position)

    const geoData = normalizeGeoJSON(this.config.data)
    this.create(geoData)
  }
  /**
   * 创建地图
   * 根据GeoJSON数据生成Three.js中的几何体
   * @param {object} geoData - 标准化后的GeoJSON数据
   */
  create(geoData: FeatureCollection) {
    geoData.features.forEach(feature => {
      // 为每个特征创建一个对象
      const featureObject = new THREE.Object3D()

      // 挤压几何体配置
      const extrudeSettings = {
        depth: this.config.depth,
        bevelEnabled: true,
        bevelSegments: 1,
        bevelThickness: 0.1,
      }

      feature.geometry.coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          // 创建形状
          const shape = new THREE.Shape()

          for (let i = 0; i < ring.length; i++) {
            if (!ring[i][0] || !ring[i][1]) return false
            const [x, y] = this.geoProjection(ring[i])
            i === 0 ? shape.moveTo(x, -y) : shape.lineTo(x, -y)
          }

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
          const mesh = new THREE.Mesh(geometry, [
            this.config.topFaceMaterial,
            this.config.sideMaterial,
          ])
          featureObject.add(mesh)
        })
      })

      this.mapGroup.add(featureObject)
    })
  }
  /**
   * 地理坐标投影转换
   * 将地理坐标转换为平面坐标用于渲染
   * @param {[number, number]} coords - 地理坐标
   * @returns {[number, number] | undefined} 投影后的平面坐标
   */
  geoProjection(coords: [number, number]) {
    return d3
      .geoMercator()
      .center(this.config.center as unknown as [number, number])
      .scale(120)
      .translate([0, 0])(coords) as [number, number]
  }
  setParent(parent: THREE.Group) {
    parent.add(this.mapGroup)
  }
}

export default ExtrudedGeoMapRenderer
