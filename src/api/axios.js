import axios from "axios";
import interceptors from "./interceptors";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "1337",
  },
});
interceptors(instance);
export default instance;
