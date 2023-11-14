import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
    constructor() {
        super()
        const container = document.getElementById('scene')
        this.width =  window.innerWidth 
        this.height = window.innerHeight 

        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.resizeHandler = () => {
            this.width =  window.innerWidth 
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            this.trigger('resize', null)
        }
        window.addEventListener('resize', this.resizeHandler)
    }
    release() {
        window.removeEventListener('resize', this.releaseHandler)
    }
}