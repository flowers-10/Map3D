<template>
  <div class="zj-map relative w-full h-full">
    <canvas ref="canvasRef" id="canvas" class="w-full h-full relative" />
    <video class="map-gd-video map-gd-video1" width="250" height="100" loop crossorigin="anonymous" playsinline
      style="display: none" ref="video1Ref">
      <source :src="animate1Src" />
    </video>
    <video class="map-gd-video map-gd-video2" width="250" height="100" loop crossorigin="anonymous" playsinline
      style="display: none" ref="video2Ref">
      <source :src="animate2Src" />
    </video>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import * as THREE from 'three'
import gsap from 'gsap'

import {
  LilGui,
  MapApplication,
  MapControlOptions,
  ChinaProvinceInfo,
  LoadAssets,
  ZheJiangCityInfo,
  Grid,
  PlaneMeshRotate,
  initGsapTimeLine,
  GeoMapRenderer,
  LineRenderer,
  createProvinceMaterial,
  GradientShader,
  ExtrudedGeoMapRenderer,
  createAnimateVideoItem,
  Label3D,
  Label3DProps,
  createDecorationIcon,
  createProvinceBarLabel,
  createProvinceLabel,
  createSpecialProvinceLabel,
  SquareIcon,
  Particles,
  Animate1,
  Animate2,
  ZheJiangData
} from './modules'

class MapControlStudy extends MapApplication {
  // debug?: LilGui
  // 地图中心点
  pointCenter: [number, number]
  flyLineCenter: [number, number]
  assets: LoadAssets
  rotateBorder1?: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >
  rotateBorder2?: THREE.Mesh<
    THREE.PlaneGeometry,
    THREE.MeshBasicMaterial,
    THREE.Object3DEventMap
  >
  focusMapTopMaterial?: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial
  focusMapSideMaterial?: THREE.MeshLambertMaterial | THREE.MeshStandardMaterial
  zhejiangLineMaterial?: THREE.LineBasicMaterial
  focusMapGroup?: THREE.Group<THREE.Object3DEventMap>
  clicked = false // 点击控制
  eventElement: THREE.Object3D<THREE.Object3DEventMap>[] = []
  defaultMaterial?: THREE.MeshStandardMaterial
  defaultLightMaterial?: THREE.MeshStandardMaterial
  flyLineGroup?: THREE.Group<THREE.Object3DEventMap>
  flyLineFocusGroup?: THREE.Group<THREE.Object3DEventMap>
  label3d: Label3D
  labelGroup?: THREE.Group<THREE.Object3DEventMap>
  labels: Label3DProps[] = []
  particles?: Particles
  allBar: THREE.Mesh[] = []
  allBarMaterial: THREE.MeshBasicMaterial[] = []
  allGuangquan: THREE.Group<THREE.Object3DEventMap>[] = []
  allProvinceLabel: Label3DProps[] = []
  quanGroup?: THREE.Group<THREE.Object3DEventMap>
  constructor(container: HTMLCanvasElement, options: MapControlOptions) {
    super(container, options)
    this.container = container
    this.pointCenter = options.centroid
    this.flyLineCenter = ZheJiangCityInfo[0].centroid as [number, number]
    this.scene.background = new THREE.Color(0x102736)
    // 设置雾化
    this.scene.fog = new THREE.Fog(0x102736, 1, 30)
    if (this.camera.instance) {
      this.camera.instance.position.set(
        -13.767695123014105,
        12.990152163077308,
        39.28228164159694,
      )

      this.camera.instance.near = 1
      this.camera.instance.far = 10000
      this.camera.instance.updateProjectionMatrix()
    }

    this.label3d = new Label3D(this)

    // this.initLilGui()

    this.assets = new LoadAssets(() => {
      console.log('资源初始化成功')
      this.initEnvironment()
      this.createFloor()
      this.createGrid()
      this.createRotateBorder()
      this.createLabel()
      this.createModel()
      this.createAnimateVideo()
      this.createEvent()
      this.createFlyLine()
      this.createParticles()
      this.createBar()

      initGsapTimeLine.call(this)
    })
  }

  initLilGui() {
    // this.debug = new LilGui(true)
  }
  // 创建环境光照
  initEnvironment() {
    // 创建环境光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 5) // 白色环境光，强度5
    this.scene.add(ambientLight)

    // 创建平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5) // 白色平行光，强度5
    directionalLight.position.set(-30, 6, -8) // 设置光源位置
    // directionalLight.castShadow = true // 启用阴影投射
    // directionalLight.shadow.radius = 20 // 阴影半径
    // directionalLight.shadow.mapSize.width = 1024 // 阴影贴图宽度
    // directionalLight.shadow.mapSize.height = 1024 // 阴影贴图高度
    this.scene.add(directionalLight)
  }
  // 创建地板
  createFloor() {
    if (this.assets.instance) {
      // 创建一个20x20的平面几何体作为地板
      const floorGeometry = new THREE.PlaneGeometry(20, 20)
      const oceanTexture = this.assets.instance.getResource('ocean')
      oceanTexture.colorSpace = THREE.SRGBColorSpace // 设置颜色空间
      oceanTexture.wrapS = THREE.RepeatWrapping // 水平方向重复纹理
      oceanTexture.wrapT = THREE.RepeatWrapping // 垂直方向重复纹理
      oceanTexture.repeat.set(1, 1) // 设置纹理重复次数
      const floorMaterial = new THREE.MeshBasicMaterial({
        map: oceanTexture,
        opacity: 1,
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotateX(-Math.PI / 2)
      floor.position.set(0, -0.7, 0)
      this.scene.add(floor)
    }
  }
  // 创建网格
  createGrid() {
    const options = {
      gridSize: 50,
      gridDivision: 20,
      gridColor: 0x1b4b70, // 深蓝
      shapeSize: 0.5,
      shapeColor: 0x2a5f8a, // 深蓝
      // shapeColor: 0xf44336, // 红色
      pointSize: 0.1,
      pointColor: 0x154d7d, // 深蓝
      diffuse: true,
      diffuseSpeed: 10,
      diffuseWidth: 10,
      diffuseColor: 0x2e8bd9, // 蓝色
      // diffuseDir: 1, // 扩散方向：0-圆形扩散，1-横向扩散
    }
    new Grid(this, options)
  }
  // 创建旋转边框
  createRotateBorder() {
    // 旋转边框的尺寸大小
    const borderSize = 12

    // 获取两种不同的旋转边框纹理
    const outerBorderTexture =
      this.assets.instance?.getResource('rotationBorder1')
    const innerBorderTexture =
      this.assets.instance?.getResource('rotationBorder2')

    // 创建外层旋转边框
    const outerBorder = new PlaneMeshRotate(
      {
        time: this.time,
      },
      {
        name: 'rotationBorder1-mesh',
        width: borderSize * 1.178, // 外层边框稍大
        needRotate: true,
        rotateSpeed: 0.001, // 外层旋转速度较慢
        material: new THREE.MeshBasicMaterial({
          alphaMap: outerBorderTexture,
          color: 0x48afff, // 蓝色调
          transparent: true,
          opacity: 0.2, // 外层透明度较低
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
        position: new THREE.Vector3(0, 0.21, 0),
      },
    )
    outerBorder.instance.renderOrder = 6
    outerBorder.instance.scale.set(0, 0, 0)
    outerBorder.setParent(this.scene)

    // 创建内层旋转边框
    const innerBorder = new PlaneMeshRotate(
      {
        time: this.time,
      },
      {
        name: 'rotationBorder1-mesh',
        width: borderSize * 1.116, // 内层边框稍小
        needRotate: true,
        rotateSpeed: -0.004, // 内层旋转速度较快，方向相反
        material: new THREE.MeshBasicMaterial({
          alphaMap: innerBorderTexture,
          color: 0x48afff, // 蓝色调
          transparent: true,
          opacity: 0.4, // 内层透明度较低
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
        position: new THREE.Vector3(0, 0.21, 0),
      },
    )
    innerBorder.instance.renderOrder = 6
    innerBorder.instance.scale.set(0, 0, 0)
    innerBorder.setParent(this.scene)

    this.rotateBorder1 = outerBorder.instance
    this.rotateBorder2 = innerBorder.instance
  }
  // 创建标签
  createLabel() {
    this.labelGroup = new THREE.Group()
    this.labelGroup.name = 'labelGroup'
    this.labelGroup.rotateX(-Math.PI / 2)
    this.labelGroup.position.set(0, 0.4, 0)
    this.scene.add(this.labelGroup)

    // 创建中国省份标签
    ChinaProvinceInfo.map(provinceInfo => {
      if (provinceInfo.hide) return
      const provinceLabel = createProvinceLabel({
        provinceInfo,
        label3d: this.label3d,
        parentGroup: this.labelGroup!,
        geoProjection: this.geoProjection.bind(this),
      })
      this.labels.push(provinceLabel)
    })

    // 创建浙江省标签
    const zhejiangLabel = createSpecialProvinceLabel({
      provinceInfo: {
        name: '浙江省',
        enName: 'ZHEJIANG PROVINCE',
        center: [120.109913, 26.881466],
      },
      label3d: this.label3d,
      parentGroup: this.labelGroup!,
      geoProjection: this.geoProjection.bind(this),
    })
    this.labels.push(zhejiangLabel)

    // 创建装饰图标
    const decorationIcon = createDecorationIcon({
      iconInfo: {
        icon: SquareIcon,
        center: [125.109913, 26.881466],
        width: '40px',
        height: '40px',
        reflect: true,
      },
      label3d: this.label3d,
      parentGroup: this.labelGroup!,
      geoProjection: this.geoProjection.bind(this),
    })
    // 创建小尺寸装饰图标
    const smallDecorationIcon = createDecorationIcon({
      iconInfo: {
        icon: SquareIcon,
        center: [116.109913, 26.881466],
        width: '20px',
        height: '20px',
        reflect: false,
      },
      label3d: this.label3d,
      parentGroup: this.labelGroup!,
      geoProjection: this.geoProjection.bind(this),
    })

    this.labels.push(decorationIcon)
    this.labels.push(smallDecorationIcon)
  }
  /**
   * 创建模型并组织地图层次结构
   * 负责创建中国地图及浙江省地图模型，并设置它们的层级关系
   */
  createModel() {
    const mapRootGroup = new THREE.Group()
    this.focusMapGroup = new THREE.Group()
    const bottomLineGroup = new THREE.Group()
    // 创建中国地图及其轮廓线
    const { china, chinaLine, chinaBottomLine } = this.createChina()
    china.setParent(mapRootGroup)
    chinaLine.setParent(mapRootGroup)
    chinaBottomLine.setParent(bottomLineGroup)

    // 创建浙江省地图及其相关元素
    const { zhejiang, zhejiangTop, zhejiangLine } = this.createZheJiang()
    zhejiang.setParent(this.focusMapGroup)
    zhejiangTop.setParent(this.focusMapGroup)
    zhejiangLine.setParent(this.focusMapGroup)

    this.focusMapGroup.position.set(0, 0, -0.11)
    this.focusMapGroup.scale.set(0, 0, 0)

    mapRootGroup.rotateX(-Math.PI / 2)
    mapRootGroup.position.set(0, 0.2, 0)

    bottomLineGroup.rotateX(-Math.PI / 2)
    bottomLineGroup.position.set(0, -0.04, 0)

    mapRootGroup.add(this.focusMapGroup)

    this.scene.add(mapRootGroup)
    this.scene.add(bottomLineGroup)
  }
  /**
   * 创建中国地图及其相关元素
   * 负责创建中国地图及其相关元素，包括中国地图、中国轮廓线等
   * @returns 包含中国地图、中国轮廓线和底部线条的对象
   */
  createChina() {
    const chinaProvinceGeoData =
      this.assets.instance!.getResource('world')
    const chinaGeoData = this.assets.instance!.getResource('world')

    const china = new GeoMapRenderer({
      data: chinaProvinceGeoData,
      center: this.pointCenter,
      scale: this.config.geoProjectionScale,
      material: new THREE.MeshLambertMaterial({
        color: 0x152c47, // 深蓝色
        transparent: true,
        opacity: 1,
      }),
      renderOrder: 2,
    })

    const chinaLine = new LineRenderer({
      center: this.pointCenter,
      scale: this.config.geoProjectionScale,
      data: chinaProvinceGeoData,
      material: new THREE.LineBasicMaterial({
        color: 0x3f82cd, // 蓝色
      }),
      renderOrder: 3,
    })

    const chinaBottomLine = new LineRenderer({
      center: this.pointCenter,
      scale: this.config.geoProjectionScale,
      data: chinaGeoData,
      material: new THREE.LineBasicMaterial({
        color: 0x3f82cd, // 蓝色
        transparent: true,
        opacity: 0.4, // 更低的不透明度
      }),
      renderOrder: 3, // 低于主线条
    })

    return { china, chinaLine, chinaBottomLine }
  }
  /**
   * 创建浙江省地图及其相关元素
   * 负责创建浙江省地图及其相关元素，包括顶部地图、轮廓线等
   * @returns 包含浙江省地图、顶部地图和轮廓线的对象
   */
  createZheJiang() {
    const zhejiangGeoData = this.assets.instance!.getResource('china-province')
    const [topFaceMaterial, sideMaterial] = createProvinceMaterial({
      assets: this.assets,
      time: this.time,
    })
    this.focusMapTopMaterial = topFaceMaterial
    // this.focusMapSideMaterial = sideMaterial

    // 创建浙江省主体地图（带深度的3D效果）
    const zhejiang = new ExtrudedGeoMapRenderer(
      {
        assets: this.assets,
        time: this.time,
      },
      {
        center: this.pointCenter,
        scale: this.config.geoProjectionScale,
        position: new THREE.Vector3(0, 0, 0.11),
        data: zhejiangGeoData,
        depth: 0.5,
        topFaceMaterial: topFaceMaterial,
        sideMaterial: sideMaterial,
        renderOrder: 9,
      },
    )

    const topMapMaterial = new THREE.MeshStandardMaterial({
      color: 16777215, // 白色
      transparent: true,
      opacity: 0.5,
    })
    // 应用渐变着色器
    new GradientShader(topMapMaterial, { uColor1: 0x2a6e92, uColor2: 0x102736 })

    this.defaultMaterial = topMapMaterial
    // 创建发光材质（克隆自默认材质）
    this.defaultLightMaterial = this.defaultMaterial.clone()
    this.defaultLightMaterial.emissive.setHex(0xb112d) // 蓝绿色
    // this.defaultLightMaterial.emissiveIntensity = 3.5

    // 创建浙江省顶部地图（平面）
    const zhejiangTop = new GeoMapRenderer({
      center: this.pointCenter,
      scale: this.config.geoProjectionScale,
      position: new THREE.Vector3(0, 0, 0.72),
      data: zhejiangGeoData,
      material: topMapMaterial,
      renderOrder: 3,
    })

    // 将网格添加到可交互元素列表
    zhejiangTop.mapGroup.children.map(provinceGroup => {
      provinceGroup.children.map(child => {
        child.type === 'Mesh' && this.eventElement.push(child)
      })
    })

    // 创建浙江省轮廓线材质
    this.zhejiangLineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff, // 白色
      transparent: true,
      opacity: 0, // 不透明度
      fog: false, // 不受雾化影响
    })
    // 创建浙江省轮廓线
    const zhejiangLine = new LineRenderer({
      center: this.pointCenter,
      scale: this.config.geoProjectionScale,
      data: zhejiangGeoData,
      material: this.zhejiangLineMaterial,
      renderOrder: 3,
    })
    zhejiangLine.lineGroup.position.z += 0.73

    return { zhejiang, zhejiangTop, zhejiangLine }
  }
  // 创建动画视频
  createAnimateVideo() {
    const video1 = createAnimateVideoItem(
      '.map-gd-video1',
      new THREE.Vector3(11, 0.4, 1),
    )
    const video2 = createAnimateVideoItem(
      '.map-gd-video2',
      new THREE.Vector3(-11, 0.4, 2),
    )
    const videoGroup = new THREE.Group()
    if (video1) videoGroup.add(video1)
    if (video2) videoGroup.add(video2)
    this.scene.add(videoGroup)
  }
  /**
   * 创建交互事件
   * 处理地图元素的鼠标交互事件，包括悬停、点击等
   * 实现地图元素高亮、相机移动等交互效果
   */
  createEvent() {
    // 存储当前悬停的元素集合
    const hoveredElements: THREE.Object3D<THREE.Object3DEventMap>[] = []

    // 应用默认材质的函数
    const applyDefaultMaterial = (object: THREE.Object3D) => {
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          // eslint-disable-next-line no-extra-semi
          ; (child as THREE.Mesh).material = this.defaultMaterial!
        }
      })
    }

    // 应用高亮材质的函数
    const applyHighlightMaterial = (object: THREE.Object3D) => {
      object.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          // eslint-disable-next-line no-extra-semi
          ; (child as THREE.Mesh).material = this.defaultLightMaterial!
        }
      })
    }

    // 为每个可交互元素添加事件监听
    this.eventElement.forEach(element => {
      // 鼠标按下事件 - 移动相机到点击位置
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const el = element as any

      // 鼠标悬停事件 - 高亮显示元素
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      el.addEventListener('mouseover', (event: any) => {
        const parent = event.target.parent

        if (parent && !hoveredElements.includes(parent)) {
          hoveredElements.push(parent)
        }
        document.body.style.cursor = 'pointer'
        if (parent) {
          applyHighlightMaterial(parent)
        }
      })

      // 鼠标离开点击事件 - 恢复默认显示
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      el.addEventListener('mouseout', (event: any) => {
        const parent = event.target.parent
        if (parent) {
          // 从悬停元素列表中移除当前元素
          const filteredElements = hoveredElements.filter(
            element => element.userData.name !== parent.userData.name,
          )
          // 更新悬停元素列表
          hoveredElements.length = 0
          filteredElements.forEach(el => hoveredElements.push(el))

          // 应用默认材质
          applyDefaultMaterial(parent)
          document.body.style.cursor = 'default'
        }
      })
    })
  }
  /**
   * 创建飞线效果
   * 在地图上绘制从中心点（杭州）到各城市的飞线动画
   * 使用二次贝塞尔曲线实现弧线效果，纹理动画实现飞行效果
   */
  createFlyLine() {
    this.flyLineGroup = new THREE.Group()
    this.flyLineGroup.name = 'flyLineGroup'
    this.flyLineGroup.visible = false
    this.scene.add(this.flyLineGroup)

    // 获取飞线纹理并设置属性
    const flyLineTexture = this.assets.instance!.getResource('flyLine')
    flyLineTexture.colorSpace = THREE.SRGBColorSpace
    flyLineTexture.wrapS = THREE.RepeatWrapping
    flyLineTexture.wrapT = THREE.RepeatWrapping
    flyLineTexture.repeat.set(1, 1)

    // 设置飞线参数
    const tubeRadius = 0.03 // 管道半径
    const tubularSegments = 32 // 管道分段数
    const radiusSegments = 8 // 管道横截面分段数
    const isClosed = false // 是否闭合曲线

    const [centerX, centerY] = this.geoProjection(this.flyLineCenter)!
    const centerPoint = new THREE.Vector3(centerX, -centerY, 0)

    const flyLineMaterial = new THREE.MeshBasicMaterial({
      map: flyLineTexture,
      alphaMap: flyLineTexture,
      color: 0x2a6f72, // 蓝色
      transparent: true,
      fog: false,
      blending: THREE.AdditiveBlending, // 加法混合增强亮度
    })

    this.time.on('tick', () => {
      flyLineTexture.offset.x -= 0.006 // 纹理偏移实现流动效果
    })

    ZheJiangCityInfo.filter(v => v.value > 40).map(cityInfo => {
      const [targetX, targetY] = this.geoProjection(
        cityInfo.centroid as [number, number],
      )!
      const targetPoint = new THREE.Vector3(targetX, -targetY, 0)

      // 计算中间一个位置顶点
      const middlePoint = new THREE.Vector3()
      // 计算中间点
      middlePoint.addVectors(centerPoint, targetPoint).multiplyScalar(0.5)
      middlePoint.setZ(3)
      const bezierCurve = new THREE.QuadraticBezierCurve3(
        centerPoint,
        middlePoint,
        targetPoint,
      )

      const tubeGeometry = new THREE.TubeGeometry(
        bezierCurve,
        tubularSegments,
        tubeRadius,
        radiusSegments,
        isClosed,
      )

      const flyLineMesh = new THREE.Mesh(tubeGeometry, flyLineMaterial)
      flyLineMesh.rotation.x = -Math.PI / 2 // 旋转到水平面
      flyLineMesh.position.set(0, 0.94, 0) // 定位高度
      flyLineMesh.renderOrder = 21 // 设置渲染优先级

      this.flyLineGroup!.add(flyLineMesh)
    })
    // 创建焦点效果（杭州中心点特效）
    this.createFlyLineFocus()
  }
  /**
   * 创建飞线焦点效果
   * 在地图上绘制从中心点（杭州）到各城市的飞线动画
   * 使用二次贝塞尔曲线实现弧线效果，纹理动画实现飞行效果
   */
  createFlyLineFocus() {
    this.flyLineFocusGroup = new THREE.Group()
    this.flyLineFocusGroup.name = 'flyLineFocusGroup'
    this.flyLineFocusGroup.visible = false
    this.flyLineFocusGroup.rotation.x = -Math.PI / 2 // 旋转到水平面
    this.scene.add(this.flyLineFocusGroup)

    const [centerX, centerY] = this.geoProjection(this.flyLineCenter)!
    this.flyLineFocusGroup.position.set(centerX, 0.942, centerY)

    const focusTexture = this.assets.instance!.getResource('flyLineFocus')
    const focusMaterial = new THREE.MeshBasicMaterial({
      map: focusTexture,
      alphaMap: focusTexture,
      color: 0xffffff, // 白色
      transparent: true,
      blending: THREE.AdditiveBlending, // 加法混合增强亮度
      fog: false,
      depthTest: false,
    })

    const focusMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 1.3),
      focusMaterial,
    )
    focusMesh.scale.set(0, 0, 0) // 初始大小为0

    const focusMesh2 = focusMesh.clone()
    focusMesh2.material = focusMaterial.clone()

    this.flyLineFocusGroup.add(focusMesh, focusMesh2)

    gsap.to(focusMesh.material, {
      opacity: 0, // 透明度从1到0
      repeat: -1, // 无限循环
      yoyo: false, // 不往返
      duration: 1, // 1秒周期
    })

    gsap.to(focusMesh.scale, {
      x: 1.5,
      y: 1.5,
      z: 1.5,
      repeat: -1, // 无限循环
      yoyo: false, // 不往返
      duration: 1, // 1秒周期
    })

    gsap.to(focusMesh2.material, {
      delay: 0.5, // 延迟0.5秒
      opacity: 0, // 透明度从1到0
      repeat: -1, // 无限循环
      yoyo: false, // 不往返
      duration: 1, // 1秒周期
    })
    gsap.to(focusMesh2.scale, {
      delay: 0.5, // 延迟0.5秒
      x: 1.5,
      y: 1.5,
      z: 1.5,
      repeat: -1, // 无限循环
      yoyo: false, // 不往返
      duration: 1, // 1秒周期
    })
  }
  // 创建粒子特效
  createParticles() {
    this.particles = new Particles(this, {
      num: 10,
      range: 30,
      dir: 'up',
      speed: 0.05,
      material: new THREE.PointsMaterial({
        map: Particles.createTexture(),
        size: 1,
        color: 61166,
        transparent: true,
        opacity: 1,
        depthTest: false,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    })
    this.particles.instance!.position.set(0, 0, 0)
    this.particles.instance!.rotation.x = -Math.PI / 2
    this.particles.setParent(this.scene)
    this.particles.enable = false
    this.particles.instance!.visible = false
  }
  // 创建柱状图
  createBar() {
    const cityList = ZheJiangCityInfo.filter(v => v.value > 40)
    const barGroup = new THREE.Group()
    barGroup.name = 'barGroup'
    this.scene.add(barGroup)

    const baseSize = 0.7
    const maxHeight = 2.8
    const maxValue = cityList[0].value

    // 为每个城市创建柱状图
    cityList.map((cityInfo, index) => {
      // 计算柱高（根据数值归一化）
      const barHeight = maxHeight * (cityInfo.value / maxValue)

      // 创建柱状图材质（带渐变）
      const barMaterial = new THREE.MeshBasicMaterial({
        color: 16777215, // 白色
        transparent: true,
        opacity: 0,
        depthTest: false,
        fog: false,
      })

      // 应用不同颜色渐变（前4名和后3名使用不同颜色）
      new GradientShader(barMaterial, {
        uColor1: index > 3 ? 16506760 : 5291006, // 黄色 : 蓝色
        uColor2: index > 3 ? 16776948 : 7863285, // 浅黄色 : 浅蓝色
        size: barHeight,
        dir: 'y',
      })

      // 创建柱状图几何体
      const barGeometry = new THREE.BoxGeometry(
        0.1 * baseSize,
        0.1 * baseSize,
        barHeight,
      )
      barGeometry.translate(0, 0, barHeight / 2) // 上移几何体，使底部对齐

      // 创建柱状图网格
      const barMesh = new THREE.Mesh(barGeometry, barMaterial)
      barMesh.renderOrder = 5
      barMesh.name = 'barMesh'

      // 获取城市坐标并设置位置
      const [x, y] = this.geoProjection(cityInfo.centroid as [number, number])!
      barMesh.position.set(x, -y, 0.95) // 将柱状图放置在地图上方
      barMesh.scale.set(1, 1, 0) // 初始缩放为0，待动画展示

      // 创建柱状图底部光环
      const guangquan = this.createQuan(new THREE.Vector3(x, 0.94, y))

      // 创建柱状图辉光效果
      const huiguang = this.createHUIGUANG(
        barHeight,
        index > 3 ? 16776948 : 7863285, // 黄色 : 蓝色
      )
      barMesh.add(...huiguang)

      // 添加到柱状图组
      barGroup.add(barMesh)

      // 设置组旋转
      barGroup.rotation.x = -Math.PI / 2

      // 创建城市标签
      const cityLabel = createProvinceBarLabel(
        cityInfo,
        index,
        new THREE.Vector3(x, -y, 1.6 + barHeight), // 将标签放置在柱状图顶部
        this.label3d,
        this.labelGroup!,
      )

      // 保存引用用于动画
      this.allBar.push(barMesh)
      this.allBarMaterial.push(barMaterial)
      this.allGuangquan.push(guangquan)
      this.allProvinceLabel.push(cityLabel)
    })

    // 添加柱状图组到场景
    this.scene.add(barGroup)
  }
  createQuan(position: THREE.Vector3) {
    // 获取光环纹理
    const texture1 = this.assets.instance!.getResource('guangquan1')
    const texture2 = this.assets.instance!.getResource('guangquan2')

    // 创建光环几何体
    const planeGeometry = new THREE.PlaneGeometry(0.5, 0.5)

    // 创建外层光环材质
    const outerRingMaterial = new THREE.MeshBasicMaterial({
      color: 16777215, // 白色
      map: texture1,
      alphaMap: texture1,
      opacity: 1,
      transparent: true,
      depthTest: false,
      fog: false,
      blending: THREE.AdditiveBlending, // 加法混合，增强亮度
    })

    // 创建内层光环材质
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: 16777215, // 白色
      map: texture2,
      alphaMap: texture2,
      opacity: 1,
      transparent: true,
      depthTest: false,
      fog: false,
      blending: THREE.AdditiveBlending, // 加法混合，增强亮度
    })

    // 创建外层和内层光环网格
    const outerRing = new THREE.Mesh(planeGeometry, outerRingMaterial)
    const innerRing = new THREE.Mesh(planeGeometry, innerRingMaterial)

    // 设置渲染顺序，确保透明度正确
    outerRing.renderOrder = 6
    innerRing.renderOrder = 6

    // 旋转到水平位置
    outerRing.rotateX(-Math.PI / 2)
    innerRing.rotateX(-Math.PI / 2)

    // 设置位置
    outerRing.position.copy(position)
    innerRing.position.copy(position)
    innerRing.position.y -= 0.001 // 内层微微下移，防止z-fighting

    // 初始缩放为0，待动画展示
    outerRing.scale.set(0, 0, 0)
    innerRing.scale.set(0, 0, 0)

    // 创建光环组并添加两个环
    this.quanGroup = new THREE.Group()
    this.quanGroup.add(outerRing, innerRing)
    this.scene.add(this.quanGroup)

    // 添加旋转动画
    this.time.on('tick', () => {
      outerRing.rotation.z += 0.05 // 外层光环旋转
    })

    return this.quanGroup
  }
  /**
   * 创建辉光效果
   * 在柱状图周围创建三个平面，形成辉光效果
   * @param height 辉光高度
   * @param color 辉光颜色
   * @returns 辉光网格数组
   */
  createHUIGUANG(height: number, color: number) {
    // 创建辉光几何体
    const huiguangGeometry = new THREE.PlaneGeometry(0.35, height)
    huiguangGeometry.translate(0, height / 2, 0) // 上移几何体，使底部对齐

    // 获取辉光纹理
    const huiguangTexture = this.assets.instance!.getResource('huiguang')
    huiguangTexture.colorSpace = THREE.SRGBColorSpace
    huiguangTexture.wrapS = THREE.RepeatWrapping
    huiguangTexture.wrapT = THREE.RepeatWrapping

    // 创建辉光材质
    const huiguangMaterial = new THREE.MeshBasicMaterial({
      color: color,
      map: huiguangTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, // 加法混合，增强亮度
    })

    // 创建第一个辉光平面
    const huiguang1 = new THREE.Mesh(huiguangGeometry, huiguangMaterial)
    huiguang1.renderOrder = 10
    huiguang1.rotateX(Math.PI / 2)

    // 复制并旋转创建第二个和第三个辉光平面
    const huiguang2 = huiguang1.clone()
    const huiguang3 = huiguang1.clone()

    // 旋转第二个和第三个平面，形成三角形分布
    huiguang2.rotateY((Math.PI / 180) * 60) // 旋转60度
    huiguang3.rotateY((Math.PI / 180) * 120) // 旋转120度

    // 返回三个辉光平面
    return [huiguang1, huiguang2, huiguang3]
  }
  destroy() {
    super.destroy()
  }
}

export default defineComponent({
  name: 'SuperMapVue2',
  data() {
    return {
      animate1Src: Animate1,
      animate2Src: Animate2,
      mapControl: null as MapControlStudy | null
    }
  },
  mounted() {
    const canvas = this.$refs.canvasRef as HTMLCanvasElement
    if (canvas) {
      this.mapControl = new MapControlStudy(canvas, {
        centroid: [104.113164,37.570667],
        geoProjectionScale: 9, 
      })
    }
  },
  beforeDestroy() {
    if (this.mapControl) {
      this.mapControl.destroy()
    }
  }
})
</script>

<style>
/* Dynamic 3D Label Styles - Global (not scoped) because they are dynamically appended to DOM */
.zj-map .other-label {
  transform: translateY(200%);
  opacity: 0;
  background: none;
}

.zj-map .china-label {
  color: #fff;
  font-size: 10px;
}

.zj-map .china-label .other-label {
  display: flex;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
}

.zj-map .china-label .label-icon {
  width: 10px;
  height: 10px;
  margin-right: 5px;
}

.zj-map .zhejiang-label {
  padding: 5px;
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 4.5px;
  -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 20%, rgba(255, 255, 255, 0.3));
}

.zj-map .zhejiang-label .other-label {
  display: flex;
  flex-direction: column;
}

.zj-map .zhejiang-label span:last-child {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0px;
  color: #a7d5ef;
}

.zj-map .decoration-label {
  /* Add explicit color if needed, though not in original LESS */
}

.zj-map .decoration-label.reflect {
  -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 20%, rgba(255, 255, 255, 0.3));
}

.provinces-label .number {
  color: #fff;
  font-size: 30px;
  font-weight: 700;
}

.provinces-label .unit {
  color: #fff;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.5;
  padding-left: 5px;
}

.provinces-label .name {
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.provinces-label .name span {
  display: block;
}

.provinces-label .en {
  color: #fff;
  font-size: 10px;
  opacity: 0.5;
  font-weight: 700;
}

.provinces-label .no {
  color: #7efbf6;
  text-shadow: 0 0 5px #7efbf6, 0 0 10px #7efbf6;
  font-size: 30px;
  font-weight: 700;
}

.provinces-label.yellow .no {
  color: #fef99e !important;
  text-shadow: 0 0 5px #fef99e, 0 0 10px #fef99e !important;
}
</style>

<style scoped>
.zj-map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>