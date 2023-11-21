import * as THREE from 'three'
import Experience from '../../ThreeMap3D'

export default class Sprite {
    constructor(config) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
    }

    createSprite(data) {
        if (!data.length) return console.error('Please use the array type for the data configuration items in spriteConfig.')
        this.spriteGroup = new THREE.Group()
        this.spriteGroup.name = 'location-tips'
        //  wait
        this.resources.on('ready', async () => {
            this.projection = await this.experience.world.map3D.getProjection()

            // Setup
            data.forEach((item) => {
                const texture = this.resources.items[item.texture]
                texture.encoding = THREE.sRGBEncoding
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture, //设置精灵纹理贴图
                })
                const sprite = new THREE.Sprite(spriteMaterial)
                sprite.scale.set(item.scaleX, item.scaleY, 1) //只需要设置x、y两个分量就可以

                const [x, y] = this.projection([item.longitude, item.latitude])
                sprite.position.set(x, -y, item.z)
                sprite.properties = item
                this.spriteGroup.add(sprite)
            })
            this.scene.add(this.spriteGroup)
        })
    }
    createTextSprite(data, options) {
        if (!data.length) return console.error('Please use the array type for the data configuration items in textSprite.')
        this.textSpriteGroup = new THREE.Group()
        this.textSpriteGroup.name = 'textSprite'
        // 创建Canvas元素
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        // 设置字体样式和颜色
        context.font = options.fontSize + 'px Arial' // 重新设置字体样式
        context.fillStyle = options.color
        // 获取最大文本宽度
        let maxWidth = 0
        data.forEach((item) => {
            context.font = options.fontSize + 'px Arial' // 重新设置字体样式
            const textWidth = context.measureText(item.name).width
            maxWidth = Math.max(maxWidth, textWidth)
        })

        // 设置Canvas尺寸
        canvas.width = maxWidth
        canvas.height = options.fontSize + 6

        // 针对每个数据项创建精灵
        data.forEach((item) => {
            // 清空Canvas
            context.clearRect(0, 0, canvas.width, canvas.height)

            // 在Canvas上绘制文字
            context.fillText(item.name, 0, options.fontSize)
            // 创建Texture对象
            const texture = new THREE.Texture(canvas)
            texture.needsUpdate = true

            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
            })
            const sprite = new THREE.Sprite(spriteMaterial)
            sprite.scale.set(0.17, 0.17, 1)
            sprite.position.set(item.x, item.y, item.z)
            sprite.properties = item

            this.textSpriteGroup.add(sprite)
        })

        this.scene.add(this.textSpriteGroup)
    }
}
