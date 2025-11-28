import { getCompletionColor } from '@/lib/utils'

interface EmployeeCompletionMeterProps {
  percentage: number
  size?: 'small' | 'large'
}

export function EmployeeCompletionMeter({ percentage, size = 'small' }: EmployeeCompletionMeterProps) {
  if (size === 'large') {
    // Large circular progress for profile page
    const circumference = 2 * Math.PI * 70
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle with gold gradient */}
          <circle
            cx="96"
            cy="96"
            r="70"
            stroke="url(#goldGradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out drop-shadow-lg"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold gold-gradient bg-clip-text text-transparent">
            {percentage}%
          </span>
          <span className="text-sm text-gray-600">مكتمل</span>
        </div>
      </div>
    )
  }

  // Small linear progress for table
  const getGradient = (pct: number) => {
    if (pct >= 80) return 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
    if (pct >= 60) return 'linear-gradient(90deg, #EFB343 0%, #F6D36B 100%)'
    if (pct >= 40) return 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)'
    return 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
  }

  return (
    <div className="flex items-center gap-2 min-w-[130px]">
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full transition-all duration-500 shadow-sm"
          style={{ 
            width: `${percentage}%`,
            background: getGradient(percentage)
          }}
        />
      </div>
      <span className={`text-xs font-bold ${getCompletionColor(percentage)} min-w-[38px]`}>
        {percentage}%
      </span>
    </div>
  )
}

