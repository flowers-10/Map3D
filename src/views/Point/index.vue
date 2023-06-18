<template>
  <div class="map" id="mapEchart" style="width: 100%; height: 100vh">
  </div>
</template>

<script lang="ts" setup>
import HangZhou from "../../assets/JSON/HangZhou.json";
import  points  from "./init";
// 引入工具
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted } from "vue";

const DataBit:any = []
for (let item of points) {
  item[2] = Math.random() * 40
  DataBit.push({value:item})
}


console.log(DataBit);

// 定义echarts方法
const chartMap = () => {
  var myChart = echarts.init(document.getElementById("mapEchart")!);
  // 重点：不要遗漏这句代码！！
  echarts.registerMap("zhejiang", <any>HangZhou);
  // 图表配置项
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
      barSize: 0.1,
      minHeight: 0.2,
      silent: true,
      itemStyle: {
        color: "orange",
        // opacity: 0.8
      },
    },
  ],
};
  // let option = {
  //   tooltip: {
  //     show: true,
  //   },
  //   //热力图配置项
  //   visualMap: [
  //     {
  //       type: "continuous",
  //       text: ["xxx"],
  //       calculable: true,
  //       max: 10,
  //       inPange: {
  //         color: ["#87aa66", "#eba438", "#d94d4c"],
  //       },
  //     },
  //   ],
  //   //3D地图配置项
  //   geo3D: {
  //     map: "zhejiang",
  //     roam: true,
  //     // height:'10%',
  //     itemStyle: {
  //       color: "#007aff",
  //       opacity: 0.8,
  //       borderWidth: 0.4,
  //       borderColor: "#000",
  //       // areaColor: '#fff'
  //     },
  //     viewControl: {
  //       // autoRotate: true,
  //       autoRotateAfterStill: 3,
  //       distance: 100,
  //       minAlpha: 5, // 上下旋转的最小 alpha 值。即视角能旋转到达最上面的角度。[ default: 5 ]
  //       maxAlpha: 90, // 上下旋转的最大 alpha 值。即视角能旋转到达最下面的角度。[ default: 90 ]
  //       minBeta: -360, // 左右旋转的最小 beta 值。即视角能旋转到达最左的角度。[ default: -80 ]
  //       maxBeta: 360, // 左右旋转的最大 beta 值。即视角能旋转到达最右的角度。[ default: 80 ]
  //       animation: true, // 是否开启动画。[ default: true ]
  //       animationDurationUpdate: 1000, // 过渡动画的时长。[ default: 1000 ]
  //       animationEasingUpdate: "cubicInOut", // 过渡动画的缓动效果。[ default: cubicInOut ]
  //     },

  //     emphasis: {
  //       disabled: true, //是否可以被选中
  //       label: {
  //         //移入时的高亮文本
  //         show: true,
  //         color: "#333", //显示字体颜色变淡
  //         fontSize: 18, //显示字体变大
  //       },
  //       itemStyle: {
  //         color: "#ff7aff", //显示移入的区块变粉色
  //       },
  //     },
  //     label: {
  //       show: true,
  //       position: "top",
  //       color: "#111", //地图初始化区域字体颜色
  //       fontSize: 14,
  //       lineHeight: 16,
  //     },
  //     shading: "lambert",
  //     light: {
  //       //光照阴影
  //       main: {
  //         // color: "#fff", //光照颜色
  //         intensity: 1, //光照强度
  //         //shadowQuality: 'high', //阴影亮度
  //         shadow: true, //是否显示阴影
  //         shadowQuality: "medium", //阴影质量 ultra //阴影亮度
  //         alpha: 55,
  //         beta: 10,
  //       },
  //       ambient: {
  //         intensity: 0.7,
  //       },
  //     },
  //   },
  //   series: [
  //   //3D柱状图配置项
  //     {
  //       name: "xxx",
  //       type: "bar3D",
  //       coordinateSystem: "geo3D",
  //       barSize: 0.8,
  //       shading: "lambert",
  //       opacity: 1,
  //       bevelSize: 0.2,
  //       label: {
  //         show: false,
  //         formatter: "{a}",
  //       },
  //       //自定义的data数组 value中数组的含义:[杭州的经度or纬度，要展示的3d柱状图数值大小]
  //       data: DataBit,
  //     },
  //   ],
  // };
  myChart.setOption(option);
};

onMounted(() => {
  // 挂载echart
  chartMap();
});
</script>
