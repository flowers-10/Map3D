import * as THREE from 'three'
import TimeManager from '../MapApplication/TimeManager'

/**
 * 粒子系统类
 * 用于创建和管理三维空间中的粒子效果
 */
class Particles {
  /** 粒子实例 */
  instance: THREE.Points | null
  /** 时间管理器 */
  time: TimeManager
  /** 是否启用粒子更新 */
  enable: boolean
  /** 粒子系统配置参数 */
  config: {
    /** 粒子数量 */
    num: number
    /** 粒子范围大小 */
    range: number
    /** 粒子移动速度 */
    speed: number
    /** 渲染顺序 */
    renderOrder: number
    /** 移动方向 */
    dir: string
    /** 粒子材质 */
    material: THREE.PointsMaterial
  }
  /**
   * 构造函数
   * @param {Object} params - 参数对象
   * @param {TimeManager} params.time - 时间管理器实例
   * @param {Object} configOverrides - 覆盖默认配置的对象
   */
  constructor({time}: {time: TimeManager}, configOverrides = {}) {
    this.instance = null
    this.time = time
    this.enable = true
    this.config = Object.assign(
      {
        num: 100,
        range: 500,
        speed: 0.01,
        renderOrder: 99,
        dir: 'up',
        material: new THREE.PointsMaterial({
          map: Particles.createTexture(),
          size: 20,
          color: 16777215,
          transparent: true,
          opacity: 1,
          depthTest: false,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        }),
      },
      configOverrides,
    )
    this.create()
  }

  /**
   * 创建粒子系统
   */
  create() {
    const {range, dir, material, num, renderOrder} = this.config

    const positions = []
    const colors = []
    const velocities = []

    // 生成粒子属性数据
    for (let i = 0; i < num; i++) {
      // 随机位置
      positions.push(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
      )

      // 方向因子
      const directionFactor = dir === 'up' ? 1 : -1

      // 随机速度
      velocities.push(
        Math.random() * directionFactor,
        (0.1 + Math.random()) * directionFactor,
        0.1 + Math.random() * directionFactor,
      )

      // 随机颜色
      const particleColor = material.color.clone()
      const hslColor = {h: 0, s: 0, l: 0}
      particleColor.getHSL(hslColor)
      particleColor.setHSL(hslColor.h, hslColor.s, hslColor.l * Math.random())
      colors.push(particleColor.r, particleColor.g, particleColor.b)
    }

    // 创建几何体
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3),
    )
    geometry.setAttribute(
      'velocities',
      new THREE.BufferAttribute(new Float32Array(velocities), 3),
    )
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(colors), 3),
    )

    // 创建粒子实例
    this.instance = new THREE.Points(geometry, material)
    this.instance.renderOrder = renderOrder
  }

  /**
   * 创建粒子纹理
   * @returns {THREE.CanvasTexture} 创建的粒子纹理
   */
  static createTexture() {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 1024
    const context = canvas.getContext('2d')
    if (!context) return null

    // 创建径向渐变
    const gradient = context.createRadialGradient(512, 512, 0, 512, 512, 512)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')

    context.fillStyle = gradient
    context.fillRect(0, 0, 1024, 1024)

    return new THREE.CanvasTexture(canvas)
  }

  /**
   * 更新粒子系统
   * @param {number} deltaTime - 时间增量
   * @param {number} elapsedTime - 已经过的时间
   * @returns {boolean} 更新是否成功
   */
  update(deltaTime: number, elapsedTime: number) {
    if (!this.instance) return false

    const {range, speed, dir} = this.config
    const directionFactor = dir === 'up' ? 1 : -1
    const positionAttribute = this.instance.geometry.getAttribute('position')
    const velocityAttribute = this.instance.geometry.getAttribute('velocities')
    const particleCount = positionAttribute.count

    // 更新每个粒子
    for (let index = 0; index < particleCount; index++) {
      let posX = positionAttribute.getX(index)
      positionAttribute.getY(index) // 读取Y但不使用
      let posZ = positionAttribute.getZ(index)

      const velX = velocityAttribute.getX(index)
      const velY = velocityAttribute.getY(index)
      velocityAttribute.getZ(index) // 读取Z但不使用

      // 更新位置
      posX += Math.sin(velX * elapsedTime) * deltaTime
      posZ += speed * directionFactor

      // 粒子出界后重置位置
      if (posZ > range / 2 && directionFactor === 1) {
        posZ = -range / 2
      }
      if (posZ < -range / 2 && directionFactor === -1) {
        posZ = range / 2
      }

      // 设置新位置
      positionAttribute.setX(index, posX)
      positionAttribute.setZ(index, posZ)

      // 保持速度不变
      velocityAttribute.setX(index, velX)
      velocityAttribute.setY(index, velY)
    }

    // 标记属性需要更新
    positionAttribute.needsUpdate = true
    velocityAttribute.needsUpdate = true

    return true
  }

  /**
   * 将粒子系统添加到父对象
   * @param {THREE.Object3D} parent - 父对象
   */
  setParent(parent: THREE.Object3D) {
    parent.add(this.instance!)
    this.time.on('tick', (deltaTime, elapsedTime) => {
      this.enable && this.update(deltaTime, elapsedTime)
    })
  }
}

export default Particles
