import * as THREE from 'three'
import Experience from '../../ThreeMap3D'
// import { eventBus } from '@BI/utils/eventBus'

export default class Raycaster {
    constructor(tooltipConfig) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.canvas = experience.canvas
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.mouse = this.experience.mousemove.mouse
        this.mouseOffset = this.experience.mousemove.eventOffset
        this.camera = this.experience.camera.instance
        this.distance = this.experience.camera.distance
        this.resources = this.experience.resources
        this.raycaster = new THREE.Raycaster()
        // 坐标精灵图相关属性
        this.spriteShow = true
        this.spriteType = this.experience.world.sprite?.type || 'blue'
        if (this.experience.world.sprite) {
            this.spriteGroup = this.experience.world.sprite.spriteGroup?.children
            this.scale = this.experience.world.sprite.scale // 精灵图当前倍率
            this.currentSprite = null // 当前触发的精灵图
            this.currentDistance = 0 // 当前距离
        } else {
            this.spriteShow = false
            console.error('tips: Coordinate sprite is not initialized.')
        }

        // 地图相关属性
        this.objectsToMap = this.experience.world.map3D.map.children
        this.currentIntersect = null // 当前激活的地图
        this.animation = true // 是否开启动画

        // 提示框相关属性
        this.tooltipShow = tooltipConfig.show
        this.tooltipConfig = tooltipConfig
        this.index = 0 // 只触发一次
        this.tooltipIndex = 0
        this.tooltipTimer = 0
        this.tooltipTimer2 = 0
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        this.tooltipShow ? this.dispatchHoverAction() : null
        this.spriteShow ? this.locationController() : null
        // this.dispatchRegionAction()
    }
    // 鼠标移入tooltip动画
    dispatchHoverAction() {
        if (!this.spriteShow || !this.spriteGroup.length) return
        const intersects = this.raycaster.intersectObjects(this.spriteGroup, true)
        const div = document.getElementById('three_tooltip')
        if (div) {
            // 射线没检测到
            if (!intersects.length) {
                // 防抖只触发一次
                !this.index ? (div.style.display = 'none') : null
                // 开启自动轮播动画
                this.index = 1
                this.animation = true
                this.tooltipTimer2 += this.time.delta
                if (this.tooltipTimer2 >= 2000) {
                    /* 开启自动轮播动画 */
                    this.dispatchAction(this.tooltipIndex)
                }
            } else {
                // 检测到sprite
                this.index = 0
                this.animation = false // 停止自动轮播行为
                this.tooltipTimer2 = 0 // 充值
                div.style.display = 'block'
                const scale = 1 / +localStorage.getItem('scale') || 1
                div.style.left = this.mouseOffset.x * scale + 20 + 'px'
                div.style.top = this.mouseOffset.y * scale + 20 + 'px'
                // 坐标精灵图放大
                this.currentSprite?.scale.set(this.scale, this.scale, 1)
                this.currentSprite = intersects[0].object
                this.currentSprite.scale.set(this.scale * 1.5, this.scale * 1.5, 1)
                // 派发sprite信息给tooltip组件
                // eventBus.$emit('_tooltip_info', { ...intersects[0].object.properties, type: 'default' })
            }
        }
    }
    // 自动tooltip动画
    dispatchAction(index) {
        if (this.animation && this.spriteShow && this.tooltipShow && this.tooltipConfig.animation) {
            this.tooltipTimer += this.time.delta
            if (this.tooltipTimer >= this.tooltipConfig.duration) {
                this.tooltipIndex++
                this.tooltipTimer = 0
            }
            // 当射线检测到物体时，停止行为
            if (!this.animation) return
            if (!this.spriteGroup.length) return
            const len = this.spriteGroup.length

            // 获取sprite的中心点在世界坐标系中的坐标
            const center = this.spriteGroup[index % len].getWorldPosition(new THREE.Vector3())
            // 将世界坐标转换为屏幕坐标
            const screenPos = center.clone().project(this.camera)
            // 将屏幕坐标转换为像素坐标
            const halfWidth = this.sizes.width / 2
            const halfHeight = this.sizes.height / 2
            const offsetX = Number(this.tooltipConfig.offsetX) || 0
            const offsetY = Number(this.tooltipConfig.offsetY) || 0
            let finallyX = 0
            let divX = 0
            let divY = 0
            const pixelPos = new THREE.Vector2((screenPos.x + 1) * halfWidth, (-screenPos.y + 1) * halfHeight)
            const widthMap = {
                'Extra-Large': 320,
                Large: 240,
                Medium: 160,
            }
            // console.log('pixelPos:', pixelPos)

            const div = document.getElementById('three_tooltip')
            if (div && pixelPos) {
                // 开始轮播提示框
                div.style.display = 'block'
                if (pixelPos.x > halfWidth) {
                    divX = Number(pixelPos.x.toFixed(0)) + offsetX || 0
                    finallyX= offsetX
                    divY = Number(pixelPos.y.toFixed(0)) - offsetY
                } else {
                    const tooltipWidth = widthMap[this.tooltipConfig.type] || 160
                    divX = Number(pixelPos.x.toFixed(0)) - offsetX - tooltipWidth || 0
                    finallyX = -offsetX
                    divY = Number(pixelPos.y.toFixed(0)) - offsetY
                }
                div.style.left = divX + 'px'
                div.style.top = divY + 'px'
                this.currentSprite ? (this.currentSprite.renderOrder = 1) : null
                this.currentSprite?.scale.set(this.scale, this.scale, 1)
                if (this.spriteType && this.spriteType !== 'random' && this.currentSprite) {
                    const texture = this.resources.items[this.spriteType]
                    if(texture && texture.hasOwnProperty('encoding')) {
                        texture.encoding = THREE.sRGBEncoding
                    }
                    this.currentSprite.material.map = texture
                    this.currentSprite.material.needsUpdate = true
                }

                this.currentSprite = this.spriteGroup[index % len]

                if (this.spriteType && this.spriteType !== 'random' && this.currentSprite) {
                    // todo
                    const texture = this.resources.items['locationTextureRed']
                    if(texture && texture.hasOwnProperty('encoding')) {
                        texture.encoding = THREE.sRGBEncoding
                    }
                    this.currentSprite.material.map = texture
                    this.currentSprite.material.needsUpdate = true
                }
                this.currentSprite.renderOrder = 10
                this.currentSprite.scale.set(this.scale * 2, this.scale * 2, 1)
                // eventBus.$emit('_tooltip_info', {
                //     ...this.currentSprite.properties,
                //     type: 'lines',
                //     x: pixelPos.x,
                //     y: pixelPos.y,
                //     offsetX:finallyX,
                //     offsetY,
                // })
            } else {
                div.style.display = 'none'
            }
        }
    }
    // 鼠标移入region动画
    dispatchRegionAction() {
        // 检测到region物体
        if (this.objectsToMap[1]) {
            const regionIntersects = this.raycaster.intersectObjects(this.objectsToMap[1].children, true)
            // 检测到物体
            if (regionIntersects.length) {
                // console.log('mouse enter')
                this.objectsToMap[1].children.forEach((item) => {
                    if (item.name === regionIntersects[0]?.object.name) {
                        this.currentIntersect?.children.forEach((item) => {
                            if (item.name === 'textRegion') {
                                item.children.forEach((item) => {
                                    item.position.z = this.experience.world.map3D.depth
                                })
                            } else {
                                item.children.forEach((item) => {
                                    item.scale.set(1, 1, 1)
                                })
                            }
                        })
                        this.currentIntersect = item
                        item.children.forEach((item) => {
                            if (item.name === 'textRegion') {
                                item.children.forEach((item) => {
                                    item.position.z = this.experience.world.map3D.depth * 2
                                })
                            } else {
                                item.children.forEach((item) => {
                                    item.scale.set(1, 1, 2)
                                })
                            }
                        })
                    }
                })
            } else {
                // console.log('mouse leave')
                this.currentIntersect?.children.forEach((item) => {
                    if (item.name === 'textRegion') {
                        item.children.forEach((item) => {
                            item.position.z = this.experience.world.map3D.depth
                        })
                    } else {
                        item.children.forEach((item) => {
                            item.scale.set(1, 1, 1)
                        })
                    }
                })
                this.currentIntersect = null
            }
        }
    }
    // 根据控制器相机高度动态缩放坐标
    locationController() {
        // 记录上一次更新的精灵图的信息
        let lastSpriteName = this.currentSprite?.name || '';
        let lastSpriteId = this.currentSprite?.id || '';
    
        const initialDistance = 2.2 // 初始距离
        const initialScale = this.experience.world.sprite.scale // 初始缩放值
        const distance = this.experience.camera.controls.getDistance()
        if (distance === this.currentDistance) return
        this.currentDistance = distance
        this.scale = (initialScale / (initialDistance / distance)).toFixed(2)
        this.spriteGroup.forEach((item) => {
            // 判断精灵图是否已经更新过，如果是就不进行缩放操作
            if ((item.name && item.name === lastSpriteName) || (item.id && item.id === lastSpriteId)) {
                return;
            }
            item.scale.set(this.scale, this.scale, 1)
        })
    }
}
