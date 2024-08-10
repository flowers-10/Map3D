<script setup lang="ts">
import HeaderVue from './components/Header/index.vue'
</script>

<template>
  <HeaderVue></HeaderVue>
  <router-view></router-view>
</template>

<style>
#app {
  height: 100vh;
    width: 100vw;
    overflow: hidden;
    box-sizing: border-box;
}
</style>
