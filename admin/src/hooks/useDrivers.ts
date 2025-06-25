import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import type { Driver } from '@/types'

interface UseDriversParams {
  page?: number
  limit?: number
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
  search?: string
}

export function useDrivers(params?: UseDriversParams) {
  return useQuery({
    queryKey: ['drivers', params],
    queryFn: () => adminApi.getDrivers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDriversDetailed(params?: {
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
}) {
  return useQuery({
    queryKey: ['drivers-detailed', params],
    queryFn: () => adminApi.getDriversDetailed(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: () => adminApi.getDriverById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateDriverStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status, reason, notes }: { id: string; status: string; reason?: string; notes?: string }) =>
      adminApi.updateDriverStatus(id, status, reason, notes),
    onSuccess: () => {
      // Invalidate and refetch drivers queries
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['drivers-detailed'] })
    },
  })
}

export function useUpdateDriverPayment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'approve' | 'reject' | 'retry' }) =>
      adminApi.updateDriverPayment(id, action),
    onSuccess: () => {
      // Invalidate and refetch drivers queries
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['drivers-detailed'] })
    },
  })
} 