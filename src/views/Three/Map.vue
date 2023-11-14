<template>
  <div ref="box" class="china-chart">
    <canvas class="webgl" ref="webgl" id="scene"></canvas>
    <div id="tag">标签内容</div>
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
#tag {
  width: 200px;
  height:200px;
  background: rgba(255,255,255,0.3);
  z-index: 2;
  
}
</style>
