/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CSS3DRenderer,
  CSS3DSprite,
  CSS3DObject,
} from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import {uuid} from './base'
import * as THREE from 'three'
import CameraManager from '../MapApplication/CameraManager'
import TimeManager from '../MapApplication/TimeManager'
import SizeManager from '../MapApplication/SizeManager'

type LabelElement = Omit<CSS3DSprite, 'remove'> & {
  init?: (content: string, position: THREE.Vector3) => void
  hide?: () => void
  show?: () => void
  setParent?: (parent: THREE.Object3D) => void
  remove?: () => void
}
/**
 * Label3D组件属性类型定义
 */
export type Label3DProps = Required<LabelElement>

/**
 * 3D标签类
 * 用于在3D场景中创建HTML标签
 */
class Label3D {
  scene: THREE.Scene
  camera: CameraManager
  time: TimeManager
  sizes: SizeManager
  canvas: HTMLCanvasElement
  parent: THREE.Object3D | null
  css3dRender: CSS3DRenderer

  /**
   * 构造函数
   * @param {Object} options - 初始化参数
   * @param {THREE.Scene} options.scene - 3D场景
   * @param {CameraManager} options.camera - 相机管理器
   * @param {TimeManager} options.time - 时间管理器
   * @param {SizeManager} options.sizes - 尺寸管理器
   * @param {HTMLCanvasElement} options.canvas - Canvas元素
   */
  constructor({
    scene,
    camera,
    time,
    sizes,
    canvas,
  }: {
    scene: THREE.Scene
    camera: CameraManager
    time: TimeManager
    sizes: SizeManager
    canvas: HTMLCanvasElement
  }) {
    this.scene = scene
    this.camera = camera
    this.time = time
    this.sizes = sizes
    this.canvas = canvas
    this.parent = null

    const {width, height} = this.sizes
    const renderer = new CSS3DRenderer()
    renderer.setSize(width!, height!)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.left = '0px'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.className = 'label3d-' + uuid()
    this.canvas.parentNode?.appendChild(renderer.domElement)
    this.css3dRender = renderer

    // 添加更新和重置尺寸事件监听
    this.time.on('tick', () => {
      this.update()
    })
    this.sizes.on('resize', () => {
      this.resize()
    })
  }

  /**
   * 创建3D标签
   * @param {string} content - 标签内容
   * @param {string} className - 标签CSS类名
   * @param {boolean} isSprite - 是否为CSS3DSprite类型
   * @returns {Label3DProps} - 返回创建的标签对象
   */
  create(content = '', className = '', isSprite = false) {
    // 创建DOM元素
    const element = document.createElement('div')
    element.innerHTML = content
    element.className = className
    element.style.visibility = 'hidden'
    element.style.position = 'absolute'

    // 如果没有提供类名，使用默认样式
    if (!className) {
      element.style.padding = '10px'
      element.style.color = '#fff'
      element.style.fontSize = '12px'
      element.style.textAlign = 'center'
      element.style.background = 'rgba(0,0,0,0.6)'
      element.style.borderRadius = '4px'
    }

    // 根据isSprite参数决定创建的标签类型
    let label: LabelElement

    isSprite
      ? (label = new CSS3DSprite(element))
      : (label = new CSS3DObject(element))

    // 初始化方法，设置内容和位置
    label.init = (content, position) => {
      label.element.innerHTML = content
      label.element.style.visibility = 'visible'
      label.position.copy(position)
    }

    // 隐藏标签
    label.hide = () => {
      label.element.style.visibility = 'hidden'
    }

    // 显示标签
    label.show = () => {
      label.element.style.visibility = 'visible'
    }

    // 设置父对象
    label.setParent = parent => {
      this.parent = parent
      parent.add(label as unknown as THREE.Object3D)
    }

    // 移除标签
    label.remove = () => {
      this.parent?.remove(label as unknown as THREE.Object3D)
    }

    return label as Label3DProps
  }

  /**
   * 设置标签样式
   * @param {any} label - 标签对象
   * @param {number} scale - 缩放比例
   * @param {string} rotationAxis - 旋转轴
   * @param {number} rotationAngle - 旋转角度
   * @param {string} pointerEvents - 鼠标事件处理方式
   */
  setLabelStyle(
    label: Label3DProps,
    scale = 0.1,
    rotationAxis = 'x' as 'x' | 'y' | 'z',
    rotationAngle = Math.PI / 2,
    pointerEvents = 'none',
  ) {
    label.element.style.pointerEvents = pointerEvents
    label.scale.set(scale, scale, scale)
    label.rotation[rotationAxis] = rotationAngle
  }

  /**
   * 更新渲染
   */
  update() {
    this.css3dRender.render(this.scene, this.camera.instance!)
  }

  /**
   * 销毁标签渲染器
   */
  destroy() {
    if (this.css3dRender) {
      const domElement = this.css3dRender.domElement
      domElement.parentNode?.removeChild(domElement)
    }
  }

  /**
   * 重置标签渲染器尺寸
   */
  resize() {
    const {width, height} = this.sizes
    this.css3dRender.setSize(width!, height!)
  }
}
export {Label3D}
