import { useMutation } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'

interface ExportParams {
  type: 'drivers' | 'restaurants'
  format?: 'csv' | 'excel'
  status?: string
  paymentStatus?: string
  startDate?: string
  endDate?: string
}

export function useExportData() {
  return useMutation({
    mutationFn: (params: ExportParams) => adminApi.exportData(params),
    onSuccess: (blob, params) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${params.type}_${new Date().toISOString().split('T')[0]}.${params.format || 'csv'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
} 