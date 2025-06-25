import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import type { Restaurant } from '@/types'

interface UseRestaurantsParams {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  search?: string
}

export function useRestaurants(params?: UseRestaurantsParams) {
  return useQuery({
    queryKey: ['restaurants', params],
    queryFn: () => adminApi.getRestaurants(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRestaurantsDetailed(params?: {
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['restaurants-detailed', params],
    queryFn: () => adminApi.getRestaurantsDetailed(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => adminApi.getRestaurantById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateRestaurantStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: string; remarks?: string }) =>
      adminApi.updateRestaurantStatus(id, status, remarks),
    onSuccess: () => {
      // Invalidate and refetch restaurants queries
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['restaurants-detailed'] })
    },
  })
}

export function useUpdateRestaurantPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' | 'retry' }) =>
      adminApi.updateRestaurantPayment(id, action),
    onSuccess: () => {
      // Invalidate and refetch restaurants queries
      queryClient.invalidateQueries({ queryKey: ['restaurants'] })
      queryClient.invalidateQueries({ queryKey: ['restaurants-detailed'] })
    },
  })
} 