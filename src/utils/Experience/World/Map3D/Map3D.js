import * as THREE from 'three'
import * as d3geo from 'd3-geo'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

import Experience from '../../ThreeMap3D'
import { mapVertexCommon, mapBeginVertex } from '../../Shader/Map3D/vertexShader'
import { mapFragmentCommon, mapOutputFragment } from '../../Shader/Map3D/fragmentShader'
import { skyVertexShader } from '../../Shader/StattySky/vertexShader'
import { skyFragmentShader } from '../../Shader/StattySky/fragmentShader'

export default class Map3D {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resources = this.experience.resources
        // 内置对象
        this.map = new THREE.Group()
        this.lines = new THREE.Group()
        this.regionLines = new THREE.Group()
        this.customUniforms = {
            uTime: { value: 0 },
        }
        this.createMap()
    }
    async createMap() {
        const mapJson = await import(/* webpackChunkName: "chinaMap" */ /* webpackMode: "lazy" */ './shanghai.json')
        const mapJson1 = await import(/* webpackChunkName: "chinaMap" */ /* webpackMode: "lazy" */ './shanghai1.json')
        this.getProjection(mapJson.features[0].properties.center)
        this.mapGenerater(mapJson, this.map, this.lines, { color: '#A0E5FF', linewidth: 0.004 })
        this.mapGenerater(mapJson1, null, this.regionLines, { color: '#ffffff', linewidth: 0.001 })
        this.scene.add(this.lines)
        this.scene.add(this.regionLines)
        this.scene.add(this.map)
    }
    mapGenerater(mapJson, map, lines, option) {
        mapJson.features.forEach((elem) => {
            // 区域3D对象和区块线3D对象
            const region = new THREE.Group()
            const regionLines = new THREE.Group()
            // 坐标数组
            const { coordinates } = elem.geometry
            // 遍历坐标数组
            coordinates.forEach((multiPolygon) => {
                multiPolygon.forEach((polygon) => {
                    const shape = new THREE.Shape()
                    for (let i = 0; i < polygon.length; i++) {
                        let [x, y] = this.projection(polygon[i])

                        if (i === 0) {
                            shape.moveTo(x, -y)
                        }
                        shape.lineTo(x, -y)
                    }

                    const extrudeSettings = {
                        depth: 0.2,
                        bevelEnabled: false,
                        // bevelSegments: 1,
                        // bevelThickness: 0,
                    }

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                    this.material = null
                    // 平面部分材质
                    this.material = new THREE.ShaderMaterial({
                        vertexShader: skyVertexShader,
                        fragmentShader: skyFragmentShader,
                        transparent: true,
                        uniforms: {
                            iTime: { value: 0 },
                            color1: {
                                value: new THREE.Color('#2B61A6')
                            },
                            color2: {
                                value: new THREE.Color('#0E2649')
                            },
                        },
                    })
                    // 拉高部分材质
                    const material1 = new THREE.MeshStandardMaterial({
                        metalness: 1,
                        roughness: 1,
                        color: '#3a7abd',
                        transparent: true,
                    })

                    this.setMaterial(material1)

                    const mesh = new THREE.Mesh(geometry, [this.material, material1])
                    // 给mesh开启阴影
                    mesh.castShadow = true
                    mesh.receiveShadow = true
                    const line = this.createLine(polygon, extrudeSettings.depth + 0.01, option)
                    region.add(mesh)
                    regionLines.add(line)
                })
            })
            // 将geo的属性放到省份模型中
            region.properties = elem.properties
            if (elem.properties.centorid) {
                const [x, y] = projection(elem.properties.centorid)
                region.properties._centroid = [x, y]
            }
            lines?.add(regionLines)
            map?.add(region)
        })
    }
    getProjection(center) {
        this.projection = d3geo.geoMercator().center(center).scale(80).translate([0, 0])
    }

    createLine(polygon, depth, option = { color: '#A0E5FF', linewidth: 0.002 }) {
        const lineGeometry = new LineGeometry()
        const pointArray = []
        for (let i = 0; i < polygon.length; i++) {
            let [x, y] = this.projection(polygon[i])
            pointArray.push(new THREE.Vector3(x, -y, depth))
        }
        lineGeometry.setPositions(pointArray.map(({ x, y, z }) => [x, y, z]).flat())
        const lineMaterial = new LineMaterial(option)

        return new Line2(lineGeometry, lineMaterial)
    }
    // 设置材质着色器
    setMaterial(object) {
        object.onBeforeCompile = (shader) => {
            console.log(shader);
            shader.uniforms.uTime = this.customUniforms.uTime
            shader.vertexShader = shader.vertexShader.replace('#include <common>', mapVertexCommon)

            shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', mapBeginVertex)

            shader.fragmentShader = shader.fragmentShader.replace('#include <common>', mapFragmentCommon)

            shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', mapOutputFragment)
        }
    }

    update() {
        this.customUniforms.uTime.value = this.time.elapsedTime * 0.5
        if (this.map?.children[0]) {
            this.map.children[0].children.forEach((child) => {
                if (child.material[0]) {
                    child.material[0].uniforms.iTime.value = this.time.elapsedTime
                }
            })
        }

        // this.map.rotation.z = this.time.elapsedTime
    }
}
