import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routeMap";

const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
