import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as GeometryUtils from "three/examples/jsm/utils/GeometryUtils.js";
export const initThreeLine2 = () => {
  // Canvas
  const canvas = document.querySelector("canvas.webgl");

  // Scene
  const scene = new THREE.Scene();

  // Object
  const positions = [];
  const colors = [];

  const points = GeometryUtils.hilbert3D(
    new THREE.Vector3(0, 0, 0),
    20.0,
    1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
  );

  const spline = new THREE.CatmullRomCurve3(points);
  const divisions = Math.round(12 * points.length);
  const point = new THREE.Vector3();
  const color = new THREE.Color();

  for (let i = 0, l = divisions; i < l; i++) {
    const t = i / l;

    spline.getPoint(t, point);
    positions.push(point.x, point.y, point.z);

    color.setHSL(t, 1.0, 0.5, THREE.SRGBColorSpace);
    colors.push(color.r, color.g, color.b);
  }

  // Line2 ( LineGeometry, LineMaterial )

  const geometry = new LineGeometry();
  console.log(positions,999);
  geometry.setPositions(positions);
  geometry.setColors(colors);

  const matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 0.02, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    //resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true,
  });

  const line = new Line2(geometry, matLine);
  line.computeLineDistances();
  line.scale.set(1, 1, 1);
  scene.add(line);

  // Sizes
  const sizes = {
    width: innerWidth,
    height: innerHeight,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(
    40,
    sizes.width / sizes.height,
    1,
    1000
  );
  camera.position.set(-40, 0, 60);

  scene.add(camera);

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.minDistance = 10;
  controls.maxDistance = 500;
  /**
   * Animate
   */

  const tick = () => {
    // Update objects

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };
  tick();
};
