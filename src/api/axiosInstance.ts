import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth");
  if (raw) {
    try {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const raw = localStorage.getItem("auth");
      if (raw) {
        try {
          const { refreshToken } = JSON.parse(raw);
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken },
          );
          const { accessToken, refreshToken: newRefresh } = res.data;
          localStorage.setItem(
            "auth",
            JSON.stringify({ ...JSON.parse(raw), accessToken, refreshToken: newRefresh }),
          );
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch {
          localStorage.removeItem("auth");
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;