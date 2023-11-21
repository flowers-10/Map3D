import * as THREE from "three";
import Experience from "../../ThreeMap3D";
import * as dat from "lil-gui";

export default class Light {
  constructor(config) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.light = new THREE.Group();
    this.light.name = "light-group";
    this.gui = new dat.GUI({ width: 340 });
    this.setLight(config);
  }

  setLight(config) {
    if (Array.isArray(config) && !config.length)
      return console.error("please add light configuration");
    let light;
    let lightHelper;
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
        light.position.set(position.x, position.y, position.z);
        if (light.isSpotLight) {
          this.light.add(light.target);
        }
        this.gui
        .add(light, "intensity")
        .min(0)
        .max(100)
        .step(1)
        .name("intensity");
        this.gui
        .add(light, "distance")
        .min(-10)
        .max(1000)
        .step(1)
        .name("distance");
        this.gui
        .add(light.position, "x")
        .min(-10)
        .max(10)
        .step(0.1)
        .name("x");
        this.gui
        .add(light.position, "y")
        .min(-100)
        .max(100)
        .step(0.1)
        .name("y");
        this.gui
        .add(light.position, "z")
        .min(-2)
        .max(100)
        .step(0.1)
        .name("z");
        this.light.add(light);
        this.light.add(lightHelper);
      }
    );

    this.scene.add(this.light);
  }
}
