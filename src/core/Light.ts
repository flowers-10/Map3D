import * as THREE from "three";
import ThreeInstance from "./ThreeInstance";
import BaseThree from "./BaseThree";
import { LightItems } from "./types/ConfigOptType";

export default class Light extends BaseThree{
    private light;
    constructor(config: LightItems[],instance:ThreeInstance) {
        super(instance)
        this.light = new THREE.Group();
        this.light.name = "light-group";
        this.setLight(config);
    }
    // 设置灯光
    setLight(config: LightItems[]) {
        if (Array.isArray(config) && !config.length)
            return console.error("please add light configuration");
        let light: any;
        let lightHelper: any;
        config.forEach(
            ({
                color,
                groundColor,
                type,
                intensity,
                distance,
                angle,
                penumbra,
                position,
                decay,
                helper,
            }) => {
                switch (type) {
                    case "point":
                        light = new THREE.PointLight(color, intensity, distance);
                        if (helper) {
                            lightHelper = new THREE.PointLightHelper(light, 0.5);
                        }
                        break;
                    case "ambient":
                        light = new THREE.AmbientLight(color, intensity); // 环境光
                        break;
                    case "hemisphere":
                        light = new THREE.HemisphereLight(color, groundColor, intensity);
                        if (helper) {
                            lightHelper = new THREE.HemisphereLightHelper(light, 0.5);
                        }
                        break;
                    case "spot":
                        light = new THREE.SpotLight(
                            color,
                            intensity,
                            distance,
                            angle,
                            penumbra,
                            decay
                        );
                        if (helper) {
                            lightHelper = new THREE.SpotLightHelper(light, 0.5);
                        }
                        break;
                    default:
                        break;
                }
                light.position.set(position?.x, position?.y, position?.z);
                if (light.isSpotLight) {
                    this.light.add(light.target);
                }
                light ? this.light.add(light) : null;
                lightHelper ? this.light.add(lightHelper) : null;
            }
        );
        this.scene.add(this.light);
    }
}
