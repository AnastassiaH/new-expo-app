import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

export const axiosService = axios.create({
  baseURL: BASE_URL
})

// axiosService.interceptors.request.use(
//   (config) => {
//     setError(null)
//     const token = useTokenStore.getState().token
//     if (token) {
//       console.log('token set')
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )
