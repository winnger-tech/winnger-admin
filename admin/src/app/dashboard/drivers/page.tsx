// ✅ Updated drivers/page.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Search, DollarSign, CheckCircle, XCircle, MapPin, Truck } from 'lucide-react'
import { adminApi } from '@/lib/api'
import type { Driver } from '@/types'
import { useRouter } from 'next/navigation'

const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'] as const
const paymentStatusOptions = ['All', 'Pending', 'Completed', 'Failed'] as const

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<typeof statusOptions[number]>('All')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<typeof paymentStatusOptions[number]>('All')
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await adminApi.getDrivers({
          page: currentPage,
          limit: 10,
          status: selectedStatus !== 'All' ? selectedStatus.toLowerCase() : undefined,
          paymentStatus: selectedPaymentStatus !== 'All' ? selectedPaymentStatus.toLowerCase() : undefined,
        })
        setDrivers(response.data || [])
        setTotalPages(response.totalPages || 1)
      } catch (err) {
        setError('Failed to fetch drivers')
        console.error('Error fetching drivers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [searchQuery, selectedStatus, selectedPaymentStatus, currentPage])

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.cellNumber.includes(searchQuery)
    
    const matchesStatus = selectedStatus === 'All' || driver.status === selectedStatus.toLowerCase()
    const matchesPaymentStatus = selectedPaymentStatus === 'All' || driver.paymentStatus === selectedPaymentStatus.toLowerCase()

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: Driver['paymentStatus']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePaymentAction = async (driverId: string, action: 'approve' | 'reject' | 'retry') => {
    try {
      setError('')
      await adminApi.updateDriverPayment(driverId, action)
      
      // Update the local state
      setDrivers(prev => 
        prev.map(driver => 
          driver.id === driverId 
            ? { 
                ...driver, 
                paymentStatus: action === 'approve' ? 'completed' : action === 'reject' ? 'failed' : 'pending'
              } 
            : driver
        )
      )
    } catch (err) {
      setError('Failed to update payment status')
      console.error('Error updating payment status:', err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search drivers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof statusOptions[number])}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="sm:w-48">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={selectedPaymentStatus}
            onChange={(e) => setSelectedPaymentStatus(e.target.value as typeof paymentStatusOptions[number])}
          >
            {paymentStatusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={e => {
                    // Prevent row click if an action button was clicked
                    if ((e.target as HTMLElement).closest('button')) return;
                    router.push(`/dashboard/drivers/${driver.id}`);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {driver.profilePhotoUrl && (
                        <img
                          src={driver.profilePhotoUrl}
                          alt={`${driver.firstName} ${driver.lastName}`}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                      )}
                      <div className="text-sm font-medium text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.cellNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {driver.city}, {driver.province}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      {driver.vehicleType} ({driver.deliveryType})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(driver.status)}`}>
                      {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(driver.paymentStatus)}`}>
                      {driver.paymentStatus.charAt(0).toUpperCase() + driver.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {driver.paymentStatus !== 'completed' && (
                        <button
                          onClick={e => { e.stopPropagation(); handlePaymentAction(driver.id, 'approve'); }}
                          className="text-green-600 hover:text-green-900"
                          title="Approve Payment"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      {driver.paymentStatus === 'pending' && (
                        <button
                          onClick={e => { e.stopPropagation(); handlePaymentAction(driver.id, 'reject'); }}
                          className="text-red-600 hover:text-red-900"
                          title="Reject Payment"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                      {driver.paymentStatus === 'failed' && (
                        <button
                          onClick={e => { e.stopPropagation(); handlePaymentAction(driver.id, 'retry'); }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Retry Payment"
                        >
                          <DollarSign className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}



// ✅ Updated restaurants/page.tsx follows same structure with Restaurant API
