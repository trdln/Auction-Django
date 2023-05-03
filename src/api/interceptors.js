export default function (axios) {
  axios.interceptors.request.use(
    (request) => {
      const token = localStorage.getItem("access") || "null";
      if (token) {
        request.headers.Authorization = `${token}`;
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
