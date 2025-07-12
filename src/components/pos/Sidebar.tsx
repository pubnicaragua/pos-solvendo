import React from 'react'
import { X, TrendingUp, Printer, BarChart3, Truck, RotateCcw, DollarSign, Star } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null

  const menuItems = [
    { id: 'movimiento', label: 'Movimiento', icon: TrendingUp },
    { id: 'reimprimir', label: 'Reimprimir', icon: Printer },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 },
    { id: 'despacho', label: 'Despacho', icon: Truck },
    { id: 'devolucion', label: 'Devolución', icon: RotateCcw },
    { id: 'promociones', label: 'Promociones', icon: Star },
    { id: 'cierre', label: 'Cierre de caja', icon: DollarSign }
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="flex-1 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar - Opens from RIGHT */}
      <div className="w-80 bg-white h-full shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Módulos</h2>
          <button
            onClick={onClose}
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
                onClick={() => onAction(item.id)}
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
}</parameter>