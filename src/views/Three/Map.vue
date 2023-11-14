<template>
  <div ref="box" class="china-chart">
    <canvas class="webgl" ref="webgl" id="scene"></canvas>
    <div
      style="
        z-index: 1000;
        background: rgba(0, 0, 0, 0.5);
        width: 100px;
        height: 100px;
        position: absolute;
        font-size: 16px;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      "
      id="provinceInfo"
    ></div>
  </div>
</template>
<script>
import ThreeMap3D from "../../utils/Experience/ThreeMap3D";

export default {
  name: "Map",
  data() {
    return {

    };
  },
  mounted() {
    new ThreeMap3D(this.$refs.webgl,{
       camera: {
                            fov: 75,
                            near: 0.1,
                            far: 1000,
                            position: {
                                x: 0,
                                y: 0,
                                z: 1.8,
                            },
                            lookAt: true,
                        },
                        renderer: {
                            clearAlpha: 0,
                        },
    });
  },
  beforeDestroy() {},
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
}
.webgl {
  position: absolute;
  color: #fff;
  user-select: none;
}
</style>
