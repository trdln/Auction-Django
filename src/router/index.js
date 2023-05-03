import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

export default router;
