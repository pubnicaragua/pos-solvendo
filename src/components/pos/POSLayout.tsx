import React, { useState } from 'react'
import { Menu, User, Clock, DollarSign, LogOut, TrendingUp, Printer, FileText, Truck } from 'lucide-react'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { CashRegisterModal } from './CashRegisterModal'
import { CashCloseModal } from './CashCloseModal'
import { CashMovementModal } from './CashMovementModal'
import { ReprintModal } from './ReprintModal'
import { ReportsModal } from './ReportsModal'
import { DeliveryModal } from './DeliveryModal'
import { useAuth } from '../../contexts/AuthContext'
import { usePOS } from '../../contexts/POSContext'

interface POSLayoutProps {
  children: React.ReactNode
}

export const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCashModal, setShowCashModal] = useState(false)
  const [showCashCloseModal, setShowCashCloseModal] = useState(false)
  const [showCashMovementModal, setShowCashMovementModal] = useState(false)
  const [showReprintModal, setShowReprintModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [cashModalType, setCashModalType] = useState<'open' | 'close'>('open')
  const { user, logout } = useAuth()
  const { cajaAbierta } = usePOS()

  const handleOpenCash = () => {
    setCashModalType('open')
    setShowCashModal(true)
  }

  const handleCloseCash = () => {
    setShowCashCloseModal(true)
  }

  const handleLogout = async () => {
    await logout()
  }

  const currentTime = new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const menuItems = [
    { icon: TrendingUp, label: 'Movimiento', onClick: () => setShowCashMovementModal(true) },
    { icon: Printer, label: 'Reimprimir', onClick: () => setShowReprintModal(true) },
    { icon: FileText, label: 'Reportes', onClick: () => setShowReportsModal(true) },
    { icon: Truck, label: 'Despacho', onClick: () => setShowDeliveryModal(true) }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
                <span className="text-xl font-semibold text-gray-900">POS</span>
              </button>
              <Logo size="md" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
              </div>

              <div className="flex items-center gap-2">
                {!cajaAbierta ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={DollarSign}
                    onClick={handleOpenCash}
                  >
                    Abrir caja
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={DollarSign}
                    onClick={handleCloseCash}
                  >
                    Cerrar caja
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user?.nombre} {user?.apellidos}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="relative bg-white w-80 shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Módulos</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick()
                      setShowSidebar(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Modals */}
      <CashRegisterModal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        type={cashModalType}
      />

      <CashCloseModal
        isOpen={showCashCloseModal}
        onClose={() => setShowCashCloseModal(false)}
      />

      <CashMovementModal
        isOpen={showCashMovementModal}
        onClose={() => setShowCashMovementModal(false)}
      />

      <ReprintModal
        isOpen={showReprintModal}
        onClose={() => setShowReprintModal(false)}
      />

      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      <DeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
      />
    </div>
  )
}