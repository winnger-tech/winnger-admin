'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Store, Calendar, Phone, Mail, FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { useRestaurant, useUpdateRestaurantStatus, useUpdateRestaurantPayment } from '@/hooks'
import type { Restaurant } from '@/types'

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string

  const { data: restaurantData, isLoading, error } = useRestaurant(restaurantId)
  const updateStatusMutation = useUpdateRestaurantStatus()
  const updatePaymentMutation = useUpdateRestaurantPayment()

  const restaurant = restaurantData?.data

  const getStatusColor = (status: Restaurant['status']) => {
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

  const getPaymentStatusColor = (status: Restaurant['paymentStatus']) => {
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

  const handleStatusUpdate = async (status: 'approved' | 'rejected', remarks?: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: restaurantId, status, remarks })
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handlePaymentAction = async (action: 'approve' | 'reject' | 'retry') => {
    try {
      await updatePaymentMutation.mutateAsync({ id: restaurantId, action })
    } catch (err) {
      console.error('Error updating payment status:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Failed to load restaurant details
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {restaurant.restaurantName}
            </h1>
            <p className="text-gray-600">Restaurant Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(restaurant.status)}`}>
            {restaurant.status}
          </span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(restaurant.paymentStatus)}`}>
            {restaurant.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Restaurant Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Restaurant Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Restaurant Name</label>
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{restaurant.restaurantName}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Owner Name</label>
                <p className="text-gray-900">{restaurant.ownerName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{restaurant.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{restaurant.phone}</p>
                </div>
              </div>
              {restaurant.identificationType && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Identification Type</label>
                  <p className="text-gray-900">{restaurant.identificationType}</p>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Business Address</h2>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{restaurant.businessAddress}</p>
                <p className="text-gray-900">{restaurant.city}, {restaurant.province} {restaurant.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          {restaurant.bankingInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Transit Number</label>
                  <p className="text-gray-900">{restaurant.bankingInfo.transitNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Institution Number</label>
                  <p className="text-gray-900">{restaurant.bankingInfo.institutionNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Number</label>
                  <p className="text-gray-900">{restaurant.bankingInfo.accountNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tax Information */}
          {restaurant.taxInfo && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tax Information</h2>
              <div>
                <label className="text-sm font-medium text-gray-500">HST Number</label>
                <p className="text-gray-900">{restaurant.taxInfo.hstNumber}</p>
              </div>
            </div>
          )}

          {/* Menu Details */}
          {restaurant.menuDetails && restaurant.menuDetails.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Menu Items</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.menuDetails.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <span className="text-green-600 font-semibold">${item.price}</span>
                    </div>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hours of Operation */}
          {restaurant.hoursOfOperation && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Hours of Operation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(restaurant.hoursOfOperation).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 capitalize">{day}</span>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-900">{hours.open} - {hours.close}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.businessDocumentUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Document</label>
                  <a href={restaurant.businessDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {restaurant.drivingLicenseUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Driving License</label>
                  <a href={restaurant.drivingLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {restaurant.voidChequeUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Void Cheque</label>
                  <a href={restaurant.voidChequeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status Actions</h2>
            <div className="space-y-3">
              {restaurant.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate('approved')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Restaurant
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Restaurant
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Payment Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Actions</h2>
            <div className="space-y-3">
              {restaurant.paymentStatus === 'pending' && (
                <>
                  <button
                    onClick={() => handlePaymentAction('approve')}
                    disabled={updatePaymentMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Payment
                  </button>
                  <button
                    onClick={() => handlePaymentAction('reject')}
                    disabled={updatePaymentMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Payment
                  </button>
                </>
              )}
              {restaurant.paymentStatus === 'failed' && (
                <button
                  onClick={() => handlePaymentAction('retry')}
                  disabled={updatePaymentMutation.isPending}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Retry Payment
                </button>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{new Date(restaurant.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              {restaurant.rejectionReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Rejection Reason</label>
                  <p className="text-gray-900">{restaurant.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 