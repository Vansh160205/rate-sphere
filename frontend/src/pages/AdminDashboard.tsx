import React, { useState, useEffect } from 'react'
import { Users, Store, Star, Plus } from 'lucide-react'
import PageWrapper from '../components/layout/PageWrapper'
import StatsCard from '../features/dashboard/components/StatsCard'
import UserTable from '../features/dashboard/components/UserTable'
import StoreTable from '../features/dashboard/components/StoreTable'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import Input from '../components/common/Input'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address must not exceed 400 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  role: z.enum(['USER', 'ADMIN', 'STORE_OWNER'])
})

const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address too short').max(400, 'Address too long'),
  ownerId: z.string().min(1, 'Owner is required') // will convert to number
})

type CreateStoreFormData = z.infer<typeof createStoreSchema>
type CreateUserFormData = z.infer<typeof createUserSchema>

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stores'>('overview')
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 })
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)
const [editingUser, setEditingUser] = useState<any | null>(null)
const [showEditUserModal, setShowEditUserModal] = useState(false)
const [editingStore, setEditingStore] = useState<any | null>(null)
const [showEditStoreModal, setShowEditStoreModal] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema)
  })

  const {
  register: registerStore,
  handleSubmit: handleStoreSubmit,
  reset: resetStore,
  formState: { errors: storeErrors },
} = useForm<CreateStoreFormData>({
  resolver: zodResolver(createStoreSchema),
})

const {
  register: registerEditUser,
  handleSubmit: handleEditUserSubmit,
  reset: resetEditUser,
  formState: { errors: editUserErrors }
} = useForm<any>() // no zod resolver for edit; keep flexible

const {
  register: registerEditStore,
  handleSubmit: handleEditStoreSubmit,
  reset: resetEditStore,
  formState: { errors: editStoreErrors }
} = useForm<any>() // no zod resolver for edit
  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, storesRes] = await Promise.all([
        api.get('/users/stats'),
        api.get('/users'),
        api.get('/stores')
      ])
      
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setStores(storesRes.data.stores || [])
    } catch (error: any) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onCreateUser = async (data: CreateUserFormData) => {
    try {
      await api.post('/users', data)
      toast.success('User created successfully!')
      setShowCreateUserModal(false)
      reset()
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user')
    }
  }

  const onCreateStore = async (data: CreateStoreFormData) => {
  try {
    await api.post('/stores', { ...data, ownerId: Number(data.ownerId) })
    toast.success('Store created successfully!')
    setShowCreateStoreModal(false)
    resetStore()
    fetchData()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to create store')
  }
}

const handleDeleteUser = async (id: number) => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await api.delete(`/users/${id}`)
    toast.success('User deleted')
    fetchData()
  } catch {
    toast.error('Failed to delete user')
  }
}
const handleEditUser = (user: any) => {
  setEditingUser(user)
  resetEditUser(user) // preload values into the form!
  setShowEditUserModal(true)
}
const handleDeleteStore = async (id: number) => {
  if (!confirm('Are you sure you want to delete this store?')) return
  try {
    await api.delete(`/stores/${id}`)
    toast.success('Store deleted')
    fetchData()
  } catch {
    toast.error('Failed to delete store')
  }
}
const handleEditStore = (store: any) => {
  setEditingStore(store)
  resetEditStore(store) // preload form with store data
  setShowEditStoreModal(true)
}

const onUpdateUser = async (data: any) => {
  try {
    console.log('Updating user with data:', data)
    console.log('Editing user ID:', editingUser.id)
    await api.put(`/users/${editingUser.id}`, data)
    toast.success('User updated successfully')
    setShowEditUserModal(false)
    fetchData()
  } catch {
    toast.error('Failed to update user')
  }
}
const onUpdateStore = async (data: any) => {
  try {
    console.log('Updating store with data:', data)
    console.log('Editing store ID:', editingStore.id)

    // Ensure ownerId is sent as number
    const payload = {
      ...data,
      ownerId: Number(data.ownerId),
    }

    await api.put(`/stores/${editingStore.id}`, payload)
    toast.success('Store updated successfully')
    setShowEditStoreModal(false)
    fetchData()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to update store')
  }
}
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage users, stores, and system overview</p>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: 'Users' },
              { key: 'stores', label: 'Stores' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<Users className="h-6 w-6" />}
              color="blue"
            />
            <StatsCard
              title="Total Stores"
              value={stats.totalStores}
              icon={<Store className="h-6 w-6" />}
              color="green"
            />
            <StatsCard
              title="Total Ratings"
              value={stats.totalRatings}
              icon={<Star className="h-6 w-6" />}
              color="purple"
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Users Management</h2>
              <Button
                onClick={() => setShowCreateUserModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </div>
            <UserTable users={users} loading={loading} onEdit={handleEditUser} onDelete={handleDeleteUser} />
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Stores Management</h2>
              <Button
                onClick={() => setShowCreateStoreModal(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Store</span>
              </Button>
            </div>
            <StoreTable stores={stores} loading={loading} onEdit={handleEditStore} onDelete={handleDeleteStore}/>
          </div>
        )}

        {/* Create User Modal */}
        <Modal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          title="Create New User"
        >
          <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
            <Input
              label="Name"
              {...register('name')}
              error={errors.name?.message}
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
            />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1">
                Create User
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateUserModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
            isOpen={showEditUserModal}
            onClose={() => setShowEditUserModal(false)}
            title="Edit User"
            >
            {editingUser && (
                <form onSubmit={handleEditUserSubmit(onUpdateUser)} className="space-y-4">
                <Input
                    label="Name"
                    {...registerEditUser('name')}
                    error={editUserErrors.name?.message as string | undefined}
                />
                <Input
                    label="Email"
                    type="email"
                    {...registerEditUser('email')}
                    error={editUserErrors.email?.message as string | undefined}
                />
                <Input
                    label="Address"
                    {...registerEditUser('address')}
                    error={editUserErrors.address?.message as string | undefined}
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select {...registerEditUser('role')} defaultValue={editingUser.role}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    </select>
                </div>
                <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">Update</Button>
                    <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowEditUserModal(false)}
                    className="flex-1"
                    >
                    Cancel
                    </Button>
                </div>
                </form>
            )}
            </Modal>

        {/* Create Store Modal */}
        <Modal
        isOpen={showCreateStoreModal}
        onClose={() => setShowCreateStoreModal(false)}
        title="Create New Store"
        >
        <form onSubmit={handleStoreSubmit(onCreateStore)} className="space-y-4">
            <Input
            label="Store Name"
            {...registerStore('name')}
            error={storeErrors.name?.message}
            />
            <Input
            label="Store Email"
            type="email"
            {...registerStore('email')}
            error={storeErrors.email?.message}
            />
            <Input
            label="Address"
            {...registerStore('address')}
            error={storeErrors.address?.message}
            />
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Owner
            </label>
            <select
                {...registerStore('ownerId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <option value="">Select a user (will become Store Owner)</option>
        {users
            .filter((u: any) => u.role === 'USER') 
            .map((u: any) => (
            <option key={u.id} value={u.id}>
                {u.name} ({u.email})
            </option>
            ))}
            </select>
            {storeErrors.ownerId && (
                <p className="mt-1 text-sm text-red-600">
                {storeErrors.ownerId.message}
                </p>
            )}
            </div>
            <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
                Create Store
            </Button>
            <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateStoreModal(false)}
                className="flex-1"
            >
                Cancel
            </Button>
            </div>
        </form>
        </Modal>

        {/* Edit Store Modal */}
        <Modal
        isOpen={showEditStoreModal}
        onClose={() => setShowEditStoreModal(false)}
        title="Edit Store"
        >
        {editingStore && (
            <form onSubmit={handleEditStoreSubmit(onUpdateStore)} className="space-y-4">
            <Input
                label="Store Name"
                {...registerEditStore('name')}
                error={editStoreErrors.name?.message as string | undefined}
            />
            <Input
                label="Store Email"
                type="email"
                {...registerEditStore('email')}
                error={editStoreErrors.email?.message as string | undefined}
            />
            <Input
                label="Address"
                {...registerEditStore('address')}
                error={editStoreErrors.address?.message as string | undefined}
            />

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Owner
                </label>
                <select
                {...registerEditStore('ownerId')}
                defaultValue={editingStore.ownerId}   // prefill existing owner
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                <option value="">Select an owner</option>
                {users.map((u: any) => (
                    <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                    </option>
                ))}
                </select>
                {editStoreErrors.ownerId && (
                <p className="mt-1 text-sm text-red-600">
                    {editStoreErrors.ownerId.message as string}
                </p>
                )}
            </div>
            <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">Update</Button>
                <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditStoreModal(false)}
                className="flex-1"
                >
                Cancel
                </Button>
            </div>
            </form>
        )}
        </Modal>


      </div>
    </PageWrapper>
  )
}

export default AdminDashboardPage