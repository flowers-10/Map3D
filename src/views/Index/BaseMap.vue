<template>
  <div class="map">
    <div class="map-container">
      <div class="map-chart" id="mapEchart"></div>
    </div>
  </div>
</template>

<script lang="ts">
import geoJson from "../../assets/JSON/China.json"; //省份的json格式

import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件

export default {
  methods: {
    chartMap() {
      var myChart = echarts.init(document.getElementById("mapEchart"));
      echarts.registerMap("zhejiang", geoJson);
      myChart.hideLoading();
      // 图表配置项
      let option = {
        tooltip: {
          show: true,
        },
        geo: {
          id: 99999992,
          map: "zhejiang",
          roam: true,
          itemStyle: {
            color: "#007aff",
            opacity: 0.8,
            borderWidth: 0.4,
            borderColor: "#000",
            // areaColor: '#fff'
          },
          viewControl: {
            // autoRotate: true,
            autoRotateAfterStill: 3,
            distance: 120,
            minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
            maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
            minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
            maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
            animation: true, // 是否开启动画。[ default: true ]
            animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
            animationEasingUpdate: "cubicInOut", // 过渡动画的缓动效果。[ default: cubicInOut ]
          },

          emphasis: {
            disabled: true, //是否可以被选中
            label: {
              //移入时的高亮文本
              show: true,
              color: "#333", //显示字体颜色变淡
              fontSize: 18, //显示字体变大
            },
            itemStyle: {
              color: "#ff7aff", //显示移入的区块变粉色
            },
          },
          label: {
            show: true,
            position: "top",
            color: "#111", //地图初始化区域字体颜色
            fontSize: 14,
            lineHeight: 16,
          },
          shading: "lambert",
          light: {
            //光照阴影
            main: {
              // color: "#fff", //光照颜色
              intensity: 1, //光照强度
              //shadowQuality: 'high', //阴影亮度
              shadow: true, //是否显示阴影
              shadowQuality: "medium", //阴影质量 ultra //阴影亮度
              alpha: 55,
              beta: 10,
            },
            ambient: {
              intensity: 0.7,
            },
          },
        },
        series: [
          {
            name: "散点",
            type: "scatter",
            coordinateSystem: "geo",
            symbolSize: 20,
            label: {
              show: true,
              distance: 14,
              position: "top",
              backgroundColor: "transparent",
              textStyle: {
                color: "#fff",
              },
              formatter: (e: any) => {
                return ` ${e.name}`;
              },
            },
            tooltip: {
              show: true,
              formatter: (e: any) => {
                console.log(e);

                return ` ${e.name}`;
              },
            },
            data: [
              {
                name: "",
                value: [116.554322, 39.934412, -1],
                itemStyle: {
                  color: "transparent",
                },
              },
              { name: "标签2", value: [97.738486, 37.403523, 0] },
              { name: "标签3", value: [109.586346, 25.217832, 0] },
              { name: "标签4", value: [118.417048, 33.33643, 0] },
              { name: "标签5", value: [118.417048, 33.33643, 0] },
              { name: "标签6", value: [132.546172, 46.523096, 0] },
              {
                name: "标签7",
                value: [83.977308, 30.703477, 0],
                itemStyle: {
                  symbolSize: 0,
                },
              },
            ],
            zlevel: 100,
            animation: true,
          },
        ],
      };

      myChart.setOption(option);
      console.log(option);
      let index = 0;

      setInterval(() => {
        index === 6 ? (index = 0) : "";
        index++;
        myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: index,
        });
      }, 1000);
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
.map-container {
  width: 100%;
  height: 100%;
  background: #fff;
  position: relative;
}
.map-container-title {
  margin: 56px 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #333;
  line-height: 30px;
  display: flex;
  justify-content: center;
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
