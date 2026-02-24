import LilGui from './utils/lilGui'
import MapApplication from './MapControl/MapApplication/MapApplication'
import { MapControlOptions } from './MapControl/types'
import { ChinaProvinceInfo, LoadAssets, ZheJiangCityInfo } from './MapControl/utils/infoData'
import Grid from './MapControl/utils/Grid'
import PlaneMeshRotate from './MapControl/utils/PlaneMeshRotate'
import { initGsapTimeLine } from './MapControl/gsapTimeLine'
import GeoMapRenderer from './MapControl/utils/GeoMapRenderer'
import LineRenderer from './MapControl/utils/LineRenderer'
import { createProvinceMaterial } from './MapControl/utils/material'
import GradientShader from './MapControl/utils/GradientShader'
import ExtrudedGeoMapRenderer from './MapControl/utils/ExtrudedGeoMapRenderer'
import createAnimateVideoItem from './MapControl/utils/animateVideoItem'
import { Label3D, Label3DProps } from './MapControl/utils/label3d'
import {
  createDecorationIcon,
  createProvinceBarLabel,
  createProvinceLabel,
  createSpecialProvinceLabel,
} from './MapControl/utils/createLabels'
import { SquareIcon } from './MapControl/base64'
import Particles from './MapControl/utils/Particles'

// Assets
import Animate1 from './assets/mov/animate.mov'
import Animate2 from './assets/mov/animate2.mov'
import ZheJiangData from './data/map/zhejiang.json'

export {
  LilGui,
  MapApplication,
  ChinaProvinceInfo,
  ZheJiangCityInfo,
  Grid,
  PlaneMeshRotate,
  initGsapTimeLine,
  GeoMapRenderer,
  LineRenderer,
  createProvinceMaterial,
  GradientShader,
  ExtrudedGeoMapRenderer,
  createAnimateVideoItem,
  Label3D,
  createDecorationIcon,
  createProvinceBarLabel,
  createProvinceLabel,
  createSpecialProvinceLabel,
  SquareIcon,
  Particles,
  Animate1,
  Animate2,
  ZheJiangData,
  LoadAssets
}

export type {
  MapControlOptions,
  Label3DProps
}
