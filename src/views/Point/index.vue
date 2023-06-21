<template>
  <div class="map" id="mapEchart" style="width: 100%; height: 100vh"></div>
</template>

<script lang="ts" setup>
// 引入工具
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted } from "vue";
import * as turf from "@turf/turf";
import HangZhou from "../../assets/JSON/HangZhou.json";

// 杭州的边界范围
const hzBoundaries: turf.Position[] =
  HangZhou.features[0].geometry.coordinates[0][0];

function generateUniformPoints(
  count: number,
  boundaries: turf.Feature<turf.Polygon>
): turf.Position[] {
  const points: turf.Position[] = [];
  const bbox: turf.BBox = turf.bbox(boundaries);
  const cellSizeX: number = (bbox[2] - bbox[0]) / Math.ceil(Math.sqrt(count));
  const cellSizeY: number = (bbox[3] - bbox[1]) / Math.ceil(Math.sqrt(count));

  for (let x = bbox[0] + cellSizeX / 2; x < bbox[2]; x += cellSizeX) {
    for (let y = bbox[1] + cellSizeY / 2; y < bbox[3]; y += cellSizeY) {
      const pt: turf.Feature<turf.Point> = turf.point([x, y]);
      if (turf.booleanPointInPolygon(pt, boundaries)) {
        points.push([x, y]);
      }
      if (points.length >= count) {
        break;
      }
    }
    if (points.length >= count) {
      break;
    }
  }

  return points;
}

const boundaries: turf.Feature<turf.Polygon> = turf.polygon([hzBoundaries]);
const points: turf.Position[] = generateUniformPoints(10000, boundaries);
const DataBit: any = [];
for (let item of points) {
  item[2] = Math.random() * 40;
  DataBit.push({ value: item });
}

console.log(DataBit);

// 定义echarts方法
const chartMap = () => {
  var myChart = echarts.init(document.getElementById("mapEchart")!);
  echarts.registerMap("zhejiang", <any>HangZhou);
  // 图表配置项
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
