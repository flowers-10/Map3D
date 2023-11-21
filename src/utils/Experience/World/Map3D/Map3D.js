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
            this.createMap(config.series)
        })
    }
    async createMap(series) {
        if (!Array.isArray(series)) return console.error('mapConfig series is not Array')
        const json = await this.jsonHelper.getMapJSON()
        let { center, scale } = this.createCenter(json.parentJson)
        center[1] += 0.13
        scale /= 10
        this.projection = d3geo.geoMercator().center(center).scale(scale).translate([0, 0])
        series.forEach((item) => {
            if (item.show) {
                this.mapGenerater(json[item.mapType], item)
            }
        })
    }
    mapGenerater(mapJson, option) {
        const { lineConfig, extrudeFacesConfig, crossSectionConfig, textConfig } = option
        const map = new THREE.Group()
        map.name = option.name
        const texture = this.resources.items.bgTexture
        texture.repeat.set(2, 2) // 在x和y方向上重复两次纹理
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.encoding = THREE.sRGBEncoding
        // 使用公共材质用来提升性能
        // 横截面公共材质
        const material = new THREE.MeshPhongMaterial({
            shininess: 200,
            color: crossSectionConfig.color[1],
            transparent: crossSectionConfig.transparent,
            map: texture,
        })
        material.color.convertSRGBToLinear()
        // 拉伸面公共材质
        const material1 = new THREE.MeshStandardMaterial({
            metalness: extrudeFacesConfig.metalness,
            roughness: extrudeFacesConfig.roughness,
            color: extrudeFacesConfig.color[0],
            transparent: extrudeFacesConfig.transparent,
        })
        // 文字公共材质
        const textMaterial = new THREE.MeshBasicMaterial({ wireframe: false, color: textConfig.textStyle.color })
        // 线公共材质
        const lineMaterial = new LineMaterial({
            color: lineConfig.color,
            linewidth: lineConfig.linewidth,
        })
        mapJson.features.forEach((elem) => {
            // 高亮对象
            // 区域3D对象和区块线3D对象
            const region = new THREE.Group()
            const lineRegion = new THREE.Group()
            const textRegion = new THREE.Group()
            region.name = 'region'
            lineRegion.name = 'lineRegion'
            textRegion.name = 'textRegion'
            // 坐标数组
            const { coordinates } = elem.geometry
            // 遍历坐标数组
            coordinates.forEach((multiPolygon) => {
                multiPolygon.forEach((polygon) => {
                    if (option.mapShow) {
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
                        // 给mesh开启阴影
                        mesh.castShadow = option.castShadow
                        mesh.receiveShadow = option.receiveShadow
                        region.add(mesh)
                    }
                    if (option.lineShow) {
                        const line = this.createLine(polygon, lineConfig,lineMaterial)
                        lineRegion.add(line)
                    }
                })
            })
            // 将geo的属性放到省份模型中
            region.properties = elem.properties
            lineRegion.properties = elem.properties
            if (option.textShow) {
                const { center, scale } = this.createCenter(elem)
                let [x, y] = this.projection(center)
                const textGeometry = new TextGeometry(elem.properties.name, {
                    font: this.resources.items.tsangerYuYang,
                    size: textConfig.textStyle.fontSize,
                    height: 0.001,
                    curveSegments: 12,
                    bevelEnabled: false,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5,
                })
                const text = new THREE.Mesh(textGeometry, textMaterial)
                text.position.set(x, -y, lineConfig.depth)
                textRegion.add(text)
            }
            map.add(region)
            map.add(lineRegion)
            map.add(textRegion)
        })
        this.map.add(map)
        this.scene.add(this.map)
    }

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
