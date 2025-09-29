import React, { useState, useEffect } from 'react'
import { Star, Users } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import StatsCard from '../features/dashboard/components/StatsCard'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'

interface StoreRating {
  id: string
  rating: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character'),
})

type PasswordFormData = z.infer<typeof passwordSchema>

const StoreOwnerDashboardPage: React.FC = () => {
  const { user } = useAuth() as { user: any }
  const [storeData, setStoreData] = useState<any>(null)
  const [ratings, setRatings] = useState<StoreRating[]>([])
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // ✅ useForm must be inside component
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      console.log('Fetching store data for user:', user?.id)
      let response = await api.get(`/stores/owner/${user?.id}`)
      console.log('Store data response:', response.data)
      setStoreData(response.data)
      response=await api.get(`/ratings/store/${response.data.id}`)
      console.log('Ratings data response:', response.data)
      setRatings(response.data.ratings || [])
    } catch (error: any) {
      toast.error('Failed to fetch store data')
    } finally {
      setLoading(false)
    }
  }

  const onChangePassword = async (data: PasswordFormData) => {
    try {
      await api.put('/users/me/password', data)
      toast.success('Password updated successfully!')
      setShowPasswordModal(false)
      resetPasswordForm()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchStoreData()
    }
  }, [user])

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Dashboard</h1>
          <div className="space-x-2">
            <Button onClick={() => setShowPasswordModal(true)}>Change Password</Button>
          </div>
          <p className="mt-2 text-gray-600">Monitor your store's performance and ratings</p>
        </div>

        {/* ✅ Store Details Section */}
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Store Details</h2>
          <p><strong>Name:</strong> {storeData?.name}</p>
          <p><strong>Email:</strong> {storeData?.email}</p>
          <p><strong>Address:</strong> {storeData?.address}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatsCard
            title="Average Rating"
            value={storeData?.avgRating || 0}
            icon={<Star className="h-6 w-6" />}
            color="orange"
          />
          <StatsCard
            title="Total Ratings"
            value={storeData?.totalRatings || 0}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
        >
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <Input
              label="Old Password"
              type="password"
              {...registerPassword('oldPassword')}
              error={passwordErrors.oldPassword?.message}
            />
            <Input
              label="New Password"
              type="password"
              {...registerPassword('newPassword')}
              error={passwordErrors.newPassword?.message}
            />
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">Update</Button>
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Ratings List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Customer Ratings</h2>
          </div>
          
          {ratings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {ratings.map((rating) => (
                <div key={rating.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {rating.user.name}
                      </p>
                      <p className="text-sm text-gray-500">{rating.user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No ratings received yet.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}

export default StoreOwnerDashboardPage