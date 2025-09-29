export interface Store {
  id: number
  name: string
  email: string
  address: string
  avgRating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
}

export interface Rating {
  id: number
  userId: string
  storeId: string
  value: number
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
  }
}

export interface CreateStoreRequest {
  name: string
  email: string
  address: string
  password: string
}

export interface CreateRatingRequest {
  storeId: number
  value: number
}

export interface UpdateRatingRequest {
  value: number
}