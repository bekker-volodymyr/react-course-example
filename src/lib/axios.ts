import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const baseURL = 'http://localhost:3001';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const accessToken = localStorage.getItem('accessToken');

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error),
// );

// Додаємо інтерфейс для власного поля _isRetry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Приводимо config до нашого кастомного інтерфейсу
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('Refresh token відсутній');
        }

        // Типізуємо відповідь від сервера рефрешу
        const response = await axios.post<{ accessToken: string }>(
          `${baseURL}/api/refresh`,
          { refreshToken },
        );

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // TypeScript тепер знає, що headers існують
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Сесія закінчилась. Потрібно залогінитись наново.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
