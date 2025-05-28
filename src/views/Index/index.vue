<template>
  <div class="tips">鼠标移入👆上面部分导航</div>
  <div class="home">Hello Map3D !</div>
  <div class="github-link">
    <a href="https://github.com/flowers-10/Map3D" target="_blank">
      <svg class="github-icon" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
      <span>查看源码</span>
    </a>
  </div>
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
.github-link {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
}
.github-link a {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(145deg, #2196f3, #673ab7);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}
.github-link a:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}
.github-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  fill: white;
}
.github-link span {
  font-weight: 600;
  font-size: 16px;
}
</style>
