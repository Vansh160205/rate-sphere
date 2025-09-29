import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'
import api from '../../../lib/axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const signupSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address must not exceed 400 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
})

type SignupFormData = z.infer<typeof signupSchema>

const SignupForm: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupFormData) => {
  try {
    setLoading(true)
    
    // Debug: Log the data being sent
    console.log('Signup data being sent:', data)
    
    const response = await api.post('/auth/signup', data)
    
    console.log('Signup response:', response.data)
    toast.success('Account created successfully! Please login.')
    navigate('/login')
  } catch (error: any) {
    console.error('Signup error full details:', error)
    console.error('Error response data:', error.response?.data)
    console.error('Error response status:', error.response?.status)
    console.error('Error response headers:', error.response?.headers)
    
    // Show the actual error from backend
    if (error.response?.data) {
      console.log('Backend error details:', JSON.stringify(error.response.data, null, 2))
    }
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.error 
      || (error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : '')
      || 'Signup failed'
    
    toast.error(errorMessage)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          helperText="3-60 characters"
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Address"
          {...register('address')}
          error={errors.address?.message}
          helperText="Maximum 400 characters"
        />
        
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
          helperText="8-16 characters, include uppercase and special character"
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
        >
          Sign Up
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-500">
          Login
        </Link>
      </p>
    </div>
  )
}

export default SignupForm