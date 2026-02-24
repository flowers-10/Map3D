import * as THREE from 'three'
import EventEmitter from '../../utils/EventEmitter'

/**
 * 时间管理类，处理动画帧和时间计算
 */
class TimeManager extends EventEmitter {
  start: number // 开始时间
  current: number // 当前时间
  elapsed: number // 已用时间
  delta: number // 时间差
  clock: THREE.Clock // 时钟
  timer: number // 定时器
  stop: boolean = false // 是否停止
  constructor() {
    super()
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.clock = new THREE.Clock()
    this.timer = window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  //时间帧更新
  tick() {
    const now = Date.now()
    this.delta = now - this.current
    this.current = now
    this.elapsed = this.current - this.start
    const deltaTime = this.clock.getDelta()
    const elapsedTime = this.clock.getElapsedTime()
    this.emit('tick', deltaTime, elapsedTime)
    if (this.stop) return window.cancelAnimationFrame(this.timer), !1
    this.timer = window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  //清理资源
  destroy() {
    this.stop = true
    this.off('tick')
  }
}

export default TimeManager
