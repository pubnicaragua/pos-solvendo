import React from 'react'
import { Menu } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import { useNavigate } from 'react-router-dom'

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
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={showBackButton ? handleBack : toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showBackButton ? icon : <Menu className="w-6 h-6 text-gray-600" />}
          </button>
          <span className="text-lg font-semibold text-gray-900">{title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">EA</span>
            </div>
            <span className="text-sm font-medium text-gray-900">Emilio Aguilera</span>
          </div>
        </div>
      </div>
    </header>
  )
}