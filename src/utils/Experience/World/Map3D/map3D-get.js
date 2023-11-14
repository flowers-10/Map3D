/*
 * 获取地图JSON数据mixin
 */
import { loadJs } from '../../../library/resource'

export default {
    methods: {
        // 获得地图json数据
        async getMapJSON() {
            // 判断是否下钻
            if (this.mapType === 'china' && this.handleClickCode === '') {
                // 中国地图 缩略海岛
                if (this.island.visible) {
                    const chinaMap = await import(
                        /* webpackChunkName: "chinaMap" */ /* webpackMode: "lazy" */ '../../../library/chinaMap.json'
                    )
                    const miniJSON = await import(
                        /* webpackChunkName: "miniJSON" */ /* webpackMode: "lazy" */ '../../../library/mini-cab.json'
                    )
                    const outlineJSON = await import(
                        /* webpackChunkName: "outlineJSON" */ /* webpackMode: "lazy" */ '../../../library/chinaOutlineMap.json'
                    )
                  
                    this.mapJSON = chinaMap
                } else {
                    // 中国地图 加载海岛
                    const chinaMapPlus = await import(
                        /* webpackChunkName: "chinaMap" */ /* webpackMode: "lazy" */ '../../../library/chinaMapPlus.json'
                    )
                    this.mapJSON = chinaMapPlus
                }
            } else {
                // 下钻地图
                const _mapJSON = await this.mapGet()
                this.mapJSON = _mapJSON.SubJson
            }
        },
        mapGet() {
            const { fetchGeo } = this
            return new Promise((resolve, reject) => {
                try {
                    if (!window.AMapUI) {
                        Promise.all([
                            loadJs(
                                'https://webapi.amap.com/maps?v=1.4.6&key=09fd0fc2b19bb12146f7b4e056982974&plugin=AMap.Geocoder&callback=onMapLoad',
                            ),
                        ]).then((res) => {
                            window.onMapLoad = fetchGeo.bind(this, ...[resolve, reject])
                        })
                    } else {
                        fetchGeo(resolve, reject)
                    }
                } catch (error) {
                    reject(error)
                }
            })
        },
        fetchGeo(resolve, reject) {
            loadJs('https://webapi.amap.com/ui/1.0/main.js').then((res) => {
                AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
                    const districtExplorer = new DistrictExplorer()
                    districtExplorer.loadAreaNode(this.handleClickCode || this.provinceCode, (error, areaNode) => {
                        if (error) {
                            this.$message({
                                message: `无法加载区域地图资源，联系管理员：${error}`,
                                type: 'warning',
                            })
                            return reject(error)
                        }
                        const SubJson = { type: 'FeatureCollection', features: areaNode.getSubFeatures() } // 获取Features
                        const parentJson = { type: 'FeatureCollection', features: [areaNode.getParentFeature()] }
                        return resolve({ SubJson, parentJson })
                    })
                })
            })
        },
    },
}
