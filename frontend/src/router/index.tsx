import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import AdminDashboardPage from '../pages/AdminDashboard'
import StoreOwnerDashboardPage from '../pages/StoreOwnerDashboardPage'
import NotFoundPage from '../pages/NotFoundPage'
import { useAuth } from '../hooks/useAuth'

const AppRouter: React.FC = () => {
  const auth = useAuth()
  const user = auth && typeof auth === 'object' && auth !== null && 'user' in auth ? auth.user : null

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <SignupPage />
          )
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <StoreOwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter