<template>
  <section class="p-4">
    <h1 class="text-center text-h4 m-4">All items</h1>
    <div v-if="$store.items.length" class="flex items-center gap-4 my-4">
      <div class="flex items-center gap-2">
        <div class="h-10 w-10 border-[1px] bg-white rounded"></div>
        На продажу
      </div>
      <div class="flex items-center gap-2">
        <div class="h-10 w-10 border-[1px] bg-[#fef3c7] rounded"></div>
        Продается
      </div>
      <div class="flex items-center gap-2">
        <div class="h-10 w-10 border-[1px] bg-[#dcfce7] rounded"></div>
        Продано
      </div>
    </div>
    <div v-if="$store.items.length" class="grid md:grid-cols-2 gap-4">
      <list-item
        v-for="(item, index) of $store.items"
        :key="index"
        :value="item"
        which="ACTIVE"
      ></list-item>
    </div>
    <list-empty v-else></list-empty>
  </section>
</template>

<script>
export default {
  setup() {
    const store = useStore();

    const onInit = async () => {
      if (!store.items.length) {
        await store.getItems(true);
      }
      setInterval(async () => {
        await store.getItems(false);
      }, 5000);
    };

    onInit();

    onUnmounted(() => {
      clearInterval();
    });

    return {};
  },
};
</script>
