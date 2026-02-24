import OceanBlueBgImg from '../../assets/imgs/ocean-blue-bg.png'
import {AssetList} from '../types'
import ResourceManager from '../MapApplication/ResourceManager'
import ChinaBlurLineImg from '../../assets/imgs/chinaBlurLine.png'
import RotationBorder1Img from '../../assets/imgs/rotationBorder1.png'
import RotationBorder2Img from '../../assets/imgs/rotationBorder2.png'
import {sideImg, FlyLineImg, circleWhiteBreak, circleWhite} from '../base64'
import * as THREE from 'three'
import {ProvinceInfo} from '../types'
import HuiGuangImg from '../../assets/imgs/huiguang.png'

/**
 * 加载资源
 */
export class LoadAssets {
  onLoadCallback: () => void
  instance?: ResourceManager
  constructor(e = () => {}) {
    this.onLoadCallback = e
    this.init()
  }
  init() {
    this.instance = new ResourceManager()

    this.instance.addLoader(THREE.FileLoader, 'FileLoader')
    this.instance.on('onProgress', (_, t, n) => {
      console.log('加载进度', ((t / n) * 100).toFixed(2))
    })
    this.instance.on('onLoad', () => {
      this.onLoadCallback && this.onLoadCallback()
    })

    // 确保公共资源路径正确
    const baseUrl = window.location.origin
    const path = `${baseUrl}/data/map/`

    const list: AssetList = [
      {type: 'Texture', name: 'ocean', path: OceanBlueBgImg},
      {type: 'Texture', name: 'chinaBlurLine', path: ChinaBlurLineImg},
      {type: 'Texture', name: 'rotationBorder1', path: RotationBorder1Img},
      {type: 'Texture', name: 'rotationBorder2', path: RotationBorder2Img},
      {
        type: 'File',
        name: 'china-province',
        path: path + 'china-province.json',
      },
      {
        type: 'File',
        name: 'china',
        path: path + 'china.json',
      },
      {
        type: 'File',
        name: 'zhejiang-city',
        path: path + 'zhejiang-city.json',
      },
      {type: 'Texture', name: 'side', path: sideImg},
      {type: 'Texture', name: 'flyLine', path: FlyLineImg},
      {type: 'Texture', name: 'flyLineFocus', path: circleWhiteBreak},
      {type: 'Texture', name: 'huiguang', path: HuiGuangImg},
      {type: 'Texture', name: 'guangquan1', path: circleWhiteBreak},
      {type: 'Texture', name: 'guangquan2', path: circleWhite},
    ]
    this.instance.loadAll(list)
  }
}

/**
 * 浙江城市信息
 */
export const ZheJiangCityInfo = [
  {
    name: '杭州市',
    enName: 'hangzhou',
    value: 98,
    center: [120.153576, 30.287459],
    centroid: [119.476498, 29.898918],
  },
  {
    name: '宁波市',
    enName: 'ningbo',
    value: 57,
    center: [121.549792, 29.868388],
    centroid: [121.479174, 29.733017],
  },
  {
    name: '温州市',
    enName: 'wenzhou',
    value: 80,
    center: [120.672111, 28.000575],
    centroid: [120.463912, 27.894726],
  },
  {
    name: '嘉兴市',
    enName: 'jiaxing',
    value: 42,
    center: [120.750865, 30.762653],
    centroid: [120.783487, 30.620063],
  },
  {
    name: '湖州市',
    enName: 'huzhou',
    value: 37,
    center: [120.102398, 30.867198],
    centroid: [119.873663, 30.743058],
  },
  {
    name: '绍兴市',
    enName: 'shaoxing',
    value: 24,
    center: [120.582112, 29.997117],
    centroid: [120.640933, 29.732893],
  },
  {
    name: '金华市',
    enName: 'jinghua',
    value: 43,
    center: [119.649506, 29.089524],
    centroid: [119.957007, 29.115117],
  },
  {
    name: '衢州市',
    enName: 'hengzhou',
    value: 46,
    center: [118.87263, 28.941708],
    centroid: [118.679569, 28.932446],
  },
  {
    name: '舟山市',
    enName: 'zhousan',
    value: 37,
    center: [122.106863, 30.016028],
    centroid: [122.146805, 30.056563],
  },
  {
    name: '台州市',
    enName: 'taizhou',
    value: 36,
    center: [121.428599, 28.661378],
    centroid: [121.136679, 28.757098],
  },
  {
    name: '丽水市',
    enName: 'lishui',
    value: 48,
    center: [119.921786, 28.451993],
    centroid: [119.517145, 28.197644],
  },
]

export const ChinaProvinceInfo: ProvinceInfo[] = [
  {
    name: '北京市',
    center: [116.405285, 39.904989],
    centroid: [116.41995, 40.18994],
    hide: true,
  },
  {
    name: '天津市',
    center: [117.190182, 39.125596],
    centroid: [117.347043, 39.288036],
    hide: true,
  },
  {
    name: '河北省',
    center: [114.502461, 38.045474],
    centroid: [114.502461, 38.045474],
    hide: true,
  },
  {
    name: '山西省',
    center: [112.549248, 37.857014],
    centroid: [112.304436, 37.618179],
    hide: true,
  },
  {
    name: '内蒙古自治区',
    center: [111.670801, 40.818311],
    centroid: [114.077429, 44.331087],
    hide: true,
  },
  {
    name: '辽宁省',
    center: [123.429096, 41.796767],
    centroid: [122.604994, 41.299712],
    hide: true,
  },
  {
    name: '吉林省',
    center: [125.3245, 43.886841],
    centroid: [126.171208, 43.703954],
    hide: true,
  },
  {
    name: '黑龙江省',
    center: [126.642464, 45.756967],
    centroid: [127.693027, 48.040465],
    hide: true,
  },
  {
    name: '上海市',
    center: [121.472644, 31.231706],
    centroid: [121.438737, 31.072559],
    hide: true,
  },
  {
    name: '江苏省',
    center: [118.767413, 32.041544],
    centroid: [119.486506, 32.983991],
    hide: false,
  },
  {
    name: '浙江省',
    center: [120.153576, 30.287459],
    centroid: [120.109913, 29.181466],
    hide: true,
  },
  {
    name: '安徽省',
    center: [117.283042, 31.86119],
    centroid: [117.226884, 31.849254],
    hide: false,
  },
  {
    name: '福建省',
    center: [119.306239, 26.075302],
    centroid: [118.006468, 26.069925],
    hide: false,
  },
  {
    name: '江西省',
    center: [115.892151, 28.676493],
    centroid: [115.732975, 27.636112],
    hide: false,
  },
  {
    name: '山东省',
    center: [117.000923, 36.675807],
    centroid: [118.187759, 36.376092],
    blur: true,
  },
  {
    name: '河南省',
    center: [113.665412, 34.757975],
    centroid: [113.619717, 33.902648],
    blur: true,
  },
  {
    name: '湖北省',
    center: [114.298572, 30.584355],
    centroid: [112.271301, 30.987527],
    blur: true,
  },
  {
    name: '湖南省',
    center: [112.982279, 28.19409],
    centroid: [111.711649, 27.629216],
    blur: true,
  },
  {
    name: '广东省',
    center: [113.280637, 23.125178],
    centroid: [113.429919, 23.334643],
    blur: true,
  },
  {
    name: '广西壮族自治区',
    center: [108.320004, 22.82402],
    centroid: [108.7944, 23.833381],
    hide: true,
  },
  {
    name: '海南省',
    center: [110.33119, 20.031971],
    centroid: [109.754859, 19.189767],
    hide: true,
  },
  {
    name: '重庆市',
    center: [106.504962, 29.533155],
    centroid: [107.8839, 30.067297],
    blur: true,
  },
  {
    name: '四川省',
    center: [104.065735, 30.659462],
    centroid: [102.693453, 30.674545],
    hide: true,
  },
  {
    name: '贵州省',
    center: [106.713478, 26.578343],
    centroid: [106.880455, 26.826368],
    blur: true,
  },
  {
    name: '云南省',
    center: [102.712251, 25.040609],
    centroid: [101.485106, 25.008643],
    hide: true,
  },
  {
    name: '西藏自治区',
    center: [91.132212, 29.660361],
    centroid: [88.388277, 31.56375],
    hide: true,
  },
  {
    name: '陕西省',
    center: [108.948024, 34.263161],
    centroid: [108.887114, 35.263661],
    hide: true,
  },
  {
    name: '甘肃省',
    center: [103.823557, 36.058039],
    centroid: [103.823557, 36.058039],
    hide: true,
  },
  {
    name: '青海省',
    center: [101.778916, 36.623178],
    centroid: [96.043533, 35.726403],
    hide: true,
  },
  {
    name: '宁夏回族自治区',
    center: [106.278179, 38.46637],
    centroid: [106.169866, 37.291332],
    hide: true,
  },
  {
    name: '新疆维吾尔自治区',
    center: [87.617733, 43.792818],
    centroid: [85.294711, 41.371801],
    hide: true,
  },
  {
    name: '台湾省',
    center: [121.509062, 25.044332],
    centroid: [120.971485, 23.749452],
  },
  {
    name: '香港特别行政区',
    center: [114.173355, 22.320048],
    centroid: [114.134357, 22.377366],
    hide: true,
  },
  {
    name: '澳门特别行政区',
    center: [113.54909, 22.198951],
    centroid: [113.566988, 22.159307],
    hide: true,
  },
]

export const locationPoints = [
  {value: 166, lng: 119.00838863314104, lat: 29.70446787438727},
  {value: 196, lng: 121.95888480416225, lat: 29.804570962222094},
  {value: 145, lng: 121.1763690119717, lat: 29.943827249850777},
  {value: 101, lng: 121.56920938135673, lat: 29.85263574108389},
  {value: 199, lng: 120.9772766279951, lat: 28.330342193214033},
  {value: 167, lng: 120.33101898043361, lat: 30.565600410098323},
  {value: 169, lng: 120.36095289685078, lat: 30.739761809104824},
  {value: 101, lng: 119.983185482632, lat: 31.03706617454779},
  {value: 121, lng: 121.20282810334723, lat: 29.45300711212515},
  {value: 132, lng: 120.04632515461387, lat: 29.535586166289217},
  {value: 132, lng: 119.88396764642604, lat: 29.24289373808931},
  {value: 119, lng: 118.20295164180662, lat: 28.97847155167772},
  {value: 138, lng: 119.30239039019484, lat: 28.963362607831762},
  {value: 183, lng: 122.11925213943688, lat: 30.09279983271788},
  {value: 103, lng: 122.0641872449813, lat: 30.624331727210976},
  {value: 110, lng: 121.24428726916929, lat: 28.29819603626963},
  {value: 171, lng: 120.83475957600818, lat: 29.104535097251688},
  {value: 174, lng: 119.70182146944745, lat: 28.267110085326326},
]
