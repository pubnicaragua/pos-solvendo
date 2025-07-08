import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800 shadow-sm',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800 shadow-sm',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 active:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800 shadow-sm'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-base gap-2 min-h-[48px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[56px]'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'
  const loadingClasses = 'cursor-wait'
  const fullWidthClasses = fullWidth ? 'w-full' : ''

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabled && disabledClasses,
    loading && loadingClasses,
    fullWidthClasses,
    className
  ].filter(Boolean).join(' ')

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18} />
      ) : null}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18} />
      )}
    </button>
  )
}