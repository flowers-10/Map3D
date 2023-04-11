<template>
  <div class="investment-screen">
    <svg
      @click="backMap"
      t="1681180771137"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3427"
      width="200"
      height="200"
    >
      <path
        d="M426.666667 384V213.333333l-298.666667 298.666667 298.666667 298.666667v-174.933334c213.333333 0 362.666667 68.266667 469.333333 217.6-42.666667-213.333333-170.666667-426.666667-469.333333-469.333333z"
        p-id="3428"
        fill="#ffffff"
      ></path>
    </svg>
    <div class="map-chart" id="mapEchart"></div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import { onMounted, ref, watch } from "vue";
import axios from "axios";

type HistoryData = {
  name: string;
  adcode: string | undefined;
};

// 地图下钻历史记录
const historyMapData = ref<HistoryData[]>([]);

// 返回上级地图
const backMap = () => {
  const myChart = echarts.init(
    <HTMLElement>document.getElementById("mapEchart")
  );
  // 去除当前的地图信息
  historyMapData.value.pop();
  // 获取上一级的地图信息
  const newdata = historyMapData.value.pop();
  // 重新渲染地图
  initMap(myChart, newdata?.name || "map", newdata?.adcode || "100000");
};

// 请求地图json数据
const getMapJSON = async (adcode: string = "100000") => {
  const res = await axios.get(
    `https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`
  );
  return res;
};

// 初始化json返回地图渲染需要的data数据
const initJSONData = (json: any) => {
  // console.log(json.features);
  // 过滤合格的data信息
  const DATA = json.features.map((item: any) => {
    return {
      value: item.properties,
      name: item.properties.name,
    };
  });
  // console.log(DATA);
  return DATA;
};

// 图表生成配置项
const getOption = (geoName: string, geoJson: any) => {
  // 图表配置项
  const option = {
    series: [
      {
        type: "map3D",
        map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
        shading: "lambert",
        data: initJSONData(geoJson), //这里比较重要：获得过滤后的data，这样点击事件时就能获得这个data的值
        itemStyle: {
          borderWidth: 1.6,
          borderColor: "#09417F",
          color: "#00254b",
          textStyle: {
            color: "#fff",
            fontsize: 50,
          },
        },
        emphasis: {
          itemStyle: { color: "#fff" },
        },
      },
    ],
  };

  return option;
};

// 初始化图表
const initMap = async (
  chartDOM: echarts.ECharts,
  geoName: string,
  adcode: string
) => {
  // 清除echarts实例
  chartDOM.clear();
  // 请求map的json
  const { data: geoJson } = await getMapJSON(adcode);
  // 重新注册地图
  echarts.registerMap(geoName, <any>geoJson);
  // 图表配置项
  const option = getOption(geoName, geoJson);
  // 渲染配置
  chartDOM.setOption(option);
};

// 定义echarts方法
const chartMap = async () => {
  // 初始化dom
  const myChart = echarts.init(
    <HTMLElement>document.getElementById("mapEchart")
  );
  // 初始化map
  initMap(myChart, "map", "100000");
  // 添加点击事件
  myChart.on("click", (e: any) => {
    console.log(e);
    const newName: string = e.name;
    if (e.value.level === "district") return alert("该地区已经无法下钻");
    // 添加历史记录
    historyMapData.value.push(e.value);
    // 初始化地图
    initMap(myChart, newName, e.value.adcode);
  });
  //让可视化地图跟随浏览器大小缩放
  window.addEventListener("resize", () => {
    myChart.resize();
  });
};

onMounted(() => {
  // 挂载echart
  chartMap();
});
</script>

<style scoped>
.investment-screen {
  background-color: rgb(0, 0, 42);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-chart {
  width: 80%;
  height: 80%;
  /* background-color: wheat; */
}
</style>
