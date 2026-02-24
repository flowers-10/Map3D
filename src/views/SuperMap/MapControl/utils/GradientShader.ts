import * as THREE from 'three'

/**
 * 渐变着色器类
 * 用于创建材质上的渐变效果，通过修改着色器代码实现沿特定轴向的颜色渐变
 */
class GradientShader {
  /** 着色器对象实例 */
  shader: THREE.WebGLProgramParametersWithUniforms | null
  /** 渐变配置参数 */
  config: {
    /** 渐变起始颜色 (十进制RGB值) */
    uColor1: number
    /** 渐变结束颜色 (十进制RGB值) */
    uColor2: number
    /** 渐变范围尺寸，影响渐变过渡的距离 */
    size: number
    /** 渐变方向 ('x', 'y', 或 'z' 轴) */
    dir: 'x' | 'y' | 'z'
  }

  /**
   * 创建渐变着色器实例
   * @param {THREE.Material} material - 需要应用渐变效果的材质
   * @param {Object} options - 渐变配置选项
   */
  constructor(
    material: THREE.Material,
    options?: Partial<GradientShader['config']>,
  ) {
    this.shader = null
    // 合并默认配置和传入配置
    this.config = Object.assign(
      {
        uColor1: 2781042, // 默认起始颜色
        uColor2: 860197, // 默认结束颜色
        size: 15, // 默认渐变尺寸
        dir: 'x' as const, // 默认沿X轴渐变
      },
      options || {},
    )
    this.init(material)
  }

  /**
   * 初始化着色器代码
   * @param {THREE.Material} material - 需要应用渐变的材质
   */
  init(material: THREE.Material) {
    const {
      uColor1: startColor,
      uColor2: endColor,
      dir: direction,
      size: gradientSize,
    } = this.config
    // 方向值映射表: x=1, y=2, z=3 (在着色器中使用)
    const directionMap: Record<'x' | 'y' | 'z', number> = {x: 1, y: 2, z: 3}

    // 在材质编译前修改着色器代码
    material.onBeforeCompile = shaderInfo => {
      // 添加自定义uniform变量到着色器
      shaderInfo.uniforms = {
        ...shaderInfo.uniforms,
        uColor1: {value: new THREE.Color(startColor)}, // 起始颜色
        uColor2: {value: new THREE.Color(endColor)}, // 结束颜色
        uDir: {value: directionMap[direction]}, // 渐变方向
        uSize: {value: gradientSize}, // 渐变尺寸
      }

      this.shader = shaderInfo

      // 修改顶点着色器 - 添加位置和透明度变量传递
      shaderInfo.vertexShader = shaderInfo.vertexShader.replace(
        'void main() {',
        `
                attribute float alpha;
                varying vec3 vPosition;  // 传递顶点位置到片元着色器
                varying float vAlpha;    // 传递透明度到片元着色器
                void main() {
                  vAlpha = alpha;
                  vPosition = position;
              `,
      )

      // 修改片元着色器 - 添加变量声明
      shaderInfo.fragmentShader = shaderInfo.fragmentShader.replace(
        'void main() {',
        `
                varying vec3 vPosition;  // 接收顶点位置
                varying float vAlpha;    // 接收透明度
                uniform vec3 uColor1;    // 渐变起始颜色
                uniform vec3 uColor2;    // 渐变结束颜色
                uniform float uDir;      // 渐变方向
                uniform float uSize;     // 渐变尺寸

                void main() {
              `,
      )

      // 修改片元着色器 - 实现渐变效果逻辑
      shaderInfo.fragmentShader = shaderInfo.fragmentShader.replace(
        '#include <opaque_fragment>',
        `
              #ifdef OPAQUE
              diffuseColor.a = 1.0;
              #endif

              // 处理透明度
              #ifdef USE_TRANSMISSION
              diffuseColor.a *= transmissionAlpha + 0.1;
              #endif

              // 初始化渐变颜色
              vec3 gradient = vec3(0.0, 0.0, 0.0);

              // 根据方向参数选择不同轴向的渐变计算
              if(uDir == 1.0) {
                // X轴渐变 - 使用顶点的X坐标进行插值
                gradient = mix(uColor1, uColor2, vPosition.x / uSize);
              } else if(uDir == 2.0) {
                // Z轴渐变 - 使用顶点的Z坐标进行插值
                gradient = mix(uColor1, uColor2, vPosition.z / uSize);
              } else if(uDir == 3.0) {
                // Y轴渐变 - 使用顶点的Y坐标进行插值
                gradient = mix(uColor1, uColor2, vPosition.y / uSize);
              }

              // 将渐变颜色应用到输出光照上
              outgoingLight = outgoingLight * gradient;

              // 输出最终颜色结果
              gl_FragColor = vec4(outgoingLight, diffuseColor.a);
              `,
      )
    }
  }
}

export default GradientShader
