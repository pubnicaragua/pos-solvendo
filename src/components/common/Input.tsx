import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface InputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  value: string
  onChange: (value: string) => void
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  error?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  onEnter?: () => void
  className?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  iconPosition = 'left',
  error,
  required = false,
  disabled = false,
  autoFocus = false,
  onEnter,
  className = ''
}) => {
  const inputClasses = [
    'w-full px-4 py-3 text-gray-900 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2',
    Icon && iconPosition === 'left' ? 'pl-11' : '',
    Icon && iconPosition === 'right' ? 'pr-11' : '',
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200',
    disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'hover:border-gray-400',
    className
  ].filter(Boolean).join(' ')

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter()
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoFocus={autoFocus}
          className={inputClasses}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}