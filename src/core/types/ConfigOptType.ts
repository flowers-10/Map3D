type SourcesType = "TEXTURE" | "CUBE_TEXTURE" | "GLTF" | "MP3" | "FONT";
type ConfigType = "CHART" | "GAMES" | "APP";
type SizeType = "parent" | "window";
type PassType = "NONE" | "OUTLINE" | "BLOOM";
type LightType = "point" | "ambient" | "hemisphere" | "spot";

type PositionType = {
  x: number;
  y: number;
  z: number;
};

export type SourcesItems = {
  name: string;
  type: SourcesType;
  path: string;
  show: boolean;
};
export type LightItems = {
  type: LightType;
  color: string;
  intensity: number;
  distance?: number;
  helper: boolean;
  lightId: number;
  lightName: string;
  position?: PositionType;
  groundColor?: string;
  angle?: number;
  penumbra?: number;
  decay?: number;
};

export type SizeConfigType = {
  type: SizeType;
  id: string;
};
export type CameraConfig = {
  fov: number;
  near: number;
  far: number;
  position: PositionType;
  lookAt: boolean;
  controls: {
    show: boolean;
    enableDamping: boolean;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    enablePan: boolean;
  };
};

export type RendererConfig = {
  antialias: boolean;
  alpha: boolean;
  clearAlpha: number;
  clearColor: string;
};

export type BloomConfigType = {
  strength: number;
  radius: number;
  threshold: number;
};


export interface ConfigOptType {
  el: string;
  id: string;
  type: ConfigType;
  name: string;
  camera: CameraConfig;
  size: SizeConfigType;
  rendererPass: {
    type: PassType;
    outlineConfig: {};
    bloomConfig: BloomConfigType;
  };
  renderer: RendererConfig;
  light: LightItems[];
  sources: SourcesItems[];
}