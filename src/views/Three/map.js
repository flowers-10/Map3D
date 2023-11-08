import * as THREE from "three";
import * as d3 from "d3";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';

import jsonData from "../../assets/JSON/china1.json";

import * as dat from "lil-gui";

export const initThreeMap = () => {
  /**
   * Base
   */
  /**
   * Debug
   */
  const gui = new dat.GUI();

  // DOM
  const canvas = document.querySelector("canvas.webgl");
  const provinceInfo = document.querySelector("#provinceInfo");

  // Scene
  const scene = new THREE.Scene();

  /**
   * Object
   */
  // 墨卡托投影转换
  const createLine = (polygon, depth) => {
    const lineGeometry = new THREE.BufferGeometry();
    const pointArray = [];
    for (let i = 0; i < polygon.length; i++) {
      let [x, y] = projection(polygon[i]);
      pointArray.push(new THREE.Vector3(x, -y, depth));
    }
    lineGeometry.setFromPoints(pointArray);
    const lineMaterial = new THREE.LineBasicMaterial({ color: "#ffffff" });
    return new THREE.Line(lineGeometry, lineMaterial);
  };
  const projection = d3
    .geoMercator()
    .center([104.0, 37.5])
    .scale(80)
    .translate([0, 0]);

  // 地图材质颜色
  const COLOR_ARR = ["#0465BD", "#357bcb", "#3a7abd"];
  // 建一个空对象存放对象
  const map = new THREE.Object3D();
  const lines = new THREE.Object3D();
  const customUniforms = {
    uTime: { value: 0 },
  };
  jsonData.features.forEach((elem, index) => {
    // 定一个省份3D对象
    const province = new THREE.Object3D();
    // 每个的 坐标 数组
    const { coordinates } = elem.geometry;
    const color = COLOR_ARR[index % COLOR_ARR.length];
    // 循环坐标数组
    coordinates.forEach((multiPolygon) => {
      multiPolygon.forEach((polygon) => {
        const shape = new THREE.Shape();

        for (let i = 0; i < polygon.length; i++) {
          let [x, y] = projection(polygon[i]);

          if (i === 0) {
            shape.moveTo(x, -y);
          }
          shape.lineTo(x, -y);
        }

        const extrudeSettings = {
          depth: 4,
          bevelEnabled: true,
          bevelSegments: 1,
          bevelThickness: 0.2,
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // 平面部分材质
        const material = new THREE.MeshStandardMaterial({
          metalness: 1,
          color: color,
        });
        // 拉高部分材质
        const material1 = new THREE.MeshStandardMaterial({
          metalness: 1,
          roughness: 1,
          color: color,
          transparent:true,
        });
        material1.onBeforeCompile = (shader) => {
          // console.log(shader);
          shader.uniforms.uTime = customUniforms.uTime;
          shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
                    #include <common>
                    varying vec3 model_world;
                `
          );

          shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
                #include <begin_vertex>
                model_world = position;
            `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            `
                    #include <common>
                    varying vec3 model_world;
                    uniform float uTime;

                    float rand(float n) {
                      return fract(sin(n) * 43758.5453123);
                    }
                    
                    float noise(float p) {
                      float fl = floor(p);
                      float fc = fract(p);
                      return mix(rand(fl), rand(fl + 1.), fc);
                    }
                    
                `
          );

          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <output_fragment>",
            `
              #include <output_fragment>
              float Threshold = 20.;
              float noiseOffset = clamp(noise(model_world.x * 10. + sin(uTime) * 8.), 0., 1.);
              float strength = smoothstep(1., 0., (model_world.z + 0.2) / 4.4) * noiseOffset * 4.;
              gl_FragColor = vec4(gl_FragColor.xyz, strength);

            `
          );
        };

        const mesh = new THREE.Mesh(geometry, [material, material1]);
        // 设置高度将省区分开来
        if (index % 2 === 0) {
          mesh.scale.set(1, 1, 1.2);
        }

        // mesh.geometry.computeBoundingBox();
        // console.log(mesh.geometry.boundingBox, "boundingBox");
        
        // let { min, max } = mesh.geometry.boundingBox

        // console.log(min.z,max.z );
        // 给mesh开启阴影
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh._color = color;
        const line = createLine(
          polygon,
          // extrudeSettings.depth + 0.3
          index % 2 === 0
            ? extrudeSettings.depth * 1.2 + 0.3
            : extrudeSettings.depth + 0.3
        );
        lines.add(line);
        province.add(mesh);
      });
    });
    // 将geo的属性放到省份模型中
    province.properties = elem.properties;
    if (elem.properties.centorid) {
      const [x, y] = projection(elem.properties.centorid);
      province.properties._centroid = [x, y];
    }

    map.add(province);
  });

  scene.add(lines);
  scene.add(map);

  // PLANE
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x031837,
    metalness: 0,
    roughness: 1,
    opacity: 0.5,
    transparent: true,
  });
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000, 1, 1),
    groundMaterial
  );
  // ground.rotation.x = - Math.PI / 2;
  ground.position.z = 0;
  // ground.castShadow = true;
  ground.receiveShadow = true;

  scene.add(ground);

  /**
   * Lights
   */
  const pointLight = new THREE.PointLight(0xffffff, 3);
  pointLight.position.set(0, -80, 50);
  scene.add(pointLight);
  gui.add(pointLight.position, "x", -200, 200, 1).name("pointLightX");
  gui.add(pointLight.position, "y", -200, 200, 1).name("pointLightY");
  gui.add(pointLight.position, "z", -200, 200, 1).name("pointLightZ");
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
  scene.add(pointLightHelper);
  let ambientLight = new THREE.AmbientLight(0xffffff, 1); // 环境光
  scene.add(ambientLight);
  /**
   * Sizes
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  /**
   * Camera
   */
  // Base camera
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );
  camera.position.set(0, 0, 80);
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const eventOffset = {};
  function onMouseMove(event) {
    // 父级并非满屏，所以需要减去父级的left 和 top
    let { top, left, width, height } = canvas.getBoundingClientRect();
    let clientX = event.clientX - left;
    let clientY = event.clientY - top;

    mouse.x = (clientX / width) * 2 - 1;
    mouse.y = -(clientY / height) * 2 + 1;

    eventOffset.x = clientX;
    eventOffset.y = clientY;
    provinceInfo.style.left = eventOffset.x + 10 + "px";
    provinceInfo.style.top = eventOffset.y - 20 + "px";
  }

  window.addEventListener("mousemove", onMouseMove, false);

  /**
   * Bloom
   */
  // 后处理渲染图层（总共可后处理31层）
  const BLOOM_LAYER = 1;
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_LAYER);
  // 渲染场景的Pass
  const renderPass = new RenderPass(scene, camera);
  // bloomComposer效果合成器 产生辉光，但是不渲染到屏幕上
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false; // 不渲染到屏幕上
  bloomComposer.addPass(renderPass);
  // 最终真正渲染到屏幕上的效果合成器 finalComposer
  const finalComposer = new EffectComposer(renderer);
  finalComposer.addPass(renderPass);

  // 存储需要应用辉光效果的材质对象
  const materials = {

  };
  // 将未应用辉光效果的物体暗化
  function darkenNonBloomed(obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      // 保存原始材质
      materials[obj.uuid] = obj.material;
      // 应用暗化材质
      obj.material = darkMaterial;
    }
  }

  // 辉光Pass
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(
      renderer.domElement.offsetWidth,
      renderer.domElement.offsetHeight
    ),
    0.3, // 强度参数
    0.1, // 半径参数
    0.2 // 阈值参数
  );
  bloomComposer.addPass(bloomPass);

  // 恢复物体原始材质
  const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  function restoreMaterial(obj) {
    if (materials[obj.uuid]) {
      // 恢复原始材质
      obj.material = materials[obj.uuid];
      delete materials[obj.uuid];
    }
  }

  // 使用自定义着色器的Pass，实现叠加基础纹理和辉光纹理的效果
  const shaderPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null }, // 基础纹理
        bloomTexture: { value: bloomComposer.renderTarget2.texture }, // 辉光纹理
      },
      vertexShader: `
          varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }`, // 自定义顶点着色器
      fragmentShader: `
          uniform sampler2D baseTexture; // 基础纹理
          uniform sampler2D bloomTexture; // 辉光纹理，存储了辉光效果的颜色信息
          varying vec2 vUv;

          void main() {
            // 从基础纹理和辉光纹理中获取颜色值，并相加
            // texture2D函数用于从纹理中获取对应纹理坐标的颜色值。
            gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
          }
        `, // 自定义片元着色器
      defines: {}, // 自定义宏定义
    }),
    "baseTexture"
  );
  shaderPass.needsSwap = true;
  finalComposer.addPass(shaderPass);



  /**
   * Animate
   */
  const clock = new THREE.Clock();
  console.log("map children MESH:", map);
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update material
    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();

    //  raycaseter 判断标签内容
    raycaster.setFromCamera(mouse, camera);
    const objectsToTest = map.children;

    const intersects = raycaster.intersectObjects(objectsToTest, true);
    // // 自转动画
    // // map.rotation.z += 0.005;
    if (!intersects.length) {
      provinceInfo.style.display = "none";
    }
    for (const intersect of intersects) {
      // intersect.object.material.color.set('#0000ff')

      if (intersect.object instanceof THREE.Mesh) {
        if (intersect.object.parent) {
          if (intersect.object.parent.properties) {
            provinceInfo.style.display = "flex";
            provinceInfo.innerHTML = intersect.object.parent.properties?.name;
          }
        }
      }
    }
    for (const object of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === object)) {
        // object.material.color.set('#ff0000')
        // console.log(object);
      }
    }

    // Render
    // renderer.render(scene, camera);
    // 实现局部辉光
    // 1. 利用 darkenNonBloomed 函数将除辉光物体外的其他物体的材质转成黑色
    // scene.traverse(darkenNonBloomed);
    // 2. 用 bloomComposer 产生辉光
    bloomComposer.render();
    // 3. 将转成黑色材质的物体还原成初始材质
    scene.traverse(restoreMaterial);
    // 4. 用 finalComposer 作最后渲染
    finalComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};
