import { create, HEADERS } from 'apisauce'
import Config from '../config'
import { loadStorage, saveStorage, clearStorage } from '../context/AuthContext'

// Export response
export type { ApiResponse } from 'apisauce'

export interface GenericResponse {
  ok: boolean,
  problem: string,
  data: object
}

// Request Login
export interface RequestLogin {
  email: string,
  password: string
}

// Request Register
export interface RequestRegister {
  name: string
  email: string,
  password: string
}

// Request Category
export interface RequestCategory {
  id?: string,
  name: string
  description?: string
}

// Request Brand
export interface RequestBrand {
  id?: string,
  name: string
  description?: string
}

// Request Product
export interface RequestProduct {
  id?: string,
  name: string
  description?: string
  price: Number
  quantity: Number
}

// Create our ApiSauce instance
const api = create({
  baseURL: Config.baseAPI
})


// Simple call request
const callRequest = async (method: string, url: string, { params = {}, data = undefined, headers = {} }) => {
  if (method === 'get') {
    await api.get(url, params, { headers })
  }
  if (method === 'put') {
    await api.put(url, data, { headers })
  }
  if (method === 'post') {
    await api.post(url, data, { headers })
  }
  if (method === 'delete') {
    await api.delete(url, params, { headers })
  }
}

// Configuration
export const setHeaders = (opts: HEADERS) => api.setHeaders(opts)
export const setURL = (url: string) => api.setBaseURL(url)
export const setToken = (token: string) => api.setHeader('Authorization', `Bearer ${token}`)

// Methods
export const loginRequest = ({ email, password }: RequestLogin) => api.post('v1/user/login', { email, password })
export const registerRequest = ({ name, email, password }: RequestRegister) => api.put('v1/user/register', { name, email, password })
export const renewTokenRequest = (refreshToken: string) => api.get(`v1/user/renew/${refreshToken}`)

export const categoryListRequest = (params = {}) => api.get('v1/category', params)
export const categoryDetailRequest = (id: string) => api.get(`v1/category/${id}`)
export const categoryCreateRequest = (data: RequestCategory) => api.put('v1/category', data)
export const categoryUpdateRequest = (data: RequestCategory) => api.post(`v1/category/${data.id}`, data)
export const categoryDeleteRequest = (id: string) => api.delete(`v1/category/${id}`)

export const brandListRequest = (params = {}) => api.get('v1/brand', params)
export const brandDetailRequest = (id: string) => api.get(`v1/brand/${id}`)
export const brandCreateRequest = (data: RequestBrand) => api.put('v1/brand', data)
export const brandUpdateRequest = (data: RequestBrand) => api.post(`v1/brand/${data.id}`, data)
export const brandDeleteRequest = (id: string) => api.delete(`v1/brand/${id}`)

export const productListRequest = (params = {}) => api.get('v1/product', params)
export const productDetailRequest = (id: string) => api.get(`v1/product/${id}`)
export const productCreateRequest = (data: RequestProduct) => api.put('v1/product', data)
export const productUpdateRequest = (data: RequestProduct) => api.post(`v1/product/${data.id}`, data)
export const productDeleteRequest = (id: string) => api.delete(`v1/product/${id}`)

export const dashboardStatsRequest = () => api.get('v1/dashboard/stats')


// Renew access token monitor
const renewTokenMonitor = async (response: any) => {
  const { ok, data, status, config }: any = response

  if (!ok && status === 403 && typeof data === 'object') {
    const { error } = data
    const { method, url, params, data: requestData, headers = {} } = config
    const { refreshToken } = loadStorage()

    // If we do have refresh token
    if (refreshToken && refreshToken.length) {
      // If we got blocked by session expired, we need to renew our access token
      if (error === 'session_expired') {
        const resp = await renewTokenRequest(refreshToken)

        // We have renewed our token :D
        if (resp.ok) {
          const renewData: any = resp.data
          saveStorage(renewData.accessToken, renewData.refreshToken, renewData.user)
          
          // Make call again
          headers['Authorization'] = `Bearer ${renewData.accessToken}`
          setTimeout(() => {
            callRequest(method, url, { params, requestData, headers } as any)
          }, 1000)
        } else {
          // Ooops, something went wrong, the better way to handle that, is logging out the user
          clearStorage()
        }
      }
    }
  }
}
api.addMonitor(renewTokenMonitor)
