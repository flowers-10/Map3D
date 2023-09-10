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
          // 2D地图坐标系
          show: true, // 不显示地图，用于为动效散点提供2D地图坐标系
          map: "zhejiang",
          roam: false, // 禁用缩放、拖拽
          layoutCenter: ["50%", "47%"], // 地图中心位置
          // layoutSize: "90%", // 控制地图尺寸（地图的宽度和高度都会改变）
          // aspectScale: 0.78, // 控制地图长宽比（此值越小地图越窄，越大地图越宽）
          zlevel: 1,
        },
        geo3D: {
          // 3D地图坐标系
          show: true, // 显示3D地图版块
          map: "zhejiang",
          top: "-20",
          regionHeight: 16, // 地图版块厚度
          label: {
            show: true,
            borderRadius: 0,
            distanca: 0,
            textStyle: {
              fontSize: 14,
              color: "#C23531", // 地图初始化区域字体颜色
              borderWidth: 1,
              borderColor: "#FFFF10",
            },
          },
          itemStyle: {
            // 三维地理坐标系组件 中三维图形的视觉属性，包括颜色，透明度，描边等。
            color: "rgba(252,85,49, 0.5)", // 地图板块的颜色
            opacity: 1, // 图形的不透明度 [ default: 1 ]
            borderWidth: 2, // (地图板块间的分隔线)图形描边的宽度。加上描边后可以更清晰的区分每个区域   [ default: 0 ]
            borderColor: "#FFF500", // 图形描边的颜色。[ default: #333 ]
          },
          emphasis: {
            label: {
              show: true,
              color: "#fff000",
            },
            itemStyle: {
              color: "#ff0",
              opacity: 0.5,
            },
          },
          light: {
            // 光照阴影
            main: {
              color: "#FFFFFF", // 光照颜色
              intensity: 2, // 光照强度
              shadowQuality: "light", // 阴影亮度
              shadow: true, // 是否显示阴影
              alpha: 50,
              beta: 10,
            },
          },
          viewControl: {
            projection: "perspective",
            autoRotate: false,
            distance: 150, // 控制地图版块的大小
            alpha: 72, // 地图版块垂直方向的角度
            beta: 2, // 地图版块水平方向的角度
            // rotateSensitivity: 0, // 禁用旋转
            // panSensitivity: 0, // 禁用平移
            // zoomSensitivity: 0, // 禁用缩放
          },
          zlevel: 2,
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
