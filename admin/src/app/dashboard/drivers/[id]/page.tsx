'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Truck, Calendar, Phone, Mail, FileText, CheckCircle, XCircle } from 'lucide-react'
import { useDriver, useUpdateDriverStatus, useUpdateDriverPayment } from '@/hooks'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { Driver } from '@/types'

export default function DriverDetailPage() {
  const params = useParams()
  const router = useRouter()
  const driverId = params.id as string

  const { data: driverData, isLoading, error } = useDriver(driverId)
  const updateStatusMutation = useUpdateDriverStatus()
  const updatePaymentMutation = useUpdateDriverPayment()

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'approve' | 'reject'
  }>({ isOpen: false, type: 'approve' })

  const driver = driverData?.data

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

  const handleStatusUpdate = async (status: 'approved' | 'rejected', reason?: string) => {
    try {
      await updateStatusMutation.mutateAsync({ 
        id: driverId, 
        status, 
        reason,
        notes: reason ? `Status changed to ${status}: ${reason}` : `Status changed to ${status}`
      })
      setConfirmDialog({ isOpen: false, type: 'approve' })
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handlePaymentAction = async (action: 'approve' | 'reject' | 'retry') => {
    try {
      await updatePaymentMutation.mutateAsync({ id: driverId, action })
    } catch (err) {
      console.error('Error updating payment status:', err)
    }
  }

  const openConfirmDialog = (type: 'approve' | 'reject') => {
    setConfirmDialog({ isOpen: true, type })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !driver) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Failed to load driver details
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
              {driver.firstName} {driver.lastName}
            </h1>
            <p className="text-gray-600">Driver Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(driver.status)}`}>
            {driver.status}
          </span>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getPaymentStatusColor(driver.paymentStatus)}`}>
            {driver.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <p className="text-gray-900">{driver.firstName} {driver.middleName} {driver.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">{driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{driver.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{driver.cellNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Address</h2>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-900">{driver.streetNameNumber}</p>
                {driver.appUniteNumber && <p className="text-gray-900">{driver.appUniteNumber}</p>}
                <p className="text-gray-900">{driver.city}, {driver.province} {driver.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{driver.vehicleType}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Delivery Type</label>
                <p className="text-gray-900">{driver.deliveryType}</p>
              </div>
              {driver.vehicleMake && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Make</label>
                  <p className="text-gray-900">{driver.vehicleMake}</p>
                </div>
              )}
              {driver.vehicleModel && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Model</label>
                  <p className="text-gray-900">{driver.vehicleModel}</p>
                </div>
              )}
              {driver.yearOfManufacture && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Year</label>
                  <p className="text-gray-900">{driver.yearOfManufacture}</p>
                </div>
              )}
              {driver.vehicleColor && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Color</label>
                  <p className="text-gray-900">{driver.vehicleColor}</p>
                </div>
              )}
              {driver.vehicleLicensePlate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">License Plate</label>
                  <p className="text-gray-900">{driver.vehicleLicensePlate}</p>
                </div>
              )}
              {driver.driversLicenseClass && (
                <div>
                  <label className="text-sm font-medium text-gray-500">License Class</label>
                  <p className="text-gray-900">{driver.driversLicenseClass}</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {driver.profilePhotoUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Profile Photo</label>
                  <a href={driver.profilePhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Photo
                  </a>
                </div>
              )}
              {driver.driversLicenseFrontUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Driver's License (Front)</label>
                  <a href={driver.driversLicenseFrontUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {driver.driversLicenseBackUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Driver's License (Back)</label>
                  <a href={driver.driversLicenseBackUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {driver.vehicleRegistrationUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Vehicle Registration</label>
                  <a href={driver.vehicleRegistrationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {driver.vehicleInsuranceUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Vehicle Insurance</label>
                  <a href={driver.vehicleInsuranceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                </div>
              )}
              {driver.drivingAbstractUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Driving Abstract</label>
                  <a href={driver.drivingAbstractUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                  {driver.drivingAbstractDate && (
                    <p className="text-xs text-gray-500">Date: {new Date(driver.drivingAbstractDate).toLocaleDateString()}</p>
                  )}
                </div>
              )}
              {driver.criminalBackgroundCheckUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Criminal Background Check</label>
                  <a href={driver.criminalBackgroundCheckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    View Document
                  </a>
                  {driver.criminalBackgroundCheckDate && (
                    <p className="text-xs text-gray-500">Date: {new Date(driver.criminalBackgroundCheckDate).toLocaleDateString()}</p>
                  )}
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
              {driver.status === 'pending' && (
                <>
                  <button
                    onClick={() => openConfirmDialog('approve')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Driver
                  </button>
                  <button
                    onClick={() => openConfirmDialog('reject')}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Driver
                  </button>
                </>
              )}
              {driver.status === 'rejected' && (
                <button
                  onClick={() => openConfirmDialog('approve')}
                  disabled={updateStatusMutation.isPending}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Re-approve Driver
                </button>
              )}
            </div>
          </div>

          {/* Payment Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Actions</h2>
            <div className="space-y-3">
              {driver.paymentStatus === 'pending' && (
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
              {driver.paymentStatus === 'failed' && (
                <button
                  onClick={() => handlePaymentAction('retry')}
                  disabled={updatePaymentMutation.isPending}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
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
                  <p className="text-gray-900">{new Date(driver.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <p className="text-gray-900">{new Date(driver.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              {driver.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Remarks</label>
                  <p className="text-gray-900">{driver.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: 'approve' })}
        onConfirm={(reason) => handleStatusUpdate(confirmDialog.type === 'approve' ? 'approved' : 'rejected', reason)}
        title={confirmDialog.type === 'approve' ? 'Approve Driver' : 'Reject Driver'}
        message={
          confirmDialog.type === 'approve'
            ? `Are you sure you want to approve ${driver.firstName} ${driver.lastName}? This will change their status to approved.`
            : `Are you sure you want to reject ${driver.firstName} ${driver.lastName}? This will change their status to rejected.`
        }
        confirmText={confirmDialog.type === 'approve' ? 'Approve' : 'Reject'}
        type={confirmDialog.type}
        showReasonInput={confirmDialog.type === 'reject'}
        loading={updateStatusMutation.isPending}
      />
    </div>
  )
} 