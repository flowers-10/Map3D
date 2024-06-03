import Experience from '../../ThreeMap3D'
import Map3D from './Map3D'
import Floor from './Floor'
import Sprite from './Sprite'

export default class World {
    constructor(config, sourceData) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        // Map相关配置
        if (config.mapConfig.show) {
            this.map3D = new Map3D(config.mapConfig)
            this.map3D.map.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
            this.map3D.map.position.set(config.position.x, config.position.y, config.position.z)
        }
        // 坐标精灵图相关配置
        if (sourceData) {
            this.sprite = new Sprite()
            this.sprite.createSprite(sourceData)
            this.sprite.type = config.spriteConfig.type || 'blue'
            this.sprite.spriteGroup.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
            this.sprite.spriteGroup.position.set(config.position.x, config.position.y, config.position.z)
        }
        //   地板相关配置
        if (config.hasOwnProperty('floorConfig') &&config.floorConfig.show) {
            this.floor = new Floor(config.floorConfig)
            this.floor.floorGroup.rotation.set(config.rotation.x, config.rotation.y, config.rotation.z)
            this.floor.floorGroup.position.set(config.position.x, config.position.y, config.position.z)
        }
    }
    update() {
        this.map3D?.update()
        this.map3D.computedTextPosition()

        this.floor?.update()
        this.sprite?.computedSpritePosition()
    }
}
