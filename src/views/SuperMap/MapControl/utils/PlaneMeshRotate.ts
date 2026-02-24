import TimeManager from '../MapApplication/TimeManager'
import * as THREE from 'three'

interface PlaneMeshOptions {
  name: string
  scale: number
  width: number
  position: THREE.Vector3
  needRotate: boolean
  rotateSpeed: number
  material: THREE.MeshBasicMaterial
}

/**
 * 平面网格对象类
 * 用于创建可旋转的平面网格，通常用作地图或效果的基础元素
 */
class PlaneMeshRotate {
  time: TimeManager
  /** 平面网格配置选项 */
  options: PlaneMeshOptions
  /** Three.js网格实例 */
  instance: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  constructor({time}: {time: TimeManager}, option: Partial<PlaneMeshOptions>) {
    this.time = time
    this.options = Object.assign(
      {
        width: 10,
        scale: 1,
        position: new THREE.Vector3(0, 0, 0),
        needRotate: false,
        rotateSpeed: 0.001,
        material: new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 1,
          depthTest: true,
        }),
      },
      option,
    ) as PlaneMeshOptions
    // 创建平面几何体
    const geometry = new THREE.PlaneGeometry(
      this.options.width,
      this.options.width,
    )
    // 创建网格对象
    const mesh = new THREE.Mesh(geometry, this.options.material)
    mesh.name = this.options.name
    // 绕X轴旋转90度（平放）
    mesh.rotateX(-Math.PI / 2)
    mesh.position.copy(this.options.position)
    mesh.scale.set(this.options.scale, this.options.scale, this.options.scale)

    this.instance = mesh
  }
  setParent(parent: THREE.Object3D) {
    parent.add(this.instance)
    this.time.on('tick', () => {
      this.instance.rotateZ(this.options.rotateSpeed)
    })
  }
}

export default PlaneMeshRotate
