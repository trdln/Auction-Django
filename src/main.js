import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import Maska from "maska";
import Datepicker from "@vuepic/vue-datepicker";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createApp } from "vue";
import { getImage, Rules, Maskas } from "./helpers";
import { createPinia } from "pinia";
import "@vuepic/vue-datepicker/dist/main.css";

const app = createApp(App);
const pinia = createPinia();

// Config
app.config.globalProperties.$getImage = getImage;
app.config.globalProperties.window = window;

// Libs
app.use(router).use(pinia).use(vuetify).use(Maska).use(Toast);

// Global helpers
import { useStore } from "./store/store";
app.config.globalProperties.$store = useStore();
app.component("DatePicker", Datepicker);
app.config.globalProperties.$rules = Rules;
app.config.globalProperties.$maska = new Maskas();

app.mount("#app");
