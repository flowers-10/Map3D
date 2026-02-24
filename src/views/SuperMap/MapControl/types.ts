import * as THREE from 'three'
import {LoaderTypeValues} from '../const/loader'

export interface MapControlOptions {
  centroid: [number, number]
}

export type CameraManagerInstance =
  | THREE.PerspectiveCamera
  | THREE.OrthographicCamera
  | null

export interface AssetInfo {
  type: LoaderTypeValues
  name: string
  path: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

export interface FeatureCollection {
  type: string
  features: Feature[]
}

interface Feature {
  type: string
  properties: Properties
  geometry: Geometry
}

interface Geometry {
  type: string
  coordinates: [number, number][][][]
}

export interface Properties {
  adcode: number
  name: string
  center: [number, number]
  centroid: [number, number]
  childrenNum: number
  level: string
  parent: Parent
  subFeatureIndex: number
  acroutes: [number]
}

interface Parent {
  adcode: number
}

/**
 * 省份信息接口
 */
export interface ProvinceInfo {
  name: string
  center: [number, number]
  centroid: [number, number]
  hide?: boolean
  blur?: boolean
}
