import React from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderWithMenuProps {
  title: string
  icon?: React.ReactNode
  showBackButton?: boolean
}

export const HeaderWithMenu: React.FC<HeaderWithMenuProps> = ({ 
  title, 
  icon,
  showBackButton = true
}) => {
  const { toggleSidebar, openSidebar } = useSidebar()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const userName = user ? `${user.nombre} ${user.apellidos}` : 'Usuario'
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)

  const handleBack = () => {
    navigate('/')
  }
  
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={showBackButton ? handleBack : openSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showBackButton ? icon : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
          <span className="text-lg font-semibold text-gray-900">{title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{getCurrentTime()}</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{userInitials}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  )
}