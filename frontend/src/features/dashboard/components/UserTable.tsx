import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Input from '../../../components/common/Input'
import Button from '../../../components/common/Button'

interface User {
  id: number
  name: string
  email: string
  address: string
  role: string
  averageRating?: number | null
}

interface UserTableProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void     // add
  onDelete: (id: number) => void   // add
}

type SortField = 'name' | 'email' | 'address' | 'role'
type SortDirection = 'asc' | 'desc'

const UserTable: React.FC<UserTableProps> = ({ users, loading,onEdit,onDelete }) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        user.role.toLowerCase().includes(filters.role.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField].toString().toLowerCase()
      const bValue = b[sortField].toString().toLowerCase()
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  if (loading) return <div className="py-4 text-center">Loading users...</div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['name', 'email', 'address', 'role'] as const).map((key) => (
          <Input
            key={key}
            placeholder={`Filter by ${key}...`}
            value={filters[key]}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [key]: e.target.value }))
            }
          />
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['name', 'email', 'address', 'role'].map((field) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort(field as SortField)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{field}</span>
                    <SortIcon field={field as SortField} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 truncate">{user.address}</td>
                <td className="px-6 py-4">{user.role.replace('_', ' ')}</td>
                <td className="px-6 py-4">
                  {user.role === 'STORE_OWNER' && user.averageRating
                    ? `${user.averageRating.toFixed(1)} ⭐`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Button size="sm" onClick={() => onEdit(user)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(user.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedUsers.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            No users match the filters
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTable