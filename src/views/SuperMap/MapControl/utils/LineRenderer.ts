import * as THREE from 'three'
import * as d3 from 'd3'
import {normalizeGeoJSON} from './base'
import {FeatureCollection} from '../types'
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js'
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js'
import {Line2} from 'three/addons/lines/Line2.js'

interface LineRendererOptions {
  center: [number, number]
  data: string
  material: THREE.LineBasicMaterial
  renderOrder: number
  type?: 'LineLoop' | 'Line' // 线类型 LineLoop:闭合线  Loop:非闭合线
}

class LineRenderer {
  lineGroup: THREE.Group
  options: LineRendererOptions
  constructor(options: LineRendererOptions) {
    this.options = {
      ...{
        center: [0, 0],
        data: '',
        material: new THREE.LineBasicMaterial({color: 0xffffff}),
        renderOrder: 1,
        type: 'LineLoop',
      },
      ...options,
    }
    const geoData = normalizeGeoJSON(this.options.data)
    const lineGroup = this.create(geoData)
    this.lineGroup = lineGroup
  }
  create(geoData: FeatureCollection) {
    const {type} = this.options
    const lineGroup = new THREE.Group()
    lineGroup.renderOrder = this.options.renderOrder

    geoData.features.forEach(feature => {
      feature.geometry.coordinates.forEach(polygon => {
        const points: THREE.Vector3[] = []
        let line: THREE.LineLoop | Line2 | null = null
        if (type === 'LineLoop') {
          polygon[0].forEach(coordPair => {
            const projCoords = this.geoProjection(coordPair)
            if (projCoords) {
              const [x, y] = projCoords
              points.push(new THREE.Vector3(x, -y, 0))
            }
          })
          if (points.length > 0) {
            line = this.createLineLoop(points)
          }
        } else {
          // 使用Line2渲染（需要平坦数组格式）
          const positions: number[] = []
          polygon[0].forEach((coordPair, i) => {
            const projCoords = this.geoProjection(coordPair)
            if (projCoords) {
              if (i === 0) {
                console.log(
                  '🚀 ~ LineRenderer ~ create ~ projCoords:',
                  projCoords,
                )
              }
              const [x, y] = projCoords
              positions.push(x, -y, 0)
            }
          })
          if (positions.length > 0) {
            line = this.createLine2(positions)
          }
        }
        if (line) {
          lineGroup.add(line)
        }
      })
    })
    return lineGroup
  }
  /**
   * 创建标准LineLoop类型的线条
   * @param {THREE.Vector3[]} points - 三维点数组
   * @returns {THREE.LineLoop} LineLoop类型的线条对象
   */
  createLineLoop(points: THREE.Vector3[]) {
    const {material, renderOrder} = this.options
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints(points)
    const line = new THREE.LineLoop(geometry, material)
    line.renderOrder = renderOrder
    line.name = 'mapLine'
    return line
  }
  /**
   * 创建Line2类型的线条
   * 适用于需要更细致线宽控制的场景
   * @param {number[]} positions - 位置数组（平坦格式：[x1,y1,z1,x2,y2,z2,...]）
   * @returns {Line2} Line2类型的线条对象
   */
  createLine2(positions: number[]): Line2 {
    const {material, renderOrder} = this.options
    const geometry = new LineGeometry()
    geometry.setPositions(positions)
    const line = new Line2(geometry, material as unknown as LineMaterial)
    line.name = 'mapLine2'
    line.renderOrder = renderOrder
    line.computeLineDistances()
    return line
  }
  /**
   * 地理坐标投影转换
   * 将地理坐标转换为平面坐标用于渲染
   * @param {number[]} coords - 地理坐标
   * @returns {[number, number] | undefined} 投影后的平面坐标
   */
  geoProjection(coords: [number, number]): [number, number] {
    return d3
      .geoMercator()
      .center(this.options.center)
      .scale(120)
      .translate([0, 0])(coords) as [number, number]
  }
  setParent(parent: THREE.Group) {
    parent.add(this.lineGroup)
  }
}

export default LineRenderer
