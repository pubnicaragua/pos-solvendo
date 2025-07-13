import React from 'react'
import { X, TrendingUp, Printer, BarChart3, Truck, RotateCcw, DollarSign, Star, Users, Scan, History } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'

export const Sidebar: React.FC = () => {
  const { isOpen, closeSidebar, handleSidebarAction } = useSidebar()
  
  // Siempre renderizar el sidebar, pero ocultarlo cuando no está abierto
  const sidebarClasses = isOpen 
    ? "fixed inset-0 z-50 flex" 
    : "fixed inset-0 z-50 flex pointer-events-none";

  const menuItems = [
    { id: 'movimiento', label: 'Movimiento', icon: TrendingUp },
    { id: 'reimprimir', label: 'Reimprimir', icon: Printer },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'despacho', label: 'Despacho', icon: Truck },
    { id: 'devolucion', label: 'Devolución', icon: RotateCcw },
    { id: 'promociones', label: 'Promociones', icon: Star },
    { id: 'cierre', label: 'Cierre de caja', icon: DollarSign },
    { id: 'arqueo', label: 'Arqueo de caja', icon: DollarSign },
    { id: 'historial-movimientos', label: 'Historial movimientos', icon: History },
    { id: 'categorias', label: 'Gestión categorías', icon: Star },
    { id: 'codigos-barras', label: 'Códigos de barras', icon: Scan },
    { id: 'historial-cliente', label: 'Historial cliente', icon: Users }
  ]

  return (
    <div className={sidebarClasses}>
      {/* Overlay */}
      <div 
        className={`bg-black transition-opacity duration-300 ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'} flex-grow`}
        onClick={closeSidebar}
      />
      
      {/* Sidebar - Opens from left */}
      <div className={`w-80 bg-white h-full shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Módulos</h2>
          <button
            onClick={closeSidebar}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSidebarAction(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}