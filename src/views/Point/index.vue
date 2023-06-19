<template>
  <div class="map" id="mapEchart" style="width: 100%; height: 100vh"></div>
</template>

<script lang="ts" setup>
import HangZhou from "../../assets/JSON/HangZhou.json";
import points from "./generateUniformPoints";
// 引入工具
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted } from "vue";

const DataBit: any = [];
for (let item of points) {
  item[2] = Math.random() * 40;
  DataBit.push({ value: item });
}

console.log(DataBit);

// 定义echarts方法
const chartMap = () => {
  var myChart = echarts.init(document.getElementById("mapEchart")!);
  // 重点：不要遗漏这句代码！！
  echarts.registerMap("zhejiang", <any>HangZhou);
  // 图表配置项
  // map3D
  // var option = {

  //   visualMap: {
  //     show: false,
  //     calculable: true,
  //     realtime: false,
  //     dimension: 3,
  //     inRange: {
  //       color: [
  //         "#313695",
  //         "#4575b4",
  //         "#74add1",
  //         "#abd9e9",
  //         "#e0f3f8",
  //         "#ffffbf",
  //         "#fee090",
  //         "#fdae61",
  //         "#f46d43",
  //         "#d73027",
  //         "#a50026",
  //       ],
  //     },
  //     outOfRange: {
  //       colorAlpha: 0,
  //     },
  //   },

  //   mapbox3D: {
  //     center: [121.4293, 31.20307],
  //     zoom: 11,
  //     pitch: 50,
  //     bearing: 30,
  //     style: "mapbox://styles/mapbox/light-v9",
  //     // altitudeScale: 1,
  //     postEffect: {
  //       enable: true,
  //       FXAA: {
  //         enable: true,
  //       },
  //     },
  //     light: {
  //       main: {
  //         intensity: 1,
  //         shadow: true,
  //         shadowQuality: "high",
  //       },
  //       ambient: {
  //         intensity: 0,
  //       },
  //       ambientCubemap: {
  //         texture: "/asset/get/s/data-1491838644249-ry33I7YTe.hdr",
  //         exposure: 1,
  //         diffuseIntensity: 0.5,
  //         specularIntensity: 2,
  //       },
  //     },
  //   },
  //   series: [
  //     {
  //       type: "bar3D",
  //       shading: "realistic",
  //       coordinateSystem: "mapbox3D",
  //       barSize: 0.4,
  //       silent: true,
  //     },
  //   ],
  // };
  // Geo3D
  let option = {
    backgroundColor: "#cdcfd5",
    geo3D: {
      map: "zhejiang",
      shading: "lambert",
      light: {
        main: {
          intensity: 5,
          shadow: true,
          shadowQuality: "high",
          alpha: 30,
        },
        ambient: {
          intensity: 0,
        },
        ambientCubemap: {
          texture: "data-gl/asset/canyon.hdr",
          exposure: 1,
          diffuseIntensity: 0.5,
        },
      },
      viewControl: {
        distance: 80,
        // panMouseButton: "left",
        // rotateMouseButton: "right",
        autoRotate: true,
        autoRotateAfterStill: 3,
        minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
        maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
        minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
        maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
        animation: true, // 是否开启动画。[ default: true ]
        animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
        animationEasingUpdate: "cubicInOut", // 过渡动画的缓动效果。[ default: cubicInOut ]
      },
      groundPlane: {
        show: true,
        color: "#999",
      },
      postEffect: {
        enable: true,
        bloom: {
          enable: false,
        },
        SSAO: {
          radius: 1,
          intensity: 1,
          enable: true,
        },
        depthOfField: {
          enable: false,
          focalRange: 10,
          blurRadius: 10,
          fstop: 1,
        },
      },
      temporalSuperSampling: {
        enable: true,
      },
      regionHeight: 2,
    },
    visualMap: {
      max: 40,
      calculable: true,
      realtime: false,
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
      outOfRange: {
        colorAlpha: 0,
      },
    },
    series: [
      {
        type: "bar3D",
        coordinateSystem: "geo3D",
        shading: "lambert",
        data: DataBit,
        barSize: 0.2,
        minHeight: 0.001,
        silent: true,
        itemStyle: {
          color: "orange",
          // opacity: 0.8
        },
      },
    ],
  };
  
  myChart.setOption(option);
};

onMounted(() => {
  // 挂载echart
  chartMap();
});
</script>
