import {LoadingManager} from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {TextureLoader} from 'three'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js'
import {PCDLoader} from 'three/examples/jsm/loaders/PCDLoader.js'
import {
  FileLoader,
  ImageLoader,
  ObjectLoader,
  MaterialLoader,
  CubeTextureLoader,
} from 'three'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader.js'

type LoaderClassType =
  | GLTFLoader
  | TextureLoader
  | FontLoader
  | MTLLoader
  | OBJLoader
  | PCDLoader
  | FileLoader
  | ImageLoader
  | ObjectLoader
  | MaterialLoader
  | CubeTextureLoader
  | RGBELoader
  | FBXLoader

type LoaderConstructor = new (manager?: LoadingManager) => LoaderClassType

/**
 * 资源加载器类型映射
 */
const loaderTypes = {
  GLTFLoader: 'GLTF',
  TextureLoader: 'Texture',
  FontLoader: 'Font',
  MTLLoader: 'MTL',
  OBJLoader: 'OBJ',
  PCDLoader: 'PCD',
  FileLoader: 'File',
  ImageLoader: 'Image',
  ObjectLoader: 'Object',
  MaterialLoader: 'Material',
  CubeTextureLoader: 'CubeTexture',
  RGBELoader: 'RGBE',
  FBXLoader: 'FBX',
} as const

type LoaderTypeKeys = keyof typeof loaderTypes
type LoaderTypeValues = (typeof loaderTypes)[LoaderTypeKeys]
type LoaderObject = Record<LoaderTypeValues, LoaderConstructor>

const availableLoaderTypes = Object.values(loaderTypes) as LoaderTypeValues[]

export {
  loaderTypes,
  availableLoaderTypes,
  type LoaderTypeKeys,
  type LoaderTypeValues,
  type LoaderClassType,
  type LoaderConstructor,
  type LoaderObject,
}
