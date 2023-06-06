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

<script lang="ts">
import * as echarts from "echarts";
import "echarts-gl"; //3D地图插件
import axios from "axios";

export default {
  data() {
    return {
      historyMapData: [{ name: "map", adcode: "100000" }],
    };
  },
  methods: {
    chartMap() {
      // 初始化dom
      const myChart = echarts.init(
        <HTMLElement>document.getElementById("mapEchart")
      );
      // 初始化map
      this.initMap(myChart, "map", "100000");
      // 添加点击事件
      myChart.on("click", (e: any) => {
        const newName: string = e.name;
        if (e.value.level === "district") return alert("该地区已经无法下钻");
        // 添加历史记录
        this.historyMapData.push(e.value);
        // 初始化地图
        this.initMap(myChart, newName, e.value.adcode);
      });

      //让可视化地图跟随浏览器大小缩放
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
    async initMap(chartDOM: echarts.ECharts, geoName: string, adcode: string) {
      // 清除echarts实例
      chartDOM.clear();
      // 请求map的json
      const mapData = await this.getMapJSON(adcode, geoName);
      // 图表配置项
      const option = this.getOption(geoName, mapData);
      // 渲染配置
      chartDOM.setOption(option);
    },
    async getMapJSON(adcode: string = "100000", geoName: string) {
      const res = await axios.get(
        `https://geo.datav.aliyun.com/areas_v2/bound/${adcode}_full.json`
      );

      // 重新注册地图
      echarts.registerMap(geoName, <any>res.data);
      // 过滤json数据
      const mapData = res.data.features.map((item: any) => {
        // console.log(item.properties.name);
        return {
          value: item.properties,
          name: item.properties.name,
        };
      });

      return mapData;
    },
    getOption(geoName: string, mapData: any) {
      // 图表配置项
      const option = {
        geo3D: {
          zlevel: -100,
          show: true,
          type: "map3D",
          map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
          regionHeight: 2,
          shading: "realistic",
          realisticMaterial: {
            detailTexture: "./1.jpeg",
            roughness: 0.2,
            metalness: 0,
          },
          regions: [
            {
              name: mapData[0].name,
              itemStyle: {
                color: "#ff9900",
              },
            },
          ], //默认高亮区域
          emphasis: {
            label: { show: false },
            itemStyle: {
              color: "transparent",
            },
          },
        },
        series: [
          {
            zlevel: -10,
            regionHeight: 2,
            type: "map3D",
            map: geoName, // 地图类型。echarts-gl 中使用的地图类型同 geo 组件相同
            data: mapData, //这里比较重要：获得过滤后的data，这样点击事件时就能获得这个data的值
            label: {
              show: true, // 是否显示标签。
              textStyle: {
                color: "#fff", // 地图初始化区域字体颜色
                fontSize: 12,
              },
              formatter: (e: any) => {
                // console.log(e.name);
                return ` ${e.name} `;
              },
            },
            shading: "realistic",
            realisticMaterial: {
              detailTexture: "./4.jpeg",
              roughness: 0.2,
              metalness: 0,
            },
            itemStyle: {
              borderWidth: 1.5,
              borderColor: "#5FB9DA",
              color: "transparent",
            },
            emphasis: {
              label: {
                show: true,
                textStyle: {
                  color: "#f8fbfb",
                  fontSize: 18,
                  padding: [20, 20],
                  backgroundColor: {
                    image: "./2.png",
                  },
                },
              },
              itemStyle: {
                color: "#18B6FE",
              },
            },
          },
        ],
      };
      return option;
    },
    backMap() {
      const myChart = echarts.init(
        <HTMLElement>document.getElementById("mapEchart")
      );
      // 去除当前的地图信息
      this.historyMapData.pop();
      const len = this.historyMapData.length;
      // 获取上一级的地图信息
      const newdata = this.historyMapData[len - 1];
      // 重新渲染地图
      this.initMap(
        myChart,
        newdata?.name || "map",
        newdata?.adcode || "100000"
      );
    },
  },
  mounted() {
    this.chartMap();
    console.log(1);
    
  },
};
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
