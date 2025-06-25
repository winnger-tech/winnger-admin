import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import type { DashboardStats } from '@/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => adminApi.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
} 