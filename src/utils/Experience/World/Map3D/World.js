import Experience from '../../ThreeMap3D'
import Map3D from './Map3D'
import Floor from './Floor'
import Sprite from './Sprite'

export default class World {
    constructor(config) {
        this.experience = new Experience()
        this.scene = this.experience.scene
       
        if (config.mapConfig.show) {
            this.map3D = new Map3D(config.mapConfig)
        }
        if (config.spriteConfig.show) {
            this.sprite = new Sprite(config.spriteConfig)
            this.sprite.createSprite(config.spriteConfig.data)
        }
        console.log(this.scene);
        // this.floor = new Floor()
    }
    update() {
        this.map3D?.update()
    }
}
