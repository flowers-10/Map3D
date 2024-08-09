import * as THREE from "three";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";
import { RendererConfig } from "./types/ConfigOptType";

export default class Renderer extends BaseThree{
    public instance: THREE.WebGLRenderer;

    constructor(config: RendererConfig, instance: ThreeInstance) {
        super(instance)
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: config.antialias,
            alpha: config.alpha,
        });
        this.setRenderer(config)
    }

    setRenderer(config:RendererConfig): void {
        // Renderer settings
        
        // this.instance.useLegacyLights = true
        // this.instance.toneMapping = THREE.CineonToneMapping
        // this.instance.toneMappingExposure = 1.75
        // this.instance.shadowMap.enabled = true
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.outputColorSpace = THREE.SRGBColorSpace;
        config.clearAlpha
            ? this.instance.setClearAlpha(config.clearAlpha)
            : this.instance.setClearAlpha(0);

        config.clearColor ? this.instance.setClearColor(config.clearColor) : null;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }
    info(message = "present memory:") {
        console.log(message, this.instance.info.memory);
    }

    resize() {
        this.instance.setSize(this.sizes?.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update() {
        this.instance.render(this.scene, this.camera?.instance);
    }

    dispose() {
        this.instance.clear();
        this.instance.setSize(0, 0);
        this.instance.dispose();
        this.info("cleared memory:");
    }
}
