<template>
  <div style="box-sizing: border-box; background: black">
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as AUTO from "three-auto";
import * as THREE from "three";
import ZhejiangJSON from "../../assets/JSON/Zhejiang.json";
import ChinaJSON from "../../assets/JSON/china1.json";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
const gsap = AUTO.ThreeAuto.gsap;

const canvasDom = ref();
const instance = ref<AUTO.ThreeAuto>();

const createFloor = (instance: AUTO.ThreeAuto) => {
  const opt = {
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
    pointLayout: { row: 200, col: 200 },
    diffuseColor: 0x2e8bd9, // 蓝色
    pointBlending: THREE.NormalBlending,
    // diffuseDir: 1, // 扩散方向：0-圆形扩散，1-横向扩散
  };
  // floor
  const oceanTexture = instance.resource!.items.get("ocean");
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  oceanTexture.colorSpace = THREE.SRGBColorSpace; // 设置颜色空间
  oceanTexture.wrapS = THREE.RepeatWrapping; // 水平方向重复纹理
  oceanTexture.wrapT = THREE.RepeatWrapping; // 垂直方向重复纹理
  oceanTexture.repeat.set(1, 1); // 设置纹理重复次数
  const floorMaterial = new THREE.MeshBasicMaterial({
    map: oceanTexture,
    opacity: 1,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0, -0.7, 0);
  instance.scene.add(floor);
  // grid
  const gridGroup = new THREE.Group();
  gridGroup.name = "Grid";

  const gridHelper = new THREE.GridHelper(
    opt.gridSize,
    opt.gridDivision,
    opt.gridColor,
    opt.gridColor
  );

  const cellSize = opt.gridSize / opt.gridDivision; // 每个网格的大小
  const halfGridSize = opt.gridSize / 2; // 网格的一半大小
  const shapeMaterial = new THREE.MeshBasicMaterial({
    color: opt.shapeColor,
    side: THREE.DoubleSide,
  });
  // 创建加号几何体数组
  const geometries = [];

  for (let row = 0; row < opt.gridDivision + 1; row++) {
    for (let col = 0; col < opt.gridDivision + 1; col++) {
      const lineWidth = opt.shapeSize / 6 / 3; // 宽
      const armLength = opt.shapeSize / 3; // 长

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
      ];
      const shape = new THREE.Shape(vertices);
      const plusGeometry = new THREE.ShapeGeometry(shape, 24);
      plusGeometry.translate(
        -halfGridSize + row * cellSize,
        -halfGridSize + col * cellSize,
        0
      );
      geometries.push(plusGeometry);
    }
  }
  const mergedGeometry = mergeGeometries(geometries);
  const shapeMesh = new THREE.Mesh(mergedGeometry, shapeMaterial);

  shapeMesh.renderOrder = -1;
  shapeMesh.rotateX(-Math.PI / 2);
  shapeMesh.position.y += 0.01;

  // 创建散点几何体和材质
  const rows = opt.pointLayout.row; // 点阵行数
  const cols = opt.pointLayout.col; // 点阵列数
  const pointVertices = new Float32Array(rows * cols * 3); // 顶点数组

  // 生成点阵
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = (row / (rows - 1)) * opt.gridSize - opt.gridSize / 2;
      const y = 0;
      const z = (col / (cols - 1)) * opt.gridSize - opt.gridSize / 2;

      const index = (row * cols + col) * 3;
      pointVertices[index] = x;
      pointVertices[index + 1] = y;
      pointVertices[index + 2] = z;
    }
  }
  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(pointVertices, 3)
  );

  const pointMaterial = new THREE.PointsMaterial({
    color: opt.pointColor,
    size: opt.pointSize,
    blending: opt.pointBlending,
  });

  const points = new THREE.Points(pointGeometry, pointMaterial);

  if (opt.diffuse) {
    let shaderProgram: THREE.WebGLProgramParametersWithUniforms | null = null;
    // 给材质添加着色器
    pointMaterial.onBeforeCompile = (shader) => {
      shaderProgram = shader;
      // 添加自定义 uniform 变量
      shader.uniforms = {
        ...shader.uniforms,
        uTime: { value: 0 },
        uSpeed: { value: opt.diffuseSpeed },
        uWidth: { value: opt.diffuseWidth },
        uColor: { value: new THREE.Color(opt.diffuseColor) },
        uDir: { value: 0 }, // 扩散方向：0-圆形扩散，1-横向扩散
      };

      // 修改顶点着色器，添加变量传递
      shader.vertexShader = shader.vertexShader.replace(
        "void main() {",
        `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
          `
      );

      // 修改片元着色器，添加变量声明
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
          uniform float uTime;
          uniform float uSpeed;
          uniform float uWidth;
          uniform vec3 uColor;
          uniform float uDir;
          varying vec3 vPosition;
  
          void main() {
          `
      );

      // 实现扩散效果的着色器代码
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
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
          `
      );
    };

    // 添加时间更新
    const resetTime = opt.gridSize / opt.diffuseSpeed;
    instance.time.on("tick", () => {
      if (shaderProgram) {
        shaderProgram.uniforms.uTime.value += instance.time.deltaTime;
        // 当时间超过一定值时重置，形成循环动画
        if (shaderProgram.uniforms.uTime.value > resetTime) {
          shaderProgram.uniforms.uTime.value = 0;
        }
      }
    });
  }
  gridGroup.add(gridHelper, shapeMesh, points);
  gridGroup.rotation.x = -Math.PI * 0.5;
  instance.scene.add(gridGroup);

  // animation
  const timeLine = gsap.timeline();
  timeLine.add(
    gsap.to(instance.camera.instance!.position, {
      duration: 2.5,
      x: -20.460391656828197,
      y: 19.30487264306655,
      z: 58.37802626943616,
      ease: "circ.out",
    })
  );

  timeLine.add(
    gsap.to(instance.camera.instance!.position, {
      duration: 2.5,
      x: 0.2515849818960619,
      y: -34.397744557047988,
      z: 7.647659671139275,
      ease: "circ.out",
    })
  );
};
onMounted(() => {
  instance.value = new AUTO.ThreeAuto(canvasDom.value, {
    id: "_scene",
    name: "Hello three auto",
    shadow: {
      show: true,
      width: 1000,
      height: 1000,
      color: "#000",
      opacity: 0.1,
      rotation: { x: 0, y: 0, z: 0 },
    },
    camera: {
      type: "PerspectiveCamera",
      fov: 45,
      near: 1,
      far: 10000,
      position: {
        x: -13.767695123014105,
        y: 0.990152163077308,
        z: 50.28228164159694,
      },
      lookAt: true,
      controls: {
        enable: true,
        enableDamping: true,
        enablePan: true,
      },
    },
    size: {
      type: "window",
    },
    renderer: {
      antialias: true,
      alpha: true,
      clearAlpha: 1,
      clearColor: "#000",
    },
    series: [
      {
        shadow: true,
        name: "轮廓地图",
        id: 0,
        type: "map",
        json: ZhejiangJSON,
        animation: true,
        animationDuration: 350,
        animationEasing: "power1.inOut",
        animationDelay: 0,
        selectedOffset: 2.5,
        eventName: "click",
        data: [],
        scale: {
          x: 0.8,
          y: 0.8,
          z: 1,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        tooltip: {
          className: "three-auto-tooltip",
          background: "rgba(255,255,255,1)",
          show: true,
          borderWidth: 1,
          padding: "15px 20px",
          hideDelay: 100,
          textStyle: {
            "font-size": "18px",
            color: "#000000",
            "font-weight": 400,
            "font-style": "normal",
          },
        },
        label: {
          type: "css3",
          show: true,
          distance: 1.3,
          rotation: {
            x: 0,
            y: 0,
            z: 0,
          },
          textStyle: {
            padding: "8px",
            "font-size": "20px",
            color: "#fff",
            bold: true,
            "font-weight": 400,
            "font-style": "normal",
          },
        },
        itemStyle: {
          depth: 1,
          bevelEnabled: false,
          bevelSegments: 1,
          bevelSize: 0,
          bevelThickness: 0,
          extrudeFaces: {
            material: "MeshNormalMaterial",
            color: "red",
            opacity: 1,
            metalness: 1,
            roughness: 1,
          },
          crossSection: {
            material: "MeshNormalMaterial",
            opacity: 1,
            color: "red",
          },
          lineStyle: {
            show: true,
            color: "#A0E5FF",
            width: 2,
          },
        },
      },
    ],
    resource: [
      {
        name: "ocean",
        type: "TEXTURE",
        path: "./floor/ocean-blue-bg.png",
        show: true,
      },
      {
        name: "side",
        type: "TEXTURE",
        path: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMxSURBVHgB7dZBDcJQFADBB/kCuHAgAQckHAA3Tf27aIXsjIjNXv7bfgyQdB0gSwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgbN2erwGaHACECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCECQCErfv7M0CTA4AwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYAwAYCw9fj+BmhyABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABB2Amb1BS2MWc5zAAAAAElFTkSuQmCC",
      },
    ],
    light: [
      {
        type: "ambient",
        color: "#fff",
        intensity: 5,
        lightName: "ambient-light",
      },
      {
        type: "directional",
        color: "#fff",
        intensity: 5,
        lightName: "directional-light",
        position: {
          x: -30,
          y: 6,
          z: -8,
        },
      },
    ],
    // postprocess: {
    //   type: 'moebius',
    // }
  });
  instance.value.scene.fog = new THREE.Fog(0x102736, 1, 50);
  instance.value.resource?.on("ready", () => {
    const children = instance.value?.series?.seriesGroup?.children;
    if (children) {
      children[0].children.forEach((item) => {
        item.children.forEach((item: any) => {
          if (item.type === "Mesh") {
            // 创建顶面材质（带渐变效果）
            const topMapMaterial = new THREE.MeshStandardMaterial({
              color: 16777215, // 白色
              transparent: true,
              opacity: 0.5,
            });
            const directionMap: Record<"x" | "y" | "z", number> = {
              x: 1,
              y: 2,
              z: 3,
            };
            const startColor = 2781042,
              endColor = 860197,
              gradientSize = 15,
              direction = "x";
            // 获取侧面纹理
            const sideTexture = instance.value?.resource?.items.get("side");
            sideTexture.wrapS = THREE.RepeatWrapping;
            sideTexture.wrapT = THREE.RepeatWrapping;
            sideTexture.repeat.set(1, 1.5);
            sideTexture.offset.y += 0.065;
            // 创建侧面材质（带流动纹理）
            const sideMaterial = new THREE.MeshStandardMaterial({
              color: 16777215, // 白色
              map: sideTexture,
              fog: false,
              opacity: 0,
              side: THREE.DoubleSide,
            });
            item.material = [topMapMaterial, sideMaterial];
            instance.value?.time.on("tick", () => {
              sideTexture.offset.y += 0.0001; // 纹理Y轴偏移，产生流动效果
            });
          }
        });
      });
    }

    createFloor(instance.value!)
  });
});
onBeforeUnmount(() => {
  instance.value?.scene?.remove();
  if (!instance.value) return;
  // (instance.value as any).dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
