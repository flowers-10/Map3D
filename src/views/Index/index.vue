<template>
  <div class="investment-screen">
    <svg
      style="position: absolute; left: 20px; top: 20px; cursor: pointer"
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
import { onMounted, ref, watch, watchEffect } from "vue";
import axios from "axios";

type HistoryData = {
  name: string;
  adcode: string | undefined;
};

// 地图下钻历史记录
const historyMapData = ref<HistoryData[]>([{ name: "map", adcode: "100000" }]);
// option缓存
const optionCache = ref();
watch(optionCache, (old, newValue) => {
  // console.log(newValue);
});

// 返回上级地图
const backMap = () => {
  const myChart = echarts.init(
    <HTMLElement>document.getElementById("mapEchart")
  );
  // 去除当前的地图信息
  historyMapData.value.pop();
  const len = historyMapData.value.length;
  // 获取上一级的地图信息
  const newdata = historyMapData.value[len - 1];
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
const getOption = (geoName: string, mapData: any, scatterData: any = []) => {
  // 图表配置项
  const option = {
    geo3D: {
      show: false,
      type: "map3D",
      map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
      regionHeight: 2,
    },
    series: [
      {
        zlevel: -10,
        regionHeight: 2,
        type: "map3D",
        map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
        shading: "realistic",
        realisticMaterial: {
          detailTexture: "./1.jpeg",
          roughness: 0.2,
          metalness: 0,
        },
        data: mapData, //这里比较重要：获得过滤后的data，这样点击事件时就能获得这个data的值
        label: {
          show: true, // 是否显示标签。
          textStyle: {
            color: "#fff", // 地图初始化区域字体颜色
            fontSize: 10,
          },
          formatter: (e: any) => {
            // console.log(e.name);
            return ` ${e.name} `;
          },
        },
        itemStyle: {
          borderWidth: 1.5,
          borderColor: "#5FB9DA",
          color: "#13A4C4",
        },
        emphasis: {
          label: {
            show: true,
            textStyle: {
              color: "#f8fbfb",
              borderColor: "#17E8F4",
              fontSize: 18,
            },
          },
          itemStyle: {
            color: "#18B6FE",

            backgroundColor: {
              image:
                "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201603%2F01%2F20160301232632_nXWsm.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1683787069&t=efc060f66bf6fa2c9446bddbd085982b",
            },
          },
        },
      },
      {
        zlevel: 1,
        type: "scatter3D",
        coordinateSystem: "geo3D",
        data: [
          { name: "杭州", value: [120.161693, 30.280059] },
          { name: "温州", value: [120.705869, 28.001095] },
          { name: "湖州", value: [120.094566, 30.899015] },
          { name: "嘉兴", value: [120.762045, 30.750912] },
          { name: "绍兴", value: [120.586673, 30.036519] },
          { name: "丽水", value: [119.929503, 28.472979] },
          { name: "衢州", value: [118.880768, 28.941661] },
          { name: "金华", value: [119.654027, 29.084455] },
          { name: "台州", value: [121.426996, 28.662297] },
          { name: "宁波", value: [121.556686, 29.880177] },
          { name: "舟山", value: [122.214339, 29.991092] },
        ],
        symbol: "circle",
        itemStyle: {
          color: "transparent",
        },
        label: {
          show: true,
          position: "top",
          distance: -20,
          formatter() {
            return "2";
          },

          textStyle: {
            color: "transparent",
            padding: [20, 20],
            backgroundColor: {
              image: "./2.jpeg",
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            formatter() {
            return "2";
          },
            textStyle: {
              color: "transparent",
              padding: [20, 20],
              backgroundColor: {
                image: "./3.jpeg",
              },
            },
          },
        },
      },
    ],
  };
  // 收集当前的option
  optionCache.value = option;
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
  // 过滤json数据
  const mapData = initJSONData(geoJson);
  // 图表配置项
  const option = getOption(geoName, mapData);
  // 渲染配置
  // chartDOM.setOption(option);
  updateMap(chartDOM, option);
};

// 更新图表配置项重新渲染
const updateMap = (chartDOM: echarts.ECharts, option: any) => {
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
  // 添加鼠标移入事件
  myChart.on("mouseover", (e: any) => {
    console.log(e.data.value);
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
  position: relative;
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
