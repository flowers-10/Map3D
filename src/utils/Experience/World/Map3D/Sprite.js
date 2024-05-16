import * as THREE from 'three'
import Experience from '../../ThreeMap3D'
// import { eventBus } from '@BI/utils/eventBus'
export default class Sprite {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
    }
    // 创建坐标精灵
    createSprite(data) {
        if (!data.length) return console.error('tips: Please use the array type for the data configuration items in spriteConfig.')
        this.scale = data[0].scaleX
        this.spriteGroup = new THREE.Group()
        this.spriteGroup.name = 'location-tips'
        //  wait
        this.resources.on('ready', async () => {
            this.projection = await this.experience.world?.map3D?.getProjection()
            if (!this.projection) return
            // Setup
            data.forEach((item) => {
                const texture = this.resources.items[item.texture]
                texture.encoding = THREE.sRGBEncoding
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: texture, //设置精灵纹理贴图
                })
                // 透明遮挡问题/GPU过滤
                spriteMaterial.onBeforeCompile = (shader) => {
                    shader.fragmentShader = shader.fragmentShader.replace(
                        '#include <opaque_fragment>',
                        `
                    #include <opaque_fragment>
                    if(gl_FragColor.a <.8){discard;}
                    `,
                    )
                }
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
    // 创建文字精灵 （已弃用，文字失真后续可调整像素问题）
    createTextSprite(data, options) {
        if (!data.length) return console.error('tips: Please use the array type for the data configuration items in textSprite.')
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
    computedSpritePosition() {
        const spriteGroup = this.spriteGroup.children
        const arr = []
        spriteGroup.forEach((item) => {
            if (item.properties.separately) {
                // 获取sprite的中心点在世界坐标系中的坐标
                const center = item.getWorldPosition(new THREE.Vector3())
                // 将世界坐标转换为屏幕坐标
                const screenPos = center.clone().project(this.camera)
                // 将屏幕坐标转换为像素坐标
                const halfWidth = this.sizes.width / 2
                const halfHeight = this.sizes.height / 2
                const pixelPos = new THREE.Vector2((screenPos.x + 1) * halfWidth, (-screenPos.y + 1) * halfHeight)
                const type = this.experience.raycaster.tooltipConfig.type || 'Medium'
                const widthMap = {
                    'Extra-Large': 320,
                    Large: 240,
                    Medium: 160,
                }
                arr.push({
                    ...item.properties,
                    x: pixelPos.x - widthMap[type] / 2,
                    y: pixelPos.y - 70,
                })
            }
        })
        // eventBus.$emit('_tooltip_groups', arr)
    }
}
