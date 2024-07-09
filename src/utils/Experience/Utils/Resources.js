import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import EventEmitter from './EventEmitter.js'

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()
        console.log(sources,111);
        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.fontLoader = new FontLoader()
    }

    startLoading() {
        let pathName = null
        if (process.env.NODE_ENV === 'development') {
            pathName = location.pathname.includes('ChartsCab') ? '/ChartsCab/' : '/'
        } else {
            pathName = location.pathname.includes('ChartsCab') ? '/ChartsCab/' : location.pathname
        }
        const domainName = location.origin + pathName
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(domainName + source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(domainName + source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(domainName + source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'font') {
                this.loaders.fontLoader.load(domainName + source.path, (file) => {
                    this.sourceLoaded(source, file)
                })
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }
}
