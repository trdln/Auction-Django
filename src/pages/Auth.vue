<template>
  <section class="flex flex-col justify-center items-center">
    <v-form
      v-if="isAuth"
      ref="vForm"
      class="w-[70%] lg:w-[30vw] bg-white flex flex-col gap-4 p-4 border-[1px] rounded-lg"
      @submit.prevent="submitForm"
    >
      <h1 class="self-center text-xl">Страница входа</h1>
      <v-text-field
        v-model="user.email"
        :rules="$rules.required.concat($rules.email)"
        label="Почта"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.password"
        :rules="$rules.required"
        label="Пароль"
        type="password"
        variant="outlined"
      ></v-text-field>

      <v-btn text="Войти" type="submit" size="large" variant="outlined"></v-btn>
      <router-link :to="{ name: 'Register' }">Создать аккаунт</router-link>
    </v-form>
    <v-form
      v-else
      ref="vForm"
      class="w-[70%] lg:w-[30vw] bg-white flex flex-col gap-4 p-4 border-[1px] rounded-lg"
      @submit="submitForm"
    >
      <h1 class="self-center text-xl">Страница регистрации</h1>
      <v-text-field
        v-model="user.first_name"
        v-maska="$maska.text"
        :rules="$rules.required"
        label="Имя"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.last_name"
        v-maska="$maska.text"
        :rules="$rules.required"
        label="Фамилья"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.date_of_birth"
        v-maska="$maska.date"
        :rules="$rules.required.concat($rules.birthDate, $rules.age)"
        label="Дата рождения"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        :rules="$rules.required.concat($rules.email)"
        label="Почта"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.password"
        :rules="$rules.required.concat($rules.password)"
        label="Пароль"
        type="password"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        v-model="user.password2"
        :rules="$rules.required.concat(localRules.samePassword)"
        label="Подтверждение пароля"
        type="password"
        variant="outlined"
      ></v-text-field>
      <v-btn text="Войти" type="submit" size="large" variant="outlined"></v-btn>
      <router-link :to="{ name: 'Auth' }">Уже есть аккаунт?</router-link>
    </v-form>
  </section>
</template>

<script>
export default {
  setup() {
    const vForm = ref();
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const user = ref({
      first_name: null,
      last_name: null,
      date_of_birth: null,
      email: null,
      password: null,
      password2: null,
    });
    const localRules = {
      samePassword: [
        (v) => v === user.value.password || "Должно совпадать с паролем",
      ],
    };

    const submitForm = async () => {
      await vForm.value.validate().then(async (v) => {
        if (v.valid) {
          const logged = await store.auth(
            isAuth.value ? "auth" : "register",
            user.value
          );
          if (logged) {
            await router.push({ name: "Home" });
          }
        } else {
          const errors = document.querySelector(".v-input--error");
          if (errors) {
            const errorText = errors.querySelector(".v-label.v-field-label");
            if (errorText) {
              store.showToaster(
                "error",
                "Заполните поле " +
                  errorText.innerHTML?.replace(/[-<>!//.]/g, "")
              );
            } else {
              const errorFieldText = errors.querySelector(".v-input__control");
              if (errorFieldText) {
                store.showToaster(
                  "error",
                  "Заполните поле " +
                    errorFieldText.innerHTML?.replace(/[-<>!//.]/g, "")
                );
              }
            }
            errors.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }
      });
    };

    const isAuth = computed(() => route.name === "Auth");

    const onInit = async () => {
      const token = localStorage.getItem("access") || null;
      if (token) {
        await router.push({ name: "Home" });
      }
    };

    onInit();

    return {
      // State
      vForm,
      user,
      localRules,

      // Computed
      isAuth,

      // Functions
      submitForm,
    };
  },
};
</script>
