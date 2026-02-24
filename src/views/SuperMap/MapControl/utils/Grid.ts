import * as THREE from 'three'
import TimeManager from '../MapApplication/TimeManager'
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * 网格选项接口
 */
interface GridOptions {
  position: THREE.Vector3 // 网格位置
  gridSize: number // 网格大小
  gridDivision: number // 网格分区数
  gridColor: number // 网格颜色
  shapeSize: number // 形状大小
  shapeColor: number // 形状颜色
  pointSize: number // 点大小
  pointColor: number // 点颜色
  pointLayout: {
    // 点阵排布
    row: number // 行数
    col: number // 列数
  }
  pointBlending: THREE.Blending // 点混合模式
  diffuse: boolean // 是否启用扩散效果
  diffuseSpeed: number // 扩散速度
  diffuseColor: number // 扩散颜色
  diffuseWidth: number // 扩散宽度
  diffuseDir?: number // 扩散方向
}

const defaultOptions = {
  position: new THREE.Vector3(0, 0, 0),
  gridSize: 100,
  gridDivision: 20,
  gridColor: 2635578,
  shapeSize: 1,
  shapeColor: 9345950,
  pointSize: 0.2,
  pointColor: 2635578,
  pointLayout: {row: 200, col: 200},
  pointBlending: THREE.NormalBlending,
  diffuse: false,
  diffuseSpeed: 15,
  diffuseColor: 9345950,
  diffuseWidth: 10,
}

class Grid {
  scene: THREE.Scene
  time: TimeManager
  options: GridOptions
  instance?: THREE.Group<THREE.Object3DEventMap>
  constructor(
    {scene, time}: {scene: THREE.Scene; time: TimeManager},
    customOptions: Partial<GridOptions>,
  ) {
    this.scene = scene
    this.time = time
    this.options = Object.assign({}, defaultOptions, customOptions)
    this.init()
  }
  init() {
    const gridGroup = new THREE.Group()
    gridGroup.name = 'Grid'

    const gridHelper = this.createGridHelp()
    const shapes = this.createShapes()
    const points = this.createPoint()

    gridGroup.add(gridHelper, shapes, points)

    this.instance = gridGroup
    this.scene.add(gridGroup)
  }
  // 创建网格辅助线
  createGridHelp() {
    const {gridSize, gridDivision, gridColor} = this.options
    return new THREE.GridHelper(gridSize, gridDivision, gridColor, gridColor)
  }
  // 创建多个加号形状
  createShapes() {
    const {gridSize, gridDivision, shapeSize, shapeColor} = this.options
    const cellSize = gridSize / gridDivision // 每个网格的大小
    const halfGridSize = gridSize / 2 // 网格的一半大小
    const shapeMaterial = new THREE.MeshBasicMaterial({
      color: shapeColor,
      side: THREE.DoubleSide,
    })
    // 创建几何体数组
    const geometries = []

    for (let row = 0; row < gridDivision + 1; row++) {
      for (let col = 0; col < gridDivision + 1; col++) {
        const plusGeometry = this.createPlus(shapeSize)
        plusGeometry.translate(
          -halfGridSize + row * cellSize,
          -halfGridSize + col * cellSize,
          0,
        )
        geometries.push(plusGeometry)
      }
    }
    const mergedGeometry = mergeGeometries(geometries)
    const shapeMesh = new THREE.Mesh(mergedGeometry, shapeMaterial)

    shapeMesh.renderOrder = -1
    shapeMesh.rotateX(-Math.PI / 2)
    shapeMesh.position.y += 0.01

    return shapeMesh
  }
  // 创建加号形状
  createPlus(size: number) {
    const lineWidth = size / 6 / 3 // 宽
    const armLength = size / 3 // 长

    // 加号形状的顶点
    const vertices = [
      new THREE.Vector2(-armLength, -lineWidth), // 外左下
      new THREE.Vector2(-lineWidth, -lineWidth), // 内左下
      new THREE.Vector2(-lineWidth, -armLength),
      new THREE.Vector2(lineWidth, -armLength),
      new THREE.Vector2(lineWidth, -lineWidth),
      new THREE.Vector2(armLength, -lineWidth),
      new THREE.Vector2(armLength, lineWidth),
      new THREE.Vector2(lineWidth, lineWidth),
      new THREE.Vector2(lineWidth, armLength),
      new THREE.Vector2(-lineWidth, armLength),
      new THREE.Vector2(-lineWidth, lineWidth),
      new THREE.Vector2(-armLength, lineWidth),
    ]
    const shape = new THREE.Shape(vertices)
    return new THREE.ShapeGeometry(shape, 24)
  }
  // 创建点
  createPoint() {
    const {
      gridSize,
      pointSize,
      pointColor,
      pointBlending,
      pointLayout,
      diffuse,
    } = this.options
    const rows = pointLayout.row // 点阵行数
    const cols = pointLayout.col // 点阵列数
    const vertices = new Float32Array(rows * cols * 3) // 顶点数组

    // 生成点阵
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (row / (rows - 1)) * gridSize - gridSize / 2
        const y = 0
        const z = (col / (cols - 1)) * gridSize - gridSize / 2

        const index = (row * cols + col) * 3
        vertices[index] = x
        vertices[index + 1] = y
        vertices[index + 2] = z
      }
    }

    // 创建几何体和材质
    const pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3),
    )

    const pointMaterial = new THREE.PointsMaterial({
      color: pointColor,
      size: pointSize,
      blending: pointBlending,
    })

    const point = new THREE.Points(pointGeometry, pointMaterial)

    if (diffuse) {
      this.diffuseShader(pointMaterial)
    }
    return point
  }
  // 应用扩散着色器
  diffuseShader(material: THREE.PointsMaterial) {
    const {gridSize, diffuseSpeed, diffuseColor, diffuseWidth, diffuseDir} =
      this.options
    let shaderProgram: THREE.WebGLProgramParametersWithUniforms | null = null
    // 给材质添加着色器
    material.onBeforeCompile = shader => {
      shaderProgram = shader
      // 添加自定义 uniform 变量
      shader.uniforms = {
        ...shader.uniforms,
        uTime: {value: 0},
        uSpeed: {value: diffuseSpeed},
        uWidth: {value: diffuseWidth},
        uColor: {value: new THREE.Color(diffuseColor)},
        uDir: {value: diffuseDir || 0}, // 扩散方向：0-圆形扩散，1-横向扩散
      }

      // 修改顶点着色器，添加变量传递
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
        `,
      )

      // 修改片元着色器，添加变量声明
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uWidth;
        uniform vec3 uColor;
        uniform float uDir;
        varying vec3 vPosition;

        void main() {
        `,
      )

      // 实现扩散效果的着色器代码
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `
        #ifdef OPAQUE
        diffuseColor.a = 1.0;
        #endif

        #ifdef USE_TRANSMISSION
        diffuseColor.a *= material.transmissionAlpha;
        #endif

        // 计算扩散半径
        float radius = uTime * uSpeed;

        // 光环宽度
        float width = min(uWidth, uTime * 5.0);

        // 几何中心点
        vec2 center = vec2(0.0, 0.0);

        // 距离圆心的距离
        float distanceFromCenter = 0.0;

        // 根据扩散方向决定使用的坐标和计算方式
        if(uDir == 1.0) {
          // 横向扩散 - 只考虑x轴方向
          distanceFromCenter = abs(vPosition.x);
        } else {
          // 圆形扩散 - 考虑xz平面
          distanceFromCenter = distance(vPosition.xz, center);
        }

        // 光环扩散效果实现
        if(distanceFromCenter > radius && distanceFromCenter < radius + 2.0 * width) {
          float percentage = 0.0;

          if(distanceFromCenter < radius + width) {
            // 内圈渐变
            percentage = (distanceFromCenter - radius) / width;
            outgoingLight = mix(outgoingLight, uColor, percentage);
          } else {
            // 外圈渐变
            percentage = (distanceFromCenter - radius - width) / width;
            outgoingLight = mix(uColor, outgoingLight, percentage);
          }

          gl_FragColor = vec4(outgoingLight, diffuseColor.a);
        } else {
          gl_FragColor = vec4(outgoingLight, diffuseColor.a);
        }
        `,
      )
    }

    // 添加时间更新
    const resetTime = gridSize / diffuseSpeed
    this.time.on('tick', deltaTime => {
      if (shaderProgram) {
        shaderProgram.uniforms.uTime.value += deltaTime
        // 当时间超过一定值时重置，形成循环动画
        if (shaderProgram.uniforms.uTime.value > resetTime) {
          shaderProgram.uniforms.uTime.value = 0
        }
      }
    })
  }
}

export default Grid
