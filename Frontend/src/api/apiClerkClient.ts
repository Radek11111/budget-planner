// services/apiClient.ts
import axios from 'axios'
import { useAuth } from '@clerk/vue'

export const createApiClerkClient = () => {
  const { getToken } = useAuth()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  api.interceptors.request.use(async (config) => {
    const token = await getToken.value()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return api
}
