import Experience from '../../ThreeMap3D'
import Map3D from './Map3D'
import Floor from './Floor'
import Sprite from './Sprite'

export default class World {
    constructor(config) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.gui = this.experience.gui

       
        if (config.mapConfig.show) {
            this.map3D = new Map3D(config.mapConfig)
            this.map3D.map.rotation.x = -0.62
            this.gui
            .add(this.map3D.map.rotation, "x")
            .min(-Math.PI)
            .max(Math.PI)
            .step(0.02)
            .name("Mx");
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
