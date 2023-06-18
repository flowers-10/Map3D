<template>
  <div class="map" id="mapEchart" style="width: 100%; height: 100vh">
  </div>
</template>

<script lang="ts" setup>
import HangZhou from "../../assets/JSON/HangZhou.json";
import { points } from "./poinitsArray";
// 引入工具
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted } from "vue";

const DataBit:any = []
for (let item of points) {
  item[2] = Math.random()
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
    tooltip: {
      show: true,
    },
    //热力图配置项
    visualMap: [
      {
        type: "continuous",
        text: ["xxx"],
        calculable: true,
        max: 1,
        inPange: {
          color: ["#87aa66", "#eba438", "#d94d4c"],
        },
      },
    ],
    //3D地图配置项
    geo3D: {
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
    //3D柱状图配置项
      {
        name: "xxx",
        type: "bar3D",
        coordinateSystem: "geo3D",
        barSize: 0.8,
        shading: "lambert",
        opacity: 1,
        bevelSize: 0.2,
        label: {
          show: false,
          formatter: "{a}",
        },
        //自定义的data数组 value中数组的含义:[杭州的经度or纬度，要展示的3d柱状图数值大小]
        data: DataBit,
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
