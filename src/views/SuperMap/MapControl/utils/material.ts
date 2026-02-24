import * as THREE from 'three'
import {LoadAssets} from './infoData'
import TimeManager from '../MapApplication/TimeManager'

/**
 * 包括顶面材质和侧面材质，均应用了自定义着色器
 * @returns 包含顶面材质和侧面材质的数组
 */
export function createProvinceMaterial({
  assets,
  time,
}: {
  assets: LoadAssets
  time: TimeManager
}) {
  // 创建顶面材质（带渐变效果）
  const topMaterial = new THREE.MeshLambertMaterial({
    color: 16777215, // 白色
    transparent: true,
    opacity: 0,
    fog: false,
    side: THREE.DoubleSide,
  })

  // 自定义顶面着色器
  topMaterial.onBeforeCompile = shader => {
    // 添加自定义着色器参数
    shader.uniforms = {
      ...shader.uniforms,
      uColor1: {value: new THREE.Color(2780818)}, // 浅蓝色
      uColor2: {value: new THREE.Color(1058614)}, // 深蓝色
    }

    // 修改顶点着色器，添加位置和透明度传递
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
      attribute float alpha;
      varying vec3 vPosition;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        vPosition = position;
    `,
    )

    // 修改片元着色器，添加自定义变量和制服
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `
      varying vec3 vPosition;
      varying float vAlpha;
      uniform vec3 uColor1;
      uniform vec3 uColor2;

      void main() {
    `,
    )

    // 实现水平渐变效果
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
                    #ifdef OPAQUE
                    diffuseColor.a = 1.0;
                    #endif

                    // https://github.com/mrdoob/three.js/pull/22425
                    #ifdef USE_TRANSMISSION
                    diffuseColor.a *= transmissionAlpha + 0.1;
                    #endif
                    vec3 gradient = mix(uColor1, uColor2, vPosition.x/15.78); // 15.78

                    outgoingLight = outgoingLight*gradient;
                    float topAlpha = 0.5;
                    if(vPosition.z>0.3){
                      diffuseColor.a *= topAlpha;
                    }

                    gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
                    `,
    )
  }

  // 获取侧面纹理
  const sideTexture = assets.instance!.getResource('side')
  sideTexture.wrapS = THREE.RepeatWrapping
  sideTexture.wrapT = THREE.RepeatWrapping
  sideTexture.repeat.set(1, 1.5)
  sideTexture.offset.y += 0.065

  // 创建侧面材质（带流动纹理）
  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 16777215, // 白色
    map: sideTexture,
    fog: false,
    opacity: 0,
    side: THREE.DoubleSide,
  })

  // 动画效果：纹理流动
  time.on('tick', () => {
    sideTexture.offset.y += 0.005 // 纹理Y轴偏移，产生流动效果
  })

  // 自定义侧面着色器
  sideMaterial.onBeforeCompile = shader => {
    shader.uniforms = {
      ...shader.uniforms,
      uColor1: {value: new THREE.Color(2780818)}, // 浅蓝色
      uColor2: {value: new THREE.Color(2780818)}, // 浅蓝色
    }

    // 修改顶点着色器
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      `
                    attribute float alpha;
                    varying vec3 vPosition;
                    varying float vAlpha;
                    void main() {
                      vAlpha = alpha;
                      vPosition = position;
                  `,
    )

    // 修改片元着色器
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `
                      varying vec3 vPosition;
                      varying float vAlpha;
                      uniform vec3 uColor1;
                      uniform vec3 uColor2;

                      void main() {
                    `,
    )

    // 实现垂直渐变效果
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
                    #ifdef OPAQUE
                    diffuseColor.a = 1.0;
                    #endif

                    // https://github.com/mrdoob/three.js/pull/22425
                    #ifdef USE_TRANSMISSION
                    diffuseColor.a *= transmissionAlpha + 0.1;
                    #endif
                    vec3 gradient = mix(uColor1, uColor2, vPosition.z/1.2);

                    outgoingLight = outgoingLight*gradient;


                    gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
                    `,
    )
  }

  return [topMaterial, sideMaterial]
}
