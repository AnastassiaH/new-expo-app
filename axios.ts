import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const axiosService = axios.create({
  baseURL: BASE_URL
})

axiosService.interceptors.request.use(async (config) => {
  const url = config.url || '';

  if (!url.includes('/partners')) {
    await SecureStore.setItemAsync('lastActivityTime', Date.now().toString());
    useAuthStore.getState().setLastActivityTime(Date.now());
  }

  const token = useAuthStore.getState().session;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
