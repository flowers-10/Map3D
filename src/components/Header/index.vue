<template>
  <header>
    <nav>
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
  background-color: #fff;
  height: 5vh;
}

nav {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}

a {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  transition: all 1s;
}

a:hover {
  background-color: #ccc;
}

.router-link-active {
  /* vue-router提供了这个类 */
  background: rgba(123, 207, 255, 0.933);
}
</style>
