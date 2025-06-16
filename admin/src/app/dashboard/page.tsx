'use client'
import { useEffect, useState } from 'react'
import { Users, Store } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import api, { endpoints } from '@/lib/api'

interface Stats {
  total: number
  pending: number
  approved: number
  paymentCompleted: number
}

interface DashboardData {
  drivers: Stats
  restaurants: Stats
}

interface ChartData {
  name: string
  value: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

const defaultStats: Stats = {
  total: 0,
  pending: 0,
  approved: 0,
  paymentCompleted: 0
}

export default function DashboardPage() {
  const [driverStats, setDriverStats] = useState<Stats | null>(null)
  const [restaurantStats, setRestaurantStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await api.get<{ success: boolean; data: DashboardData }>(endpoints.dashboard.stats)
        setDriverStats(res.data.data.drivers)
        setRestaurantStats(res.data.data.restaurants)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const getChartData = (stats: Stats): ChartData[] => [
    { name: 'Submitted', value: stats.pending },
    { name: 'Paid', value: stats.paymentCompleted },
    { name: 'Verified', value: stats.approved },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Drivers</p>
              <p className="text-2xl font-semibold text-gray-900">{driverStats?.total ?? '-'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-50 p-3 rounded-lg">
              <Store className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Restaurants</p>
              <p className="text-2xl font-semibold text-gray-900">{restaurantStats?.total ?? '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Driver Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getChartData(driverStats || defaultStats)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getChartData(driverStats || defaultStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Restaurant Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getChartData(restaurantStats || defaultStats)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getChartData(restaurantStats || defaultStats).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}




