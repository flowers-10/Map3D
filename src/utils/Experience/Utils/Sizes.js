import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter {
    constructor(config) {
        super()
        this.resizeHandler = () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            if(config && config.id) {
                const dom = document.getElementById(config.id)
                if (dom) {
                    const container = dom.parentElement
                    if (container) {
                        this.width = container.clientWidth
                        this.height = container.clientHeight
                    } else {
                        console.error(
                            'tips: The parent document cannot be found. Please put the current component inside the parent document ID according to the configuration item.',
                        )
                    }
                } else {
                    this.release()
                    console.error('tips: Could not find parent element ID, please check the configuration')
                }
            }
          
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            if (this.height < 200) {
                this.height = 1080
            }
            this.trigger('resize', null)
        }
        this.resizeHandler()
        window.addEventListener('resize', this.resizeHandler)
    }
    release() {
        window.removeEventListener('resize', this.resizeHandler)
    }
}
