import * as THREE from 'three'
import EventEmitter from './EventEmitter'
export default class Mousemove extends EventEmitter {
    constructor() {
        super()
        this.canvas = experience.canvas
        this.eventOffset = {
            x: 0,
            y: 0,
        }
        this.mouse = new THREE.Vector2()

        this.mouseMoveHandler = (event) => {
            // 父级并非满屏，所以需要减去父级的left 和 top
            let { top, left, width, height } = this.canvas.getBoundingClientRect()
            let clientX = event.clientX - left
            let clientY = event.clientY - top

            this.mouse.x = (clientX / width) * 2 - 1
            this.mouse.y = -(clientY / height) * 2 + 1

            this.eventOffset.x = clientX
            this.eventOffset.y = clientY
            this.trigger('mousemove', null)
        }

        window.addEventListener('mousemove', this.mouseMoveHandler, false)
    }

    release() {
        window.removeEventListener('mousemove', this.mouseMoveHandler, false)
    }
}