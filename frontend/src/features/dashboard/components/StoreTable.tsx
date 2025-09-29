import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import Input from '../../../components/common/Input'
import { Store } from '../../stores/types'
import Button from '../../../components/common/Button'

interface StoreTableProps {
  stores: Store[]
  loading: boolean
  onEdit: (store: Store) => void
  onDelete: (id: number) => void
}

type SortField = 'name' | 'email' | 'address' | 'avgRating'
type SortDirection = 'asc' | 'desc'

const StoreTable: React.FC<StoreTableProps> = ({ stores, loading ,onEdit,onDelete}) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedStores = stores
    .filter(
      (s) =>
        s.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        s.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        s.address.toLowerCase().includes(filters.address.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      return sortDirection === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1
    })

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDirection === 'asc' ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )
    ) : null

  if (loading) return <div className="py-4 text-center">Loading stores...</div>

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['name', 'email', 'address'] as const).map((key) => (
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
              {['name', 'email', 'address', 'avgRating'].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field as SortField)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                >
                  <div className="flex items-center space-x-1">
                    <span>{field}</span>
                    <SortIcon field={field as SortField} />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredAndSortedStores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{store.name}</td>
                <td className="px-6 py-4">{store.email}</td>
                <td className="px-6 py-4 truncate">{store.address}</td>
                <td className="px-6 py-4">
                  {store.avgRating?.toFixed(1)} ⭐ ({store.totalRatings})
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Button size="sm" onClick={() => onEdit(store)}>Edit</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(store.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedStores.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            No stores match the filters
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreTable