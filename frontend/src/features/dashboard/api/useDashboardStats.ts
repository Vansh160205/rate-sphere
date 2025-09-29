import { useState, useEffect } from 'react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

export interface DashboardStats {
  totalUsers: number
  totalStores: number
  totalRatings: number
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users/stats')
      setStats(data)
    } catch (error: any) {
      toast.error('Failed to load dashboard stats')
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, loading, refetch: fetchStats }
}