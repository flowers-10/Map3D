import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";
import { BloomConfigType } from "./types/ConfigOptType";

export default class BloomPass extends BaseThree {
  private renderer;
  private bloomLayer;
  private materials: any;
  private darkMaterial;
  private bloomComposer;
  private finalComposer;
  constructor(config: BloomConfigType, instance: ThreeInstance) {
    super(instance);
    this.renderer = instance.renderer.instance;
    this.bloomLayer = new THREE.Layers();
    this.materials = {};
    this.darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    this.bloomComposer = new EffectComposer(this.renderer);
    this.finalComposer = new EffectComposer(this.renderer);
    this.setBloomPass(config);
  }
  setBloomPass(config: BloomConfigType) {
    const BLOOM_LAYER = 1;
    this.bloomLayer.set(BLOOM_LAYER);
    const renderPass = new RenderPass(this.scene, this._camera);
    this.bloomComposer.renderToScreen = false;
    this.bloomComposer.addPass(renderPass);
    this.finalComposer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.renderer.domElement.offsetWidth,
        this.renderer.domElement.offsetHeight
      ),
      config.strength,
      config.radius,
      config.threshold
    );
    this.bloomComposer.addPass(bloomPass);

    // const shaderPass = new ShaderPass(
    //   new THREE.ShaderMaterial({
    //     uniforms: {
    //       baseTexture: { value: null },
    //       bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
    //     },
    //     vertexShader: `varying vec2 vUv;
    //     void main() {
    //     vUv = uv;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //     }`,
    //     fragmentShader: `uniform sampler2D baseTexture; 
    //       uniform sampler2D bloomTexture; 
    //       varying vec2 vUv;

    //       void main() {
    //         gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
    //       }`,
    //     defines: {},
    //   }),
    //   "baseTexture"
    // );
    // shaderPass.needsSwap = true;
    // this.finalComposer.addPass(shaderPass);
  }
  darkenNonBloomed = (obj: any) => {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material;
      obj.material = this.darkMaterial;
    }
  };
  restoreMaterial = (obj: any) => {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  };
  update() {
    this.scene.traverse(this.darkenNonBloomed);
    this.bloomComposer.render();
    this.scene.traverse(this.restoreMaterial);
    this.finalComposer.render();
  }
}
