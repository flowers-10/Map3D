<template>
    <div :ref="ref" class="pc-chart chart-dom" :style="{ width, padding, margin, height, background }">
        <!--名称-->
        <div class="pc-chart__title">
            <content-edit :style="titleStyle" :isDesign="isDesign" v-model="chartOptions.chartName"></content-edit>
        </div>
        <div class="pc-chart__main">
            <svg
                @click="backMap"
                t="1681698352108"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4388"
                width="200"
                height="200"
            >
                <path
                    d="M434.237 139.629q10.175-11.628 21.076-11.628 5.087 0.727 10.901 2.907 18.896 7.994 18.896 29.797 0 53.78 0 162.066 0 5.814 4.361 10.901 3.634 4.361 10.175 4.361 73.402 2.18 138.81 33.431 66.135 30.524 114.1 80.67 47.966 50.146 75.582 118.461 28.343 69.042 28.343 143.897 0 84.304-34.884 156.979-17.442-122.095-108.286-205.672-90.844-84.304-213.666-90.118-5.814 0-10.901 3.634-5.087 5.087-5.087 10.901 0 47.966 0 143.897 0 21.803-18.896 29.797-7.994 3.634-16.715 1.454-9.448-2.907-15.262-10.175-80.67-94.478-241.283-282.708-0.727-0.727-2.907-3.634-7.994-7.994-7.994-20.349 0-12.355 7.994-21.803 0.727-1.454 2.907-3.634 61.047-71.222 242.736-283.434zM485.11 368.557q-12.355 0-21.076-8.721t-8.721-21.076q0-50.873 0-153.345 0-5.814-5.087-7.268-1.454-0.727-2.907-0.727-2.907 0-5.814 2.907-73.402 85.757-219.48 257.998-3.634 5.087-3.634 10.175 0 0.727 0 1.454 0 4.361 3.634 9.448 73.402 85.757 220.933 257.271 3.634 4.361 7.994 2.907 5.087-2.907 5.087-7.994 0-45.059 0-135.903 0-12.355 9.448-21.076 8.721-8.721 20.349-8.721 113.374 0 206.398 63.228 92.298 62.501 134.45 164.973 0-19.622 0-59.594 0-70.495-26.89-134.45-26.89-63.954-72.675-109.74-45.786-46.512-109.013-74.129-63.228-27.617-132.996-27.617z"
                    p-id="4389"
                    fill="#515151"
                ></path>
            </svg>
            <div class="map-chart" ref="chart3DCanvas" id="map3DEchart"></div>
        </div>
    </div>
</template>

<script>
import { loadJs } from '../../utils/library/resource'
import { mapMixin } from '../../mixins/charts/index'

export default {
    name: 'pc-chart-map3D',
    adaptation: 'pc',
    output: 'chart',
    mixins: [mapMixin],
    data() {
        return {
            ref: 'chart-map3D',
            historyMapData: [], //用户点击的历史记录
            handleClickCode: '', // 用户点击需要下钻的区域code
            mapJSON: [],
            timer: null,
        }
    },
    computed: {
        viewControl({ chartOptions }) {
            return { ...chartOptions.viewControl }
        },
        emphasis({ chartOptions }) {
            return { ...chartOptions.emphasis }
        },
        mapType({ chartOptions }) {
            return chartOptions.mapType ? chartOptions.mapType : 'china'
        },
        provinceCode: {
            get() {
                return this.chartOptions.provinceCode ? this.chartOptions.provinceCode : 100000
            },
            set(value) {
                this.chartOptions.provinceCode = v
            },
        },
        bgNumber({ chartOptions }) {
            return chartOptions.bgNumber ?? 0
        },
    },
    watch: {
        viewControl() {
            this.setOption()
        },
        emphasis() {
            this.setOption()
        },
        mapType(newVal, oldVal) {
            console.log(newVal)
            this.handleClickCode = ''
            this.initChart()
        },
        provinceCode(newVal, oldVal) {
            console.log(newVal)
            this.handleClickCode = ''
            if (this.mapType === 'province') {
                this.initChart()
            }
        },
        bgNumber() {
            this.setOption()
        },
        historyMapData(newVal, oldVal) {
            console.log(newVal)
        },
    },
    methods: {
        // 初始化图表
        async initChart() {
            this.$chart && this.$chart.dispose()
            this.$chart && this.$chart.clear()
            this.$chart = null
            // console.log(this.$chart)
            // 初始化dom
            this.$chart = echarts.init(this.$refs.chart3DCanvas)
            // 初始化map
            this.initMap('map')
            // 添加点击事件
            this.$chart.on('click', (e) => {
                // debugger
                const newName = e.name
                console.log(e.value.level);
                if (e.value.level === 'district') return this.$message.warning('该地区暂不支持下钻')
                // 添加历史记录
                this.historyMapData.push(e.value)
                this.handleClickCode = e.value.adcode
                // 初始化地图
                this.initMap(newName)
            })
        },
        // 初始化地图
        async initMap(geoName) {
            // 清除echarts实例
            this.$chart.clear()
            // 请求map的json
            await this.getMapJSON(geoName)
            // 图表配置项
            this.setOption(geoName)
        },
        // 请求地图json数据
        async getMapJSON(geoName = 'map') {
            try {
                if (this.mapType === 'china' && this.handleClickCode === '') {
                    const chinaMap = await import(
                        /* webpackChunkName: "chinaMap" */ /* webpackMode: "lazy" */ '../../utils/library/chinaMap.json'
                    )
                    const outlineJSON = await import(
                        /* webpackChunkName: "outlineJSON" */ /* webpackMode: "lazy" */ '../../utils/library/chinaOutlineMap.json'
                    )
                    // console.log(chinaMap, 888)
                    echarts.registerMap(geoName, chinaMap)
                    echarts.registerMap(geoName + 'Outline', outlineJSON)
                    this.mapJSON = chinaMap
                } else {
                    const res = await fetch(
                        `https://geo.datav.aliyun.com/areas_v2/bound/${this.handleClickCode || this.provinceCode}_full.json`,
                    )
                    const outlineRes = await fetch(
                        `https://geo.datav.aliyun.com/areas_v2/bound/${this.handleClickCode || this.provinceCode}.json`,
                    )
                    const mapJSON = await res.json()
                    const outlineMapJSON = await outlineRes.json()
                    // console.log(res, 6666)
                    echarts.registerMap(geoName, mapJSON)
                    echarts.registerMap(geoName + 'Outline', outlineMapJSON)
                    this.mapJSON = mapJSON
                }
            } catch (error) {
                const _mapJSON = await this.mapGet()
                echarts.registerMap(geoName, _mapJSON)
                this.mapJSON = _mapJSON
            }
        },
        // 重新绘制地图
        paint() {
            if (this.timer) {
                clearTimeout(this.timer)
            } else {
                setTimeout(() => {
                    this.initChart()
                }, 0)
            }
        },
        // 更新配置项
        setOption(geoName = 'map') {
            const _that = this
            const { island, chartStyle, legendPosition, legend, colorList, viewControl, emphasis, bgNumber } = _that
            // 高亮的配置项
            const emphasisLabelOption = {
                show: true,
                formatter: (e) => {
                    return ` ${e.name} `
                },
                position: 'top',
                textStyle: {
                    color: emphasis.fontColor,
                    fontSize: emphasis.fontSize,
                    padding: [10, 10],
                    backgroundColor: {
                        image: require('./images/arrow.png'),
                    },
                },
            }
            const mapBackground = ['mapBackground1', 'mapBackground2', 'mapBackground3', 'mapBackground4']
            // 需要高亮的地名
            const lightAddressName = '郑州市'
            // 过滤json数据,根据业务需求的区域默认高亮
            // console.log(this.mapJSON)
            const mapData = []
            this.mapJSON.features.forEach((item) => {
                mapData.push({
                    value: item.properties,
                    name: item.properties.name,
                    label: item.properties.name === lightAddressName ? emphasisLabelOption : '',
                    itemStyle: item.properties.name === lightAddressName ? { color: emphasis.fillColor } : '',
                })
            })
            const emphasisTransparentOptions = {
                label: { show: false },
                itemStyle: {
                    color: 'transparent',
                },
            }
            // 动态图表配置项
            const option = {
                color: colorList,
                // tooltip: {
                //     trigger: 'item',
                //     showDelay: 0,
                //     transitionDuration: 0.1,
                // },
                legend: {
                    show: legend.visible,
                    ...legendPosition,
                },
                geo3D: {
                    zlevel: -100,
                    show: true,
                    type: 'map3D',
                    map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                    regionHeight: 8,
                    shading: 'realistic',
                    realisticMaterial: {
                        detailTexture: require(`./images/${mapBackground[bgNumber]}.png`),
                    },
                    viewControl: viewControl,
                    // 总地图item配置项
                    itemStyle: {
                        borderWidth: 0.5,
                        color: island.fillColor, //地图背景色
                        borderColor: island.strokeColor, //省市边界线
                        opacity: 1,
                    },
                    emphasis: emphasisTransparentOptions,
                },
                series: [
                    {
                        zlevel: -10,
                        regionHeight: 8.1,
                        type: 'map3D',
                        map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                        data: [...mapData], //这里比较重要：获得过滤后的data，这样点击事件时就能获得这个data的值
                        label: {
                            show: true, // 是否显示标签。
                            textStyle: chartStyle,
                            formatter: (e) => {
                                // console.log(e.name);
                                return ` ${e.name} `
                            },
                        },
                        shading: 'realistic',
                        realisticMaterial: {
                            detailTexture: require('./images/lightArea.png'),
                            textureTiling: 2,
                        },
                        viewControl: viewControl,
                        itemStyle: {
                            color: 'transparent',
                        },
                        //鼠标高亮样式
                        emphasis: {
                            label: emphasisLabelOption,
                            itemStyle: {
                                color: emphasis.fillColor,
                            },
                        },
                    },
                    {
                        zlevel: -100,
                        regionHeight: 8,
                        type: 'map3D',
                        map: geoName + 'Outline', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                        viewControl: viewControl,
                        itemStyle: {
                            borderWidth: 2,
                            color: 'transparent', //地图背景色
                            borderColor: '#16E4EF', //省市边界线
                            opacity: 1,
                        },
                        emphasis: emphasisTransparentOptions,
                    },
                    {
                        zlevel: -100,
                        regionHeight: 6,
                        type: 'map3D',
                        map: geoName + 'Outline', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                        viewControl: viewControl,
                        itemStyle: {
                            borderWidth: 0.5,
                            color: '#13A5C0', //地图背景色
                            borderColor: '#0D566C', //省市边界线
                            opacity: 1,
                        },
                        emphasis: emphasisTransparentOptions,
                    },
                    {
                        zlevel: -100,
                        regionHeight: 4,
                        type: 'map3D',
                        map: geoName + 'Outline', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                        viewControl: viewControl,
                        itemStyle: {
                            borderWidth: 0.5,
                            color: '#0A465D', //地图背景色
                            borderColor: '#14CBDC', //省市边界线
                            opacity: 1,
                        },
                        emphasis: emphasisTransparentOptions,
                    },
                    {
                        zlevel: -100,
                        regionHeight: 2,
                        type: 'map3D',
                        map: geoName + 'Outline', // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
                        viewControl: viewControl,
                        itemStyle: {
                            borderWidth: 0.5,
                            color: '#063142', //地图背景色
                            borderColor: '#16E4EF', //省市边界线
                            opacity: 1,
                        },
                        emphasis: emphasisTransparentOptions,
                    },
                ],
            }
            // 渲染配置
            this.$chart.setOption(option)
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
                        const Json = { type: 'FeatureCollection', features: areaNode.getSubFeatures() } // 获取Features
                        return resolve(Json)
                    })
                })
            })
        },
        backMap() {
            if (this.historyMapData.length) {
                // 去除当前的地图信息
                this.historyMapData.pop()
                this.handleClickCode = this.historyMapData.length ? this.historyMapData[0].adcode : ''
                // 重新渲染地图
                this.initChart()
            }
        },
    },
    created() {
        if (!window.echartsGl) {
            let pathName = location.pathname.includes('ChartsCab') ? '/ChartsCab/' : location.pathname
            loadJs(location.origin + pathName + 'static/ECHARTS-CUSTOM/echarts.min.js').then((res) => {
                loadJs(location.origin + pathName + 'static/ECHARTS-CUSTOM/echarts-gl.min.js')
                window.echartsGl = true
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/pc-chart.scss';

.pc-chart__main {
    position: relative;
    svg {
        position: absolute;
        left: 50px;
        top: 50px;
        width: 5%;
        height: 5%;
        cursor: pointer;
        z-index: 999;
    }
}

.map-chart {
    width: 100%;
    height: 100%;
}
</style>
