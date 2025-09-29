import React from 'react'

interface StatsCardProps {
  title: string
  value: number
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
}) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center">
      <div className={`${colorClasses[color]} rounded-md p-3 text-white`}>
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-lg font-semibold text-gray-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default StatsCard