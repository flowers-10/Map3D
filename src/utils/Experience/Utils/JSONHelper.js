/*
 * 获取地图JSON数据mixin
 */
import { loadJs } from '../../library/resource'

export default class JSONHelper {
    constructor(code) {
        this.code = code
    }
    async getMapJSON() {
        const { subJson, parentJson } = await this.mapGet()
        return { subJson, parentJson }
    }
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
                    fetchGeo.call(this, ...[resolve, reject])
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    fetchGeo(resolve, reject) {
        loadJs('https://webapi.amap.com/ui/1.0/main.js').then((res) => {
            AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer) => {
                const districtExplorer = new DistrictExplorer()
                districtExplorer.loadAreaNode(this.code, (error, areaNode) => {
                    if (error) {
                        this.$message({
                            message: `无法加载区域地图资源，联系管理员：${error}`,
                            type: 'warning',
                        })
                        return reject(error)
                    }
                    const subJson = { type: 'FeatureCollection', features: areaNode.getSubFeatures() } // 获取Features
                    const parentJson = { type: 'FeatureCollection', features: [areaNode.getParentFeature()] }
                    return resolve({ subJson, parentJson })
                })
            })
        })
    }
}
