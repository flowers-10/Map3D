<template>
  <div class="map" id="mapEchart" style="width: 100%; height: 100vh"></div>
</template>

<script lang="ts" setup>
// 引入工具
import * as echarts from "echarts";
import { onMounted } from "vue";

const generateData = (count: any) => {
  let baseValue = Math.random() * 1000;
  let time = +new Date(2011, 0, 1);
  let smallBaseValue: any;
  function next(idx: any) {
    smallBaseValue =
      idx % 30 === 0
        ? Math.random() * 700
        : smallBaseValue + Math.random() * 500 - 250;
    baseValue += Math.random() * 20 - 10;
    return Math.max(0, Math.round(baseValue + smallBaseValue) + 3000);
  }
  const categoryData = [];
  const valueData = [];
  for (let i = 0; i < count; i++) {
    categoryData.push(
      echarts.format.formatTime("yyyy-MM-dd\nhh:mm:ss", time, false)
    );
    valueData.push(next(i).toFixed(2));
    time += 1000;
  }
  return { categoryData: categoryData, valueData: valueData };
};

const chartMap = () => {
  var myChart = echarts.init(document.getElementById("mapEchart")!);
  const dataCount = 100;
  const data = generateData(dataCount);
  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    grid: { bottom: 90 },
    dataZoom: [
      { type: "inside",  start: 0,
        end: 19, },
      {
        type: "slider",
        show:false,
        // startValue: data.categoryData[90],
        // endValue: data.categoryData[99],
       
      },
    ],
    xAxis: {
      data: data.categoryData,
    },
    yAxis: { splitArea: { show: false } },
    series: [{ type: "bar", data: data.valueData }],
  };
  myChart.setOption(option);
};

onMounted(() => {
  // 挂载echart
  chartMap();
});
</script>

<style></style>
