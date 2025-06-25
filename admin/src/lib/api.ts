import axios from 'axios'
import type { Driver, Restaurant, DashboardStats, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/api` : 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token')
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
      return Promise.reject({ message: 'No response from server. Please check your connection.' })
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message)
      return Promise.reject({ message: 'Error setting up request. Please try again.' })
    }
  }
)

export default api

// API endpoints
export const endpoints = {
  auth: {
    login: '/admin/login',
  },
  dashboard: {
    stats: '/admin/dashboard',
  },
  drivers: {
    list: '/admin/drivers',
    updatePayment: (id: string) => `/admin/drivers/${id}/payment`,
    updateStatus: (id: string) => `/admin/drivers/${id}/status`,
  },
  restaurants: {
    list: '/admin/restaurants',
    updatePayment: (id: string) => `/admin/restaurants/${id}/payment`,
    updateStatus: (id: string) => `/admin/restaurants/${id}/status`,
  },
}

interface GetDriversParams {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  search?: string
}

class AdminApiClient {
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await api.post('/admin/login', { email, password })
    return response.data
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await api.get('/admin/dashboard')
    return response.data
  }

  async getDrivers(params?: GetDriversParams): Promise<ApiResponse<Driver[]>> {
    const response = await api.get('/admin/drivers', { params })
    return response.data
  }

  async getDriverById(id: string): Promise<ApiResponse<Driver>> {
    const response = await api.get(`/admin/drivers/${id}`)
    return response.data
  }

  async getRestaurants(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<ApiResponse<Restaurant[]>> {
    const response = await api.get('/admin/restaurants', { params })
    return response.data
  }

  async getRestaurantsDetailed(params?: {
    status?: string
    paymentStatus?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<Restaurant[]>> {
    const response = await api.get('/admin/restaurants/detailed', { params })
    return response.data
  }

  async getRestaurantById(id: string): Promise<ApiResponse<Restaurant>> {
    const response = await api.get(`/admin/restaurants/${id}`)
    return response.data
  }

  async updateDriverStatus(
    id: string,
    status: string,
    reason?: string,
    notes?: string
  ): Promise<ApiResponse<Driver>> {
    const response = await api.put(`/admin/drivers/${id}/status`, {
      status,
      reason,
      notes,
    })
    return response.data
  }

  async updateDriverPayment(
    id: string,
    action: 'approve' | 'reject' | 'retry'
  ): Promise<ApiResponse<Driver>> {
    const response = await api.put(`/admin/drivers/${id}/payment`, { action })
    return response.data
  }

  async updateRestaurantStatus(
    id: string,
    status: string,
    reason?: string,
    notes?: string
  ): Promise<ApiResponse<Restaurant>> {
    const response = await api.put(`/admin/restaurants/${id}/status`, {
      status,
      reason,
      notes,
    })
    return response.data
  }

  async updateRestaurantPayment(
    id: string,
    action: 'approve' | 'reject' | 'retry'
  ): Promise<ApiResponse<Restaurant>> {
    const response = await api.put(`/admin/restaurants/${id}/payment`, { action })
    return response.data
  }

  async exportData(type: 'drivers' | 'restaurants', format: 'csv' | 'excel'): Promise<Blob> {
    const response = await api.get(`/admin/export`, {
      params: { type, format },
      responseType: 'blob',
    })
    return response.data
  }
}

export const adminApi = new AdminApiClient()