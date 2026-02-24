import EventEmitter from '../../utils/EventEmitter'

/**
 * 尺寸管理类，处理画布尺寸和设备像素比
 */
class SizeManager extends EventEmitter {
  canvas: HTMLCanvasElement
  pixelRatio: number
  width: number = 0
  height: number = 0
  constructor({canvas}: {canvas: HTMLCanvasElement}) {
    super()
    this.canvas = canvas
    this.pixelRatio = 0

    window.addEventListener('resize', () => {
      this.init()
      this.emit('resize')
    })
    this.init()
  }

  /**
   * 初始化尺寸信息
   */
  init() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = this.pixelRatio || Math.min(window.devicePixelRatio, 2)
  }

  /**
   * 清理资源
   */
  destroy() {
    this.off('resize')
  }
}
export default SizeManager
