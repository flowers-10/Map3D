/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 事件管理基类
 * 提供基本的事件发布订阅功能
 */
export default class EventEmitter {
  events: Map<any, any>
  constructor() {
    this.events = new Map()
  }

  /**
   * 注册事件监听
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   */
  on(eventName: string, callback: (...args: any[]) => void) {
    let handlers = this.events.get(eventName)
    handlers || ((handlers = new Set()), this.events.set(eventName, handlers)),
      handlers.add(callback)
  }

  /**
   * 移除事件监听
   * @param {string} eventName 事件名称
   * @param {Function} callback 要移除的回调函数，不传则移除该事件的所有监听
   */
  off(eventName: string, callback?: (...args: any[]) => void) {
    const handlers = this.events.get(eventName)
    handlers &&
      (callback ? handlers.delete(callback) : this.events.delete(eventName))
  }

  /**
   * 触发事件
   * @param {string} eventName 事件名称
   * @param {...any} args 事件参数
   */
  emit(eventName: string, ...args: any[]) {
    const handlers = this.events.get(eventName)
    handlers &&
      handlers.forEach((handler: (...args: any[]) => void) => {
        handler(...args)
      })
  }

  /**
   * 注册一次性事件监听
   * @param {string} eventName 事件名称
   * @param {Function} callback 回调函数
   */
  once(eventName: string, callback: (...args: any[]) => void) {
    const wrapper = (...args: any[]) => {
      callback(...args), this.off(eventName, wrapper)
    }
    this.on(eventName, wrapper)
  }
}
