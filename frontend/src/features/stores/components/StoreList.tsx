import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Input from '../../../components/common/Input'
import StoreCard from './StoreCard'
import { useStores } from '../api/useStores'
import { useAuth } from '../../../hooks/useAuth'

const StoreList: React.FC = () => {
  const [searchName, setSearchName] = useState('')
  const [searchAddress, setSearchAddress] = useState('')
  const { user } = useAuth()
  
  const {
    stores,
    userRatings,
    loading,
    fetchStores,
    submitRating,
    updateRating
  } = useStores()

  useEffect(() => {
    fetchStores(searchName, searchAddress)
  }, [searchName, searchAddress])

  const handleRatingSubmit = async (storeId: number,value: number) => {
    await submitRating(storeId, value)
    fetchStores(searchName, searchAddress) // Refresh data
  }

  const handleRatingUpdate = async (ratingId: number, value: number) => {
    await updateRating(ratingId, value)
    fetchStores(searchName, searchAddress) // Refresh data
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Search Stores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Search by Name"
            placeholder="Enter store name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            label="Search by Address"
            placeholder="Enter address..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>
      </div>

      {/* Store List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => {
          const userRating = userRatings.find(r => r.storeId === store.id)
          return (
            <StoreCard
              key={store.id}
              store={store}
              userRating={userRating?.value}
              ratingId={userRating?.id}
              onRatingSubmit={handleRatingSubmit}
              onRatingUpdate={handleRatingUpdate}
            />
          )
        })}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No stores found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

export default StoreList