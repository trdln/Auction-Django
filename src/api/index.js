import axios from "./axios";

const GET = "get";
const POST = "post";
const PUT = "put";

class ApiClass {
  constructor() {
    this.axios = axios;
  }

  async axiosCall(config) {
    const { data } = await axios.request(config);
    return data;
  }

  async login(data) {
    return this.axiosCall({ method: POST, url: "/users/login/", data: data });
  }

  async register(data) {
    return this.axiosCall({
      method: POST,
      url: "/users/register/",
      data: data,
    });
  }

  async getItems() {
    return this.axiosCall({ method: GET, url: "/api/items/" });
  }

  async getItemById(id) {
    return this.axiosCall({ method: GET, url: `/api/items/${id}/` });
  }

  async editItem(id, data) {
    return this.axiosCall({
      method: PUT,
      url: `/api/items/${id}/`,
      data: data,
    });
  }

  async addItem(data) {
    return this.axiosCall({ method: POST, url: "/api/items/", data: data });
  }

  async getSaleItems() {
    return this.axiosCall({ method: GET, url: "/api/items-on-sale/" });
  }

  async getSaleItemById(id) {
    return this.axiosCall({ method: GET, url: `/api/items-on-sale/${id}/` });
  }

  async editSaleItem(id, newPrice) {
    return this.axiosCall({
      method: PUT,
      url: `/api/items-on-sale/${id}/`,
      data: { current_price: newPrice },
    });
  }

  async addSaleItem(data) {
    return this.axiosCall({
      method: POST,
      url: "/api/items-on-sale/",
      data: data,
    });
  }
}

const api = new ApiClass();
export default api;
