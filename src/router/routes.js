export const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/sale",
    name: "Sale",
    component: () => import("../pages/Sale.vue"),
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("../pages/Auth.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../pages/Auth.vue"),
  },
].map((route) => {
  if (route.name != "Auth" && route.name != "Register") {
    if ("children" in route) {
      route.children.map((childRoute) => {
        if ("meta" in childRoute === false) {
          childRoute.meta = {};
        }
        childRoute.meta.requiresAuth = true;
        return childRoute;
      });
    }
    if ("meta" in route === false) {
      route.meta = {};
    }
    route.meta.requiresAuth = true;
  }
  return route;
});
