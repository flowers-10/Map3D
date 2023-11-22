<template>
  <div ref="box" class="china-chart">
    <canvas class="webgl" ref="webgl" id="scene"></canvas>
    <!-- <div id="tag">标签内容</div> -->
  </div>
</template>
<script>
import ThreeMap3D from "../../utils/Experience/ThreeMap3D";
import { mapConfig } from "./Config/mapConfig";
export default {
  name: "Map",
  data() {
    return {
      _three_instance: null,
    };
  },
  mounted() {
    this._three_instance?.dispose();
    this._three_instance = new ThreeMap3D(
      this.$refs.webgl,
      mapConfig.chartOptions
    );
  },
  beforeDestroy() {
  },
  methods: {},
};
</script>
<style scoped>
.china-chart {
  background-color: #000000;
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url('../../assets/image/bg.png');
   background-position: center;
  background-size: cover; /* 或者使用contain，根据需要调整 */
  background-repeat: no-repeat; /* 防止背景图重复显示 */
}
.webgl {
  position: absolute;
  color: #fff;
  user-select: none;
}
#tag {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.3);
  z-index: 2;
}
</style>
