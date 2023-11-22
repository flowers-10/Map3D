<template>
  <header>
    <div class="touch-panel"></div>
    <nav class="nav-panel">
      <router-link
        v-for="(item, index) in routeMap"
        :to="item.path"
        :key="index"
        >{{ item!.meta!.navLink }}</router-link
      >
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// console.log(window?.location);
const routeMap = ref(router.options.routes);
</script>

<style scoped>
header {
  width: 100%;

  position: fixed;
  z-index: 99;
  background-color: transparent;
  height: 5vh;
}

.nav-panel {
  position: absolute;
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  top: -5vh;
  transition: 0.3s all;
}

a {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 0.1s;
}

a:hover {
  background-color: #ccc;
}
.nav-panel {
  background: #fff;
}

.router-link-active {
  /* vue-router提供了这个类 */
  background: rgba(123, 207, 255, 0.933);
}

.touch-panel {
  position: absolute;
  height: 5vh;
  width: 100%;
  top: 0;
  z-index: -1;
  background-color: transparent;
}
.touch-panel:hover + .nav-panel {
  top: 0px;
}
.nav-panel:hover {
  top: 0px;
}
</style>
