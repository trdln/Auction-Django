<template>
  <v-app>
    <Loading v-if="$store.isLoading" />
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        enter-active-class="animate__animated animate__fadeInLeft"
      >
        <v-main class="bg-sky-100">
          <component :is="Component" class="min-h-screen" />
        </v-main>
      </transition>
    </router-view>
    <v-bottom-navigation v-if="$store.access" v-model="bottomNavigation" grow>
      <v-btn value="items">
        <v-icon>mdi-format-list-bulleted</v-icon>
        All Items
      </v-btn>
      <v-btn value="sale">
        <v-icon>mdi-shopping</v-icon>
        Items on sale
      </v-btn>
      <v-btn value="logout">
        <v-icon>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const bottomNavigation = ref();
    const onInit = async () => {
      const token = localStorage.getItem("access") || null;
      const refreshToken = localStorage.getItem("refresh") || null;
      if (token && refreshToken) {
        store.access = token;
        store.refresh = refreshToken;
      }
    };

    onInit();

    watch(bottomNavigation, async () => {
      const tab = bottomNavigation.value;
      if (tab === "logout") {
        store.logout();
        bottomNavigation.value = null;
        await router.push({ name: "Auth" });
      }
      if (tab === "items") {
        if (route.name !== "Home") {
          await router.push({ name: "Home" });
        }
      }
      if (tab === "sale") {
        if (route.name !== "Sale") {
          await router.push({ name: "Sale" });
        }
      }
    });

    return {
      bottomNavigation,
    };
  },
  created() {
    this.$router.beforeEach(async (to, from, next) => {
      const token = localStorage.getItem("access") || null;
      if (
        to &&
        to.meta &&
        "requiresAuth" in to.meta &&
        to.meta.requiresAuth &&
        (!token || (token && isValidToken(token) === false))
      ) {
        this.$store.logout();
        await this.$router.push({ name: "Auth" });
      }
      next();
    });
  },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
