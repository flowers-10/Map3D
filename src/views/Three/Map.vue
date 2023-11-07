<template>
  <div ref="box" class="china-chart">
    <canvas class="webgl"></canvas>
      <div style="z-index: 1000;background: rgba(0,0,0,0.5);width: 100px;height: 100px;position: absolute;font-size: 16px; padding: 20px;display: flex;justify-content: center;align-items: center;color:#fff" id="provinceInfo"></div>
  </div>
</template>
<script>
import { initThreeMap } from "./map";

export default {
  name: "Map",
  data() {
    return {};
  },
  mounted() {
    initThreeMap();
  },
  beforeDestroy() {},
  methods: {},
};
</script>
<style scoped>
.china-chart {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.webgl {
  position: absolute;
  color: #fff;
  user-select: none;
}
</style>
