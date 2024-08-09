import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeInstance from "./ThreeInstance";
import BaseThree from './BaseThree'
import { CameraConfig } from "./types/ConfigOptType";


export default class Camera extends BaseThree{
  private cameraConfig: CameraConfig;
  public controls: OrbitControls
  public instance: THREE.PerspectiveCamera;

   constructor(config: CameraConfig,instance: ThreeInstance) {
    super(instance)
    this.cameraConfig = config;
    this.instance = new THREE.PerspectiveCamera(
      this.cameraConfig.fov,
      this.sizes?.width / this.sizes?.height,
      this.cameraConfig.near,
      this.cameraConfig.far
    );
    this.controls = new OrbitControls(this.instance, this.canvas);

    this.setInstance()
    this.setControls()
  }
  setInstance() {
    this.instance.position.set(
      this.cameraConfig.position.x,
      this.cameraConfig.position.y,
      this.cameraConfig.position.z
    );
    if (this.cameraConfig.lookAt) {
      this.instance.lookAt(this.scene.position);
    }
    this.instance.updateProjectionMatrix();
    this.scene.add(this.instance);
  }
  setControls() {
    const controls = this.cameraConfig.controls
    this.controls.enableDamping = controls.enableDamping;
    this.controls.minPolarAngle = controls.minPolarAngle; 
    this.controls.maxPolarAngle = controls.maxPolarAngle; 
    this.controls.minAzimuthAngle = controls.minAzimuthAngle; 
    this.controls.maxAzimuthAngle = controls.maxAzimuthAngle; 
    this.controls.enablePan = controls.enablePan;
  }
  resize() {
    this.instance.aspect = this.sizes?.width / this.sizes?.height;
    this.instance.updateProjectionMatrix();
  }
  update() {
    this.controls?.update();
  }
  dispose() {
    this.controls?.dispose();
  }
}
