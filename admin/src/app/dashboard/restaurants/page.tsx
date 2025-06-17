'use client'
import React, { useEffect, useState } from 'react'
import { Search, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

interface Restaurant {
  id: number
  name: string
  email: string
  phone: string
  status: 'Submitted' | 'Paid' | 'Verified'
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  amount: number
  createdAt: string
}

const statusOptions = ['All', 'Submitted', 'Paid', 'Verified'] as const
const paymentStatusOptions = ['All', 'Pending', 'Paid', 'Failed'] as const

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<typeof statusOptions[number]>('All')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<typeof paymentStatusOptions[number]>('All')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('auth_token')
        const res = await axios.get(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:5001'}/api/admin/restaurants`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: selectedStatus !== 'All' ? selectedStatus.toLowerCase() : undefined,
            paymentStatus: selectedPaymentStatus !== 'All' ? selectedPaymentStatus.toLowerCase() : undefined,
            search: searchQuery
          }
        })
        setRestaurants(res.data.data)
      } catch (err) {
        setError('Failed to fetch restaurants')
        console.error('Error fetching restaurants:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [searchQuery, selectedStatus, selectedPaymentStatus])

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.phone.includes(searchQuery)
    
    const matchesStatus = selectedStatus === 'All' || restaurant.status === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === 'All' || restaurant.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesStatus && matchesPaymentStatus
  })

  const getStatusColor = (status: Restaurant['status']) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800'
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Verified':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: Restaurant['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePaymentAction = async (restaurantId: number, action: 'approve' | 'reject' | 'retry') => {
    try {
      setError('')
      const token = localStorage.getItem('auth_token')
      await axios.put(
        `${process.env.NEXT_PUBLIC_URL || 'http://localhost:5001'}/api/admin/restaurants/${restaurantId}/payment`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Update the local state
      setRestaurants(prev => 
        prev.map(restaurant => 
          restaurant.id === restaurantId 
            ? { 
                ...restaurant, 
                paymentStatus: action === 'approve' ? 'Paid' : action === 'reject' ? 'Failed' : 'Pending'
              } 
            : restaurant
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
        <h1 className="text-2xl font-semibold text-gray-900">Restaurants</h1>
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
              placeholder="Search restaurants..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {restaurant.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
                      {restaurant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${restaurant.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(restaurant.paymentStatus)}`}>
                      {restaurant.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {restaurant.paymentStatus === 'Pending' && (
                        <>
                          <button
                            onClick={() => handlePaymentAction(restaurant.id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Payment"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handlePaymentAction(restaurant.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Payment"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {restaurant.paymentStatus === 'Failed' && (
                        <button
                          onClick={() => handlePaymentAction(restaurant.id, 'retry')}
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
    </div>
  )
}




