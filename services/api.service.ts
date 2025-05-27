import { axiosService } from '@/axios'
import { API_ENDPOINTS } from '@/constants'
import { RideData, UserData } from '@/types'


const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: object | string, // check swagger // ask
  params?: object
): Promise<T | Error | any> => {
  try {
    const response = await axiosService({ method, url, data, params })
    return response.data
  } catch (error: any) {
    console.error(`API error (${method.toUpperCase()} ${url}):`, error)

    return new Error(error.message)
  }
}

interface LoginReturnData {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }
  token: string
}

export const registerUser = (data: UserData) =>
  apiRequest('post', API_ENDPOINTS.createUser, data)

export const verifyPhone = (data: object) =>
  apiRequest('post', API_ENDPOINTS.confirmPhoneNumber, data)

export const logInUser = (data: object) =>
  apiRequest('post', API_ENDPOINTS.loginUser, data)

export const forgotPassword = (data: object | string) =>
  apiRequest('post', API_ENDPOINTS.forgotPassword, data)

export const resetPassword = (data: object) =>
  apiRequest('post', API_ENDPOINTS.resetPassword, data)

export const createRide = (data: RideData) =>
  apiRequest('post', API_ENDPOINTS.ride, data)

export const cancelRide = (id: string) =>
  apiRequest('delete', `${API_ENDPOINTS.ride}/${id}`, undefined, { id })

export const getPartners = (id: string) =>
  apiRequest('get', `/rides/${id}/partners`, undefined, { id })
