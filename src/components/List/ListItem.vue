<template>
  <aside
    class="border-2 rounded-lg p-4 flex flex-col lg:flex-row items-center"
    :class="[cardColor]"
  >
    <img :src="value.img" :alt="value.name" class="h-[150px] rounded" />

    <div class="flex flex-col justify-around h-full px-4">
      <div class="flex flex-col bg-white p-2 w-fit rounded-lg border-[1px]">
        <span class="text-subtitle-1">Название: {{ value.name }}</span>
        <span class="text-subtitle-2 text-gray-400"
          >Описание: {{ value.description }}</span
        >
      </div>

      <div class="flex flex-wrap items-center gap-2 mt-2">
        <div
          v-if="'owner' in value && Object.keys(value.owner).length"
          class="text-subtitle-2 w-fit border-[1px] p-1 rounded bg-white border-[#6ee7b7]"
        >
          <span
            >Владелец:
            {{ `${value.owner.first_name} ${value.owner.last_name}` }}</span
          >
        </div>
        <div
          v-if="initial && 'last_bidder' in initial && initial.last_bidder"
          class="text-subtitle-2 w-fit border-[1px] p-1 rounded bg-white border-[#c084fc]"
        >
          <span
            >Последний:
            {{ `${initial.last_bidder.first_name} ${initial.last_bidder.last_name}` }}</span
          >
        </div>
        <div
          v-if="value.initial_price"
          class="text-subtitle-2 w-fit border-[1px] p-1 rounded bg-white border-[#fde047]"
        >
          Первоначальная: {{ `${value.initial_price} ₸‎` }}
        </div>
        <div
          v-if="initial && 'current_price' in initial && initial.current_price"
          class="text-subtitle-2 w-fit border-[1px] p-1 rounded bg-white border-[#fda4af]"
        >
          Последняя ставка: {{ `${initial.current_price} ₸‎` }}
        </div>
      </div>

      <v-form
        v-if="value.status === 'ACTIVE' && which === 'ACTIVE'"
        ref="vForm"
        class="mt-2 flex items-center gap-2"
      >
        <v-text-field
          v-model="bid"
          v-maska="$maska.numbers"
          label="Первая ставка"
          variant="outlined"
          density="compact"
          messages="Ставка должна превышать предыдущую ставку"
          :rules="$rules.numbers.concat(firstBidRule)"
        ></v-text-field>
        <v-btn
          icon="mdi mdi-check"
          variant="outlined"
          color="#4ade80"
          class="mb-6"
          type="button"
          size="small"
          :rounded="0"
          @click="makeFirst"
        ></v-btn>
      </v-form>
      <v-form
        v-if="value.status === 'ON_SALE' && which === 'ON_SALE'"
        ref="vForm"
        class="mt-2 flex items-center gap-2"
      >
        <v-text-field
          v-model="bid"
          v-maska="$maska.numbers"
          label="Новая ставка"
          variant="outlined"
          density="compact"
          messages="Ставка должна превышать предыдущую ставку"
          :rules="$rules.numbers.concat(firstBidRule)"
        ></v-text-field>
        <v-btn
          icon="mdi mdi-check"
          variant="outlined"
          color="#4ade80"
          class="mb-6"
          type="button"
          size="small"
          :rounded="0"
          @click="makeFirst"
        ></v-btn>
      </v-form>
    </div>
  </aside>
</template>

<script>
export default {
  props: {
    which: {
      type: String,
    },
    value: {
      type: Object,
      default: null,
    },
    initial: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const vForm = ref();
    const bid = ref(null);

    const makeFirst = async () => {
      await vForm.value.validate().then(async (v) => {
        if (v.valid) {
          await store.toSale(props.value, bid.value, props.initial);
        }
      });
    };

    const firstBidRule = [
      (v) => {
        if (typeof Number(v) === "number") {
          if (v <= props.value.initial_price) {
            return "Ставка должна превышать предыдущую ставку";
          }
          return true;
        } else {
          return "Поле не может быть пустым";
        }
      },
    ];
    const cardColor = computed(() => {
      const status = props.value.status;
      switch (status) {
        case "ON_SALE":
          return "bg-[#fef3c7]";
        case "ACTIVE":
          return "bg-white";
        case "SOLD":
          return "bg-[#dcfce7]";
      }
    });
    return {
      vForm,
      bid,
      cardColor,
      firstBidRule,
      makeFirst,
    };
  },
};
</script>
