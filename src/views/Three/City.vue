<template>
  <div style="box-sizing: border-box;">
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useThreeCity } from "../../hooks/useThreeCity"
import * as AUTO from "three-auto";

const canvasDom = ref();
const instance = ref<AUTO.ThreeInstance>();
onMounted(() => {
  instance.value  = useThreeCity(canvasDom.value)
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
