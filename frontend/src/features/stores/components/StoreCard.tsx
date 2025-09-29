import React, { useState } from 'react'
import { Star, MapPin, Mail } from 'lucide-react'
import { Store } from '../types'
import Button from '../../../components/common/Button'
import RatingInput from './RatingInput'
import { useAuth } from '../../../hooks/useAuth'

interface StoreCardProps {
  store: Store
  userRating?: number
  onRatingSubmit: (storeId: number, rating: number) => void
  onRatingUpdate: (ratingId: number, rating: number) => void
  ratingId?: number
}

const StoreCard: React.FC<StoreCardProps> = ({
  store,
  userRating,
  onRatingSubmit,
  onRatingUpdate,
  ratingId
}) => {
  const { user } = useAuth()
  const [showRatingInput, setShowRatingInput] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleRatingSubmit = (rating: number) => {
    if (userRating && ratingId) {
      onRatingUpdate(ratingId, rating)
    } else {
      onRatingSubmit(store.id, rating)
    }
    setShowRatingInput(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
        <div className="flex items-center space-x-1">
          {renderStars(store.avgRating)}
          <span className="text-sm text-gray-600 ml-1">
            ({store.totalRatings})
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          <span className="text-sm">{store.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm">{store.address}</span>
        </div>
      </div>

      {user?.role === 'USER' && (
        <div className="border-t pt-4">
          {userRating && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Your Rating:</span>
              <div className="flex items-center space-x-1">
                {renderStars(userRating)}
              </div>
            </div>
          )}

          {showRatingInput ? (
            <RatingInput
              initialRating={userRating}
              onSubmit={handleRatingSubmit}
              onCancel={() => setShowRatingInput(false)}
            />
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowRatingInput(true)}
              className="w-full"
            >
              {userRating ? 'Update Rating' : 'Rate Store'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default StoreCard