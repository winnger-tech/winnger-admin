export interface Driver {
    id: string
    firstName: string
    lastName: string
    email: string
    cellNumber: string
    status: 'pending' | 'approved' | 'rejected'
    paymentStatus: 'pending' | 'completed' | 'failed'
    createdAt: string
    updatedAt: string
    vehicleType: string
    deliveryType: string
    city: string
    province: string
    profilePhotoUrl?: string
  }
  
  export interface Restaurant {
    id: string
    restaurantName: string
    ownerName: string
    email: string
    phone: string
    status: 'pending' | 'approved' | 'rejected'
    paymentStatus: 'pending' | 'completed' | 'failed'
    city: string
    province: string
    createdAt: string
    updatedAt: string
  }
  
  export interface DashboardStats {
    drivers: {
      total: number
      pending: number
      approved: number
      rejected: number
      paymentCompleted: number
    }
    restaurants: {
      total: number
      pending: number
      approved: number
      rejected: number
      paymentCompleted: number
    }
  }
  
  export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    error?: string
    total?: number
    count?: number
    totalPages?: number
    currentPage?: number
  }