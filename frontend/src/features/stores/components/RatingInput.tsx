import React, { useState } from 'react'
import { Star } from 'lucide-react'
import Button from '../../../components/common/Button'

interface RatingInputProps {
  initialRating?: number
  onSubmit: (value: number) => void
  onCancel: () => void
}

const RatingInput: React.FC<RatingInputProps> = ({
  initialRating = 0,
  onSubmit,
  onCancel
}) => {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            onMouseEnter={() => setHoveredRating(i + 1)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 transition-colors"
          >
            <Star
              className={`h-6 w-6 ${
                i < (hoveredRating || rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={rating === 0}
          className="flex-1"
        >
          Submit
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default RatingInput