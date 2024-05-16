import EventEmitter from './EventEmitter'
import * as THREE from 'three'

export default class Time extends EventEmitter {
    constructor() {
        super()
        this.clock = new THREE.Clock()
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.timer = 0
        this.index = 0
        this.tick()
    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = currentTime - this.start
        this.elapsedTime = this.clock.getElapsedTime();
        this.trigger('tick', null)
        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
    release() {
        window.cancelAnimationFrame(this.tick)
    }
    tickS(interval = 1000,fn) {
        this.timer += this.delta
        if(this.timer >= interval) {
            this.index++
            this.timer = 0
            // console.log('每' + interval + '毫秒执行的操作',this.index);
            fn(this.index)
        }
    }
}
