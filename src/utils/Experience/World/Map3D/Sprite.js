import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Sprite {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.spriteGroup = new THREE.Group()
        this.createSprite([
            {
                x: 0,
                y: 0,
                value: 1000,
                title: '上海大学',
                allInfo: [
                    { targetName: '项目地址', resultValue: '胡同口五二七路' },
                    { targetName: '项目简介', resultValue: '主要学生床铺管理、环保设备(工程)、学生维修' },
                    { targetName: '项目经理', resultValue: '方晓彤' },
                    { targetName: '联系方式', resultValue: '16888888888' },
                ],
            },
        ])
    }

    createSprite(data) {
        if (!data.length) return
        //  wait
        this.resources.on('ready', () => {
            // Setup
            data.forEach((item) => {
                const texture = this.resources.items.locationTexture
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture, //设置精灵纹理贴图
                })
                const sprite = new THREE.Sprite(spriteMaterial)
                sprite.scale.set(0.17, 0.17, 1) //只需要设置x、y两个分量就可以
                sprite.position.set(item.x, item.y, 0.3)
                sprite.properties = item
                this.spriteGroup.add(sprite)
            })
            this.scene.add(this.spriteGroup)
        })
    }
}
