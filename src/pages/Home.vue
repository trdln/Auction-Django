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
    <v-btn
      text="Добавить"
      block
      class="mt-4 !h-[60px]"
      @click="dialog = true"
    ></v-btn>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-text>
          <v-form ref="vForm" @submit.prevent="submitForm">
            <v-text-field
              v-model="newItem.name"
              :rules="$rules.required"
              label="Наименование"
            ></v-text-field>
            <v-text-field
              v-model="newItem.description"
              :rules="$rules.required"
              label="Описание"
            ></v-text-field>
            <v-text-field
              v-model="newItem.img"
              :rules="$rules.required"
              label="Ссылка на картинку"
            ></v-text-field>
            <div class="border-[1px] rounded p-2 mb-4 w-fit">
              <span>Предпросморт картинки</span>
              <img v-if="newItem.img" :src="newItem.img" class="h-[150px]" />
            </div>
            <v-text-field
              v-model="newItem.initial_price"
              v-maska="$maska.numbers"
              :rules="$rules.required"
              label="Первоначальная цена"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text="Добавить"
            color="primary"
            variant="elevated"
            @click="submitForm"
          ></v-btn>
          <v-btn text="Отменить" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
  setup() {
    const store = useStore();
    const dialog = ref(false);
    const vForm = ref();
    const newItem = ref({
      name: null,
      description: null,
      img: null,
      initial_price: null,
      status: "ACTIVE",
      owner: jwtDecode(store.access).user_id,
    });
    const interval = ref();

    const onInit = async () => {
      if (!store.items.length) {
        await store.getItems(true);
      }
      interval.value = setInterval(async () => {
        await store.getItems(false);
      }, 500);
    };

    const submitForm = async () => {
      await vForm.value.validate().then(async (v) => {
        if (v.valid) {
          const created = await store.addNewItem(newItem.value);
          if (created) dialog.value = false;
        }
      });
    };

    onInit();

    onUnmounted(() => {
      clearInterval(interval.value);
    });

    return {
      newItem,
      vForm,
      dialog,
      submitForm,
    };
  },
};
</script>
