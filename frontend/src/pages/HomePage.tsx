import React from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import StoreList from '../features/stores/components/StoreList'
import { useAuth } from '../hooks/useAuth'

const HomePage: React.FC = () => {
  const { user } = useAuth() as { user: any }

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user ? `Welcome back, ${user.name}!` : 'Welcome to Store Rating'}
          </h1>
          <p className="mt-2 text-gray-600">
            Discover and rate stores in your area
          </p>
        </div>

        <StoreList />
      </div>
    </PageWrapper>
  )
}

export default HomePage