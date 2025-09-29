import { useState } from 'react'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'
import { Store, Rating } from '../types'

interface UserRating {
  id: number
  storeId: number
  value: number
}

export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([])
  const [userRatings, setUserRatings] = useState<UserRating[]>([])
  const [loading, setLoading] = useState(false)

   const fetchStores = async (name?: string, address?: string) => {
    try {
      setLoading(true)
      console.log('Fetching stores with params:', { name, address })
      
      const params = new URLSearchParams()
      if (name) params.append('name', name)
      if (address) params.append('address', address)

      const url = `/stores${params.toString() ? '?' + params.toString() : ''}`
      console.log('Making request to:', url)
      
      const response = await api.get(url)
      console.log('Stores response:', response.data)
      
      setStores(response.data.stores || response.data || [])
      setUserRatings(response.data.stores.ratings || [])
    } catch (error: any) {
      console.error('Fetch stores error:', error)
      console.error('Error response:', error.response?.data)
      toast.error('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }
  const submitRating = async (storeId: number, value: number) => {
    try {
      await api.post('/ratings', { storeId, value })
      toast.success('Rating submitted successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit rating')
    }
  }

  const updateRating = async (ratingId: number, value: number) => {
    try {
      await api.put(`/ratings/${ratingId}`, { value })
      toast.success('Rating updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update rating')
    }
  }

  return {
    stores,
    userRatings,
    loading,
    fetchStores,
    submitRating,
    updateRating
  }
}