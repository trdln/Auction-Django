<template>
  <section class="px-4">
    <h1 class="text-center text-h4 m-4">Items on sale</h1>
    <div v-if="$store.saleItems.length" class="grid grid-cols-2 gap-4">
      <div v-for="(sale, index) of $store.saleItems">
        <list-item :key="index" :value="sale.item" which="ON_SALE"></list-item>
      </div>
    </div>
    <list-empty v-else></list-empty>
  </section>
</template>

<script>
export default {
  setup() {
    const store = useStore();

    const onInit = async () => {
      if (!store.saleItems.length) {
        await store.getSaleItems(true);
      }
      // setInterval(async () => {
      //   await store.getSaleItems(false);
      // }, 5000);
    };

    onInit();

    onUnmounted(() => {
      clearInterval();
    });

    return {};
  },
};
</script>
