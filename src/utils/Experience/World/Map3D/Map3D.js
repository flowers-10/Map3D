import * as THREE from 'three'
import * as d3geo from 'd3-geo'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import JSONHelper from '../../Utils/JSONHelper'
import Experience from '../../ThreeMap3D'
import { mapVertexCommon, mapBeginVertex } from '../../Shader/Map3D/vertexShader'
import { mapFragmentCommon, mapOutputFragment } from '../../Shader/Map3D/fragmentShader'
import { skyVertexCommon, skyBeginVertex } from '../../Shader/StattySky/vertexShader'
import { skyFragmentCommon, skyOutputFragment } from '../../Shader/StattySky/fragmentShader'

/**
 @constructor
 * @param {Experience} experience - three单例
 * @param {THREE.Scene} scene - three场景.
 * @param {Experience.Time} time - 时间.
 * @param {Experience.Sizes} sizes - 尺寸.
 * @param {Experience.Resources} resources - 资源.
 * @param {JSONHelper} jsonHelper - 请求接口获取地图json.
 * @param {Group} map - 地图实例.
 * @param {Object} map3DConfig - 地图配置系.
 */
export default class Map3D {
    constructor(config) {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.jsonHelper = new JSONHelper(config.adcode)
        this.map = new THREE.Group()
        this.map.name = 'Map3D'
        this.map3DConfig = config

        //  wait
        this.resources.on('ready', () => {
            this.mapGenerator(config.series)
        })
    }
    /**
     * 遍历配置项，请求JSON数据，动态创建地图
     * @param {Array} series
     */
    async mapGenerator(series) {
        if (!Array.isArray(series)) return console.error('mapConfig series is not Array')
        const json = await this.jsonHelper.getMapJSON()

        let { center, scale } = this.createCenter(json.parentJson)
        center[1] += 0.13
        scale /= 10
        this.projection = d3geo.geoMercator().center(center).scale(scale).translate([0, 0])
        series.forEach((item) => {
            if (item.show) {
                this.createMap(json[item.mapType], item)
            }
        })
    }
    /**
     * 创建地图（地名、地图、地图边界线）
     * @param {JSON} mapJson
     * @param {lineConfig,extrudeFacesConfig,crossSectionConfig,textConfig} option
     */
    createMap(mapJson, option) {
        const { lineConfig, extrudeFacesConfig, crossSectionConfig, textConfig } = option
        const map = new THREE.Group()
        map.name = option.name
        const { material, material1, textMaterial, lineMaterial, texture } = this.createMaterial(
            crossSectionConfig,
            extrudeFacesConfig,
            textConfig,
            lineConfig,
        )
        // 总地图
        mapJson.features.forEach((elem) => {
            // 高亮对象
            // 区域3D对象和区块线3D对象
            const region = new THREE.Group()
            const lineRegion = new THREE.Group()
            const textRegion = new THREE.Group()
            const regionMap = new THREE.Group()
            regionMap.name = elem.properties.name

            region.name = 'region'
            lineRegion.name = 'lineRegion'
            textRegion.name = 'textRegion'
            // 坐标数组
            const { coordinates } = elem.geometry
            // 遍历坐标数组生成地图块
            coordinates.forEach((multiPolygon) => {
                // 获得地图块详情数据开始绘制地图
                multiPolygon.forEach((polygon) => {
                    if (option.mapShow) {
                        const mesh = this.createMapPolygon(elem, texture, option, polygon, extrudeFacesConfig, material, material1)
                        region.add(mesh)
                    }
                    if (option.lineShow) {
                        const line = this.createLine(polygon, lineConfig, lineMaterial)
                        lineRegion.add(line)
                    }
                })
            })
            // 将geo的属性放到省份模型中
            region.properties = elem.properties
            lineRegion.properties = elem.properties
            if (option.textShow) {
                if (textConfig.textType === 'canvas') {
                    const text = this.createCanvasText(elem, textConfig.textStyle, lineConfig)
                    textRegion.add(text)
                }else {
                    const text = this.createText(lineConfig, textConfig, elem, textMaterial)
                    textRegion.add(text)
                }  
            }
            regionMap.add(region)
            regionMap.add(lineRegion)
            regionMap.add(textRegion)
            map.add(regionMap)
        })

        this.map.add(map)
        this.scene.add(this.map)
    }
    // 根据地图的JSON数据生成中心点
    createCenter(mapJson) {
        const path = d3geo.geoPath()
        // 获取地理数据的范围
        const bounds = path.bounds(mapJson)
        // 计算地理数据的宽度和高度
        const width = bounds[1][0] - bounds[0][0]
        const height = bounds[1][1] - bounds[0][1]
        // 计算比例尺
        const scaleX = this.sizes.width / width
        const scaleY = this.sizes.height / height
        let scale = Math.min(scaleX, scaleY)

        const center = d3geo.geoCentroid(mapJson)

        return { center, scale }
    }
    // 生成公共材质
    createMaterial(crossSectionConfig, extrudeFacesConfig, textConfig, lineConfig) {
        const texture = this.resources.items.bgTexture
        texture.repeat.set(2, 2) // 在x和y方向上重复两次纹理
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.encoding = THREE.sRGBEncoding
        // 使用公共材质用来提升性能
        // 横截面公共材质
        const material = new THREE.MeshPhongMaterial({
            shininess: 200,
            color: crossSectionConfig.color,
            transparent: crossSectionConfig.transparent,
            map: texture,
        })
        material.color.convertSRGBToLinear()
        // 拉伸面公共材质
        const material1 = new THREE.MeshStandardMaterial({
            metalness: extrudeFacesConfig.metalness,
            roughness: extrudeFacesConfig.roughness,
            color: extrudeFacesConfig.color,
            transparent: extrudeFacesConfig.transparent,
        })
        // 文字公共材质
        const textMaterial = new THREE.MeshBasicMaterial({ wireframe: false, color: textConfig.textStyle.color })
        // 线公共材质
        const lineMaterial = new LineMaterial({
            color: lineConfig.color,
            linewidth: lineConfig.linewidth,
        })
        return { texture, material, material1, textMaterial, lineMaterial }
    }
    // 生成地图块
    createMapPolygon(elem, texture, option, polygon, extrudeFacesConfig, material, material1) {
        const shape = new THREE.Shape()
        for (let i = 0; i < polygon.length; i++) {
            let [x, y] = this.projection(polygon[i])

            if (i === 0) {
                shape.moveTo(x, -y)
            }
            shape.lineTo(x, -y)
        }
        //  拉伸几何体
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeFacesConfig.extrudeSettings)
        if (option.shader) {
            // 横截面部分材质
            this.crossSectionUniforms = {
                iTime: { value: 0 },
                iTexture: { value: texture },
            }
            this.setCrossSectionMaterial(material)
            this.customUniforms = {
                uTime: { value: 0 },
                depth: { value: extrudeFacesConfig.extrudeSettings.depth },
            }
            // 拉伸部分材质
            this.setMaterial(material1)
        }
        const mesh = new THREE.Mesh(geometry, [material, material1])
        mesh.name = elem.properties.name
        return mesh
    }
    // 生成Line2线
    createLine(polygon, option, lineMaterial) {
        const lineGeometry = new LineGeometry()
        const pointArray = []
        for (let i = 0; i < polygon.length; i++) {
            let [x, y] = this.projection(polygon[i])
            pointArray.push(new THREE.Vector3(x, -y, option.depth))
        }
        lineGeometry.setPositions(pointArray.map(({ x, y, z }) => [x, y, z]).flat())

        return new Line2(lineGeometry, lineMaterial)
    }
    // 创建3D文字
    createText(lineConfig, textConfig, elem, textMaterial) {
        const fontSize = textConfig.filterList.includes(elem.properties.name)
            ? textConfig.filterStyle.fontSize
            : textConfig.textStyle.fontSize
        const textName = textConfig.filterList.includes(elem.properties.name)
            ? this.verticalText(textConfig.filterStyle.arrangement, elem.properties.name)
            : this.verticalText(textConfig.textStyle.arrangement, elem.properties.name)
        const { center } = this.createCenter(elem)
        let [x, y] = this.projection(center)
        const textGeometry = new TextGeometry(textName, {
            font: this.resources.items.fontLang,
            size: fontSize,
            height: 0.002,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 0,
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.name = 'text'
        text.geometry.computeBoundingBox()
        const textBoundingBox = text.geometry.boundingBox
        const textWidth = textBoundingBox.max.x - textBoundingBox.min.x
        const textHeight = textBoundingBox.max.y - textBoundingBox.min.y
        this.depth = lineConfig.depth
        let finallyX = x - textWidth / 2
        let finallyY = -y - textHeight / 2 + 0.02
        textConfig.filterList.includes(elem.properties.name) ? (finallyY += 0.05) : null
        text.position.set(finallyX, finallyY, lineConfig.depth)
        return text
    }
    // 创建canvas贴图文字
    createCanvasText(elem, opt, lineConfig) {
        const value = elem.properties.name
        opt = {
            fontSize: 18,
            bold: true,
            color: '#ffffff',
            lineHeight: 20,
            maxWidth: 150,
            maxHeight: 80,
            width: 600,
            height: 200,
            fontFamily: 'Arial',
            ...opt,
        }
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const scaleRatio = 3.5

        ctx.font = `${+opt.fontSize * scaleRatio}px ${opt.fontFamily}`
        let width = 0
        let lineTextArray = []
        let lineText = ''

        for (let i = 0; i < value.length; i++) {
            const char = value.charAt(i)
            const w = ctx.measureText(char).width
            width += w

            if (opt.maxWidth && width > opt.maxWidth * scaleRatio) {
                lineTextArray.push(lineText)
                lineText = ''
                width = w
            }
            lineText += char
        }

        lineTextArray.push(lineText)

        let totalWidth = 0
        let totalHeight = 0

        if (lineTextArray.length == 1) {
            totalWidth = width
            totalHeight = opt.lineHeight * scaleRatio
        } else {
            totalWidth = opt.maxWidth * scaleRatio
            totalHeight = opt.lineHeight * scaleRatio * lineTextArray.length
        }
        canvas.setAttribute('width', `${totalWidth}`)
        canvas.setAttribute('height', `${totalHeight}`)

        for (let i = 0; i < lineTextArray.length; i++) {
            ctx.font = `${opt.bold ? 'bold ' : ''}${+opt.fontSize * scaleRatio}px ${opt.fontFamily}`
            ctx.fillStyle = opt.color
            ctx.fillText(lineTextArray[i], 0, (+opt.fontSize + i * opt.lineHeight) * scaleRatio)
        }

        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true
        texture.colorSpace = THREE.SRGBColorSpace
        texture.magFilter = texture.minFilter = THREE.LinearFilter

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        })
        // gpu过滤
        material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <opaque_fragment>',
                `
            #include <opaque_fragment>
            if(gl_FragColor.a <.8){discard;}
            `,
            )
        }
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(totalWidth * 0.0008, totalHeight * 0.0008, 1, 1), material)
        const { center } = this.createCenter(elem)
        let [x, y] = this.projection(center)

        mesh.position.set(x, -y, lineConfig.depth)

        mesh.name = value

        return mesh
    }
    // 获取墨卡托投影
    getProjection() {
        return new Promise((resolve, reject) => {
            const checkProjection = () => {
                if (this.projection) {
                    resolve(this.projection)
                } else {
                    setTimeout(checkProjection, 100)
                }
            }
            checkProjection()
        })
    }
    // 设置拉伸面材质着色器
    setMaterial(object) {
        object.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = this.customUniforms.uTime
            shader.uniforms.depth = this.customUniforms.depth

            shader.vertexShader = shader.vertexShader.replace('#include <common>', mapVertexCommon)

            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', mapBeginVertex)

            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', mapFragmentCommon)

            shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', mapOutputFragment)
        }
    }
    // 设置横截面材质着色器
    setCrossSectionMaterial(object) {
        object.onBeforeCompile = (shader) => {
            shader.uniforms.iTime = this.crossSectionUniforms.iTime

            shader.vertexShader = shader.vertexShader.replace('#include <common>', skyVertexCommon)

            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', skyBeginVertex)

            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', skyFragmentCommon)

            shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', skyOutputFragment)
        }
    }

    // 处理文字
    verticalText(type, text) {
        if (!text.length) return
        if (type === 'horizontal') return text
        var result = ''
        for (var i = 0; i < text.length; i++) {
            result += text[i] + '\n'
        }
        return result
    }

    update() {
        if (this.customUniforms && this.customUniforms.uTime) {
            this.customUniforms.uTime.value = this.time.elapsedTime * 0.5
        }
        if (this.crossSectionUniforms && this.crossSectionUniforms.iTime) {
            this.crossSectionUniforms.iTime.value = this.time.elapsedTime
        }

        // this.map.rotation.z = this.time.elapsedTime
    }
}
