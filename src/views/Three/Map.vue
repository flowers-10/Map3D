<template>
  <div style="box-sizing: border-box;background: #000;">
    <div
      style="
        position: absolute;
        top: 20px;
        left: 20px;
        color: aliceblue;
        font-size: 20px;
      "
    >
      threejs路由切换时上一个场景会占用内存,重新刷新即可解决，此问题等待后续版本优化！
      todo: 地图动画待添加！
    </div>
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as AUTO from "three-auto";
import { useThreeMap } from "../../hooks/useThreeMap"

const canvasDom = ref();
const instance = ref<AUTO.ThreeInstance>();
onMounted(() => {
  instance.value = useThreeMap(canvasDom.value);
 
});
onBeforeUnmount(() => {
  if (!instance.value) return
  (instance.value as any).dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>