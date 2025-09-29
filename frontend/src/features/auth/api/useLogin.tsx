import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'

interface LoginData {
  email: string
  password: string
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const login = async (data: LoginData) => {
    try {
      setLoading(true)
      const response = await api.post('/auth/login', data)
      console.log('Login response:', response.data)
      const { token, user } = response.data

      localStorage.setItem('token', token)
      setUser(user)
      
      toast.success('Login successful!')
      
      // Redirect based on role
      switch (user.role) {
        case 'ADMIN':
          navigate('/admin/dashboard')
          break
        case 'STORE_OWNER':
          navigate('/store-owner/dashboard')
          break
        default:
          navigate('/')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return { login, loading }
}