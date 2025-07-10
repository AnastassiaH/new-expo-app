import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const axiosService = axios.create({
  baseURL: BASE_URL
})

axiosService.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().session;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
