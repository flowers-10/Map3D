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
}
