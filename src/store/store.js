import { defineStore, acceptHMRUpdate } from "pinia";
import { ErrorHandler } from "../helpers";
import { useToast } from "vue-toastification";
import api from "../api";

export const useStore = defineStore("store", {
  state: () => ({
    api: api,
    title: "Store",
    isLoading: false,
    access: null,
    refresh: null,
    user: {
      first_name: null,
      last_name: null,
      date_of_birth: null,
      email: null,
      password: null,
      password2: null,
    },
    items: [],
    saleItems: [],
    showToaster: (type, msg, timeout) =>
      useToast()(msg, {
        position: "top-center",
        timeout: typeof timeout === "number" ? timeout : 3000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        type: type,
      }),
  }),
  actions: {
    async auth(type, user) {
      if (!type || !user) return;
      this.isLoading = true;
      try {
        if (type === "auth") {
          const authData = await this.api.login(user);
          if (authData.access && authData.refresh) {
            this.user = user;
            localStorage.setItem("access", authData.access);
            localStorage.setItem("refresh", authData.refresh);
            this.access = authData.access;
            this.refresh = authData.refresh;
            return true;
          } else {
            this.showToaster("error", "Отстутсвует токен");
          }
        } else {
          const regData = await this.api.register(user);
          if ("email" in regData && regData.email) {
            const authData = await this.api.login(user);
            if (authData.access && authData.refresh) {
              this.user = user;
              localStorage.setItem("access", authData.access);
              localStorage.setItem("refresh", authData.refresh);
              this.access = authData.access;
              this.refresh = authData.refresh;
              return true;
            } else {
              this.showToaster("error", "Отстутсвует токен");
            }
          }
        }
      } catch (err) {
        return ErrorHandler(err);
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      this.$reset();
      localStorage.clear();
    },
    async getItems(show = false) {
      try {
        this.isLoading = show;
        const items = await this.api.getItems();
        if (items.length) {
          this.items = items;
        }
      } catch (err) {
        ErrorHandler(err);
      } finally {
        this.isLoading = false;
      }
    },
    async getSaleItems(show = false) {
      try {
        this.isLoading = show;
        const items = await this.api.getSaleItems();
        if (items.length) {
          this.saleItems = items;
        }
      } catch (err) {
        ErrorHandler(err);
      } finally {
        this.isLoading = false;
      }
    },
    async toSale(item, price, lot = null) {
      if (!item) return null;
      try {
        this.isLoading = true;
        if (item.status === "ACTIVE") {
          const newSaleData = {
            item: Number(item.id),
            current_price: String(price),
          };
          await this.api.addSaleItem(newSaleData);
        }
        if (item.status === "ON_SALE" && !!lot) {
          await this.api.editSaleItem(lot.id, String(price));
        }

        await Promise.allSettled([
          this.getItems(false),
          this.getSaleItems(false),
        ]);
      } catch (err) {
        return ErrorHandler(err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot));
}
