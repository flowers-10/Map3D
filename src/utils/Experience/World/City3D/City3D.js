import * as THREE from 'three'
import Experience from '../../ThreeCity3D'
import { fragmentShader } from '../../Shader/City3D/fragmentShader'
import { vertexShader } from '../../Shader/City3D/vertexShader'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.city = null
        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.resources.items.shanghai.scene.traverse((child) => {
                // 设置线框材质
                if (child.isMesh) {
                    //这个判断模型是楼房还是其他  加载不同的材质
                    if (['CITY_UNTRIANGULATED'].includes(child.name)) {
                        // 拿到模型线框的Geometry
                        this.setCityLineMaterial(child)
                        this.setCityMaterial(child)
                    } else if (['ROADS'].includes(child.name)) {
                        //道路
                        const material = new THREE.MeshBasicMaterial({
                            color: 'rgb(41,46,76)',
                        })
                        const mesh = new THREE.Mesh(child.geometry, material)
                        mesh.rotateX(-Math.PI / 2)
                        mesh.position.set(child.position.x, child.position.y, child.position.z)
                        this.scene.add(mesh)
                    } else {
                        //地面
                        const material = new THREE.MeshBasicMaterial({
                            color: '#040912',
                        })
                        const mesh = new THREE.Mesh(child.geometry, material)
                        this.scene.add(mesh)
                        mesh.rotateX(-Math.PI / 2)
                        mesh.position.set(child.position.x, child.position.y, child.position.z)
                    }
                }
            })
        })
    }
    update() {
        if (this.city) {
            this.city.material.uniforms.height.value += 0.2
            if (this.city.material.uniforms.height.value > 100) {
                this.city.material.uniforms.height.value = 0
            }
        }
    }
    // 设置材质着色器
    setCityMaterial(object) {
        const shader = new THREE.ShaderMaterial({
            uniforms: {
                height: { value: 20 },
                uFlowColor: {
                    value: new THREE.Color('#5588aa'),
                },
                uCityColor: {
                    value: new THREE.Color('#1B3045'),
                },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
        })

        this.city = new THREE.Mesh(object.geometry, shader)
        this.city.position.set(object.position.x, object.position.y, object.position.z)
        this.city.name = 'city'
        this.scene.add(this.city)
        this.city.rotateX(-Math.PI / 2)
    }
    // 设置材质线条勾勒着色器
    setCityLineMaterial(object) {
        const edges = new THREE.EdgesGeometry(object.geometry, 1)
        //设置模型的材质
        const lineMaterial = new THREE.LineBasicMaterial({
            // 线的颜色
            color: 'rgba(38,133,254)',
        })
        //把数据组合起来
        const lineS = new THREE.LineSegments(edges, lineMaterial)
        //设置数据的位置
        lineS.position.set(object.position.x, object.position.y, object.position.z)
        //添加到场景
        this.scene.add(lineS)

        lineS.rotateX(-Math.PI / 2)
    }
}
