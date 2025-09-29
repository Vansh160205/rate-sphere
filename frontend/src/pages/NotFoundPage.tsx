import React from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import Button from '../components/common/Button'

const NotFoundPage: React.FC = () => {
  return (
    <PageWrapper>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-xl text-gray-600">Page not found</p>
          <p className="mt-2 text-gray-500">
            The page you're looking for doesn't exist.
          </p>
          <div className="mt-6">
            <Link to="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default NotFoundPage