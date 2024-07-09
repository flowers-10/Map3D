<template>
  <div ref="box" class="china-chart" id="_Background_3D">
    <canvas class="webgl" ref="webgl" id="scene"></canvas>
    <!-- <div id="tag">标签内容</div> -->
  </div>
</template>
<script>
import ThreeCity3D from "../../utils/Experience/ThreeCity3D";
import { cityConfig } from "./Config/cityConfig";
export default {
  name: "City",
  data() {
    return {
      _three_instance: null,
    };
  },
  mounted() {
    this._three_instance?.dispose();
    this._three_instance = new ThreeCity3D(
      this.$refs.webgl,
      cityConfig.chartOptions
    );
  },
  beforeDestroy() {
    this._three_instance?.dispose();
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
