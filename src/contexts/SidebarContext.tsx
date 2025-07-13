import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SidebarContextType {
  isOpen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  handleSidebarAction: (action: string) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const handleSidebarAction = (action: string) => {
    switch (action) {
      case 'movimiento':
        navigate('/movimiento')
        break
      case 'reimprimir':
        navigate('/reimprimir')
        break
      case 'reportes':
        navigate('/reportes')
        break
      case 'despacho':
        navigate('/despacho')
        break
      case 'devolucion':
        navigate('/devolucion')
        break
      case 'promociones':
        navigate('/promociones')
        break
      case 'cierre':
        navigate('/cierre')
        break
      case 'arqueo':
        navigate('/arqueo')
        break
      case 'historial-movimientos':
        navigate('/historial-movimientos')
        break
      case 'categorias':
        navigate('/categorias')
        break
      case 'codigos-barras':
        navigate('/codigos-barras')
        break
      case 'historial-cliente':
        navigate('/historial-cliente')
        break
      case 'facturacion':
        navigate('/facturacion')
        break
      default:
        navigate('/')
        break
    }
    
    setIsOpen(false)
  }

  const value = {
    isOpen,
    toggleSidebar,
    closeSidebar,
    handleSidebarAction
  }

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}