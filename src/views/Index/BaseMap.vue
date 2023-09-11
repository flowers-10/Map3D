<template>
  <div class="map">
    <div class="map-chart" id="mapEchart"></div>
  </div>
</template>

<script lang="ts">
import geoJson from "../../assets/JSON/China.json"; //省份的json格式

import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件

export default {
  methods: {
    // 2D地图贴图的配置项
    get2DMapOption() {
      var chartOption = {
        tooltip: {
          show: true,
        },
        geo: {
          show: false,
          map: "china", // 重要！！！注册的地图名字叫啥，这里就填啥
          //  重要！！一定要配置好宽高，否则导致地图和3D地图不重合
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: 940,
        },
        series: [
          {
            name: "散点",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 20,
            tooltip: {
              show: true,
              formatter: (e: any) => {
                console.log(e);

                return ` ${e.name}`;
              },
            },
            // 随便写点模拟数据
            data: [
              { name: "标签1", value: [116.554322, 39.934412, -1] },
              { name: "标签2", value: [97.738486, 37.403523, 1] },
              { name: "标签3", value: [109.586346, 25.217832, 2] },
              { name: "标签4", value: [118.417048, 33.33643, 3] },
              { name: "标签5", value: [118.417048, 33.33643, 4] },
              { name: "标签6", value: [132.546172, 46.523096, 5] },
              { name: "标签7", value: [83.977308, 30.703477, 6] },
            ],
          },
        ],
      };

      return chartOption;
    },

    Load3DMap(chartDOM: any) {
      // 先渲染2D地图作为贴图
      const canvas = document.createElement(`canvas`);
      // 重要！！
      var mapBg = echarts.init(canvas, undefined, {
        // 重要！！一定要配置好宽高，否则导致地图和3D地图不重合
        width: 1024,
        height: 1024,
      });
      // 获取2D地图的配置项
      const chartOption = this.get2DMapOption();
      // 2D的地图DOM
      mapBg.setOption(chartOption);
      let index = 0;
      // setInterval(() => {
      //   index === 6 ? (index = 0) : "";
      //   index++;
      //   mapBg.dispatchAction({
      //     type: "showTip",
      //     seriesIndex: 0,
      //     dataIndex: index,
      //   });
      // }, 1000);

      // 3D地图配置项
      const option = {
        geo3D: {
          map: "china", // 重要！！！注册的地图名字叫啥，这里就填啥
          shading: "color", // 重要！！！选择texture渲染的方式
          colorMaterial: {
            detailTexture: mapBg, //重要！！！2D地图的DOM作为纹理贴图放到3D上
            textureTiling: 1, // 纹理平铺，1是拉伸，数字表示纹理平铺次数
          },
          itemStyle: {
            color: "#ccc",
            opacity: 1,
            borderWidth: 1,
            borderColor: "#96ebf7",
          },
        },
      };
      // 渲染3D地图（已经把2D地图作为材质贴到3D地图上了）
      chartDOM.setOption(option, true);
    },
    chartMap() {
      const myChart = echarts.init(
        document.getElementById("mapEchart") as HTMLElement
      );
      echarts.registerMap("china", geoJson);
      this.Load3DMap(myChart);
    },
  },
  mounted() {
    this.chartMap();
  },
};
</script>

<style scoped>
.map {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
}

.map-chart {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  height: 100%;
  width: 100%;
}
</style>
