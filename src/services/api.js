import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  if (config.headers && config.headers['Content-Type'] === 'multipart/form-data') {
    delete config.headers['Content-Type'];
  }
  return config;
});

export default api;
