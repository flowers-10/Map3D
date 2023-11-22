<template>
  <div class="tips">鼠标移入👆上面部分导航</div>
  <div class="home">Hello Echarts !</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
</script>

<style scoped>
.home {
  padding-top: 8vh;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
}
.tips {
  position: absolute;
  z-index: 10;
  top: 5vh;
  left: 20px;
}
</style>
