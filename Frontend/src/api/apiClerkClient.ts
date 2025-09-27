
import axios from 'axios'
import { useAuth } from '@clerk/vue'

export const createApiClerkClient = () => {
  const { getToken } = useAuth()

  const api = axios.create({
    baseURL: "/api",
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
