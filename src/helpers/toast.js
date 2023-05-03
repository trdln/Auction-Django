import * as vt from "vue-toastification";
import { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

export const Types = TYPE;
export const Positions = POSITION;
export const Toast = vt;
export const ToastOptions = {
  position: Positions.TOP_CENTER,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
};
