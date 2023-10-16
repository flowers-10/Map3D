<template>
  <div ref="box" class="china-chart">
    <div id="provinceInfo"></div>
  </div>
</template>
<script >
import lineMap from "./map";

export default {
  name: "Map",

  data() {
    return {
      mapObj: null,
    };
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.mapObj.destroyed();
  },
  methods: {
    init() {
      this.mapObj = new lineMap(
        this.$refs.box,
        document.querySelector("#provinceInfo")
      );
      this.mapObj.init();
    },
  },
};
</script>
<style scoped>
.china-chart {
  position: relative;
  width: 100%;
  height: 100vh;
}
#provinceInfo {
  position: absolute;
  color: #fff;
  user-select: none;
}
</style>
