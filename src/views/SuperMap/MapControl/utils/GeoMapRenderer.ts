import * as THREE from 'three'
import {normalizeGeoJSON} from './base'
import {FeatureCollection} from '../types'
import * as d3 from 'd3'
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * GeoMapRenderer配置选项接口
 */
interface GeoMapRendererOptions {
  /** GeoJSON格式的地理数据字符串 */
  data: string
  /** 地图投影中心点 */
  center: [number, number]
  /** 地图组在场景中的位置 */
  position: THREE.Vector3
  /** 地图渲染材质 */
  material: THREE.Material
  /** 渲染顺序，较高的值会晚于较低的值绘制 */
  renderOrder: number
  /** 是否合并几何体进行渲染，合并后性能更好但无法单独操作各区域 */
  merge: boolean
}

/**
 * 地理坐标结构接口
 */
interface GeoCoordinate {
  /** 区域名称 */
  name: string
  /** 区域中心点坐标 [经度, 纬度] */
  center: number[]
  /** 区域质心坐标 [经度, 纬度] */
  centroid: number[]
}

/**
 * 地理地图渲染器
 * 负责将GeoJSON地理数据渲染为Three.js中的3D地图
 * 支持地图的合并渲染和独立渲染两种模式
 */
class GeoMapRenderer {
  /** 包含所有地图元素的容器组 */
  mapGroup: THREE.Group
  /** 渲染器配置 */
  config: GeoMapRendererOptions
  /** 存储所有区域的坐标信息 */
  coordinates: GeoCoordinate[] = []

  /**
   * 构造函数
   * @param {Partial<GeoMapRendererOptions>} config 渲染器配置参数
   */
  constructor(config: Partial<GeoMapRendererOptions>) {
    // 创建地图组容器
    this.mapGroup = new THREE.Group()

    // 合并默认配置和用户配置
    this.config = {
      // 默认配置
      data: '',
      center: [0, 0] as [number, number],
      position: new THREE.Vector3(0, 0, 0),
      material: new THREE.MeshBasicMaterial({
        color: 0x18263b, // 深蓝色
        transparent: true,
        opacity: 1,
      }),
      merge: false,
      renderOrder: 0,
      // 用户配置覆盖默认配置
      ...config,
    }

    // 设置地图组位置
    this.mapGroup.position.copy(this.config.position)

    // 标准化GeoJSON数据
    const geoData = normalizeGeoJSON(this.config.data)

    // 创建地图
    this.create(geoData)
  }

  /**
   * 创建地图
   * 根据GeoJSON数据生成Three.js中的几何体和网格
   * @param {FeatureCollection} geoData 标准化后的GeoJSON数据
   */
  create(geoData: FeatureCollection) {
    const {merge} = this.config
    // 如果需要合并几何体，则存储所有几何体用于后续合并
    const geometries: THREE.BufferGeometry[] = []

    // 遍历每个地理特征（如省份、城市等）
    geoData.features.forEach(feature => {
      // 为每个特征创建一个3D对象
      const featureObject = new THREE.Object3D()

      // 提取特征属性
      const {name, center, centroid} = feature.properties

      // 设置特征对象的元数据
      featureObject.userData.name = name
      featureObject.userData.center = center
      featureObject.userData.centroid = centroid

      // 存储坐标信息
      this.coordinates.push({name, center, centroid})

      // 处理特征的几何坐标
      feature.geometry.coordinates.forEach(polygon => {
        polygon.forEach(ring => {
          // 为每个环创建一个Shape
          const shape = new THREE.Shape()

          // 遍历环上的每个点
          ring.forEach((point, index) => {
            if (!point[0] || !point[1]) return false

            // 投影地理坐标到平面坐标
            const [x, y] = this.geoProjection(point)!

            // 第一个点使用moveTo，其余点使用lineTo
            if (index === 0) {
              shape.moveTo(x, -y)
            } else {
              shape.lineTo(x, -y)
            }
          })

          // 从Shape创建几何体
          const geometry = new THREE.ShapeGeometry(shape)
          geometry.name = 'mapShape'

          // 根据是否需要合并采用不同的处理方式
          if (merge) {
            // 如果需要合并，先收集所有几何体
            geometries.push(geometry)
          } else {
            // 如果不需要合并，创建独立的网格并添加到特征对象
            const mesh = new THREE.Mesh(geometry, this.config.material)
            mesh.renderOrder = this.config.renderOrder
            featureObject.add(mesh)
          }
        })
      })

      // 如果不需要合并，将特征对象添加到地图组
      if (!merge) {
        this.mapGroup.add(featureObject)
      }
    })

    // 如果需要合并几何体
    if (merge && geometries.length > 0) {
      // 合并所有几何体
      const mergedGeometry = mergeGeometries(geometries)
      // 创建合并后的网格
      const mergedMesh = new THREE.Mesh(mergedGeometry, this.config.material)
      mergedMesh.renderOrder = this.config.renderOrder
      // 添加到地图组
      this.mapGroup.add(mergedMesh)
    }
  }

  /**
   * 地理坐标投影转换
   * 将地理坐标(经纬度)转换为平面坐标用于渲染
   * @param {[number, number]} coords 地理坐标 [经度, 纬度]
   * @returns {[number, number]} 投影后的平面坐标 [x, y]
   */
  geoProjection(coords: [number, number]): [number, number] {
    return d3
      .geoMercator() // 使用墨卡托投影
      .center(this.config.center) // 设置投影中心
      .scale(120) // 设置投影比例
      .translate([0, 0])(coords) as [number, number] // 应用投影并转换坐标
  }

  /**
   * 设置父级容器
   * 将地图组添加到指定的父级组
   * @param {THREE.Group} parent 父级Three.js组
   */
  setParent(parent: THREE.Group) {
    parent.add(this.mapGroup)
  }
}

export default GeoMapRenderer
