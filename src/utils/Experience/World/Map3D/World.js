import Experience from '../../ThreeMap3D'
import Map3D from './Map3D'
import Floor from './Floor'
import Sprite from './Sprite'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.map3D = new Map3D()
        // this.floor = new Floor()
        this.sprite = new Sprite()
    }
    update() {
        this.map3D.update()
    }
}
