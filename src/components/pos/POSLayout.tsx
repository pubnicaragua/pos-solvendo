import React, { useState, useEffect } from 'react'
import { CashRegisterModal } from './CashRegisterModal'
import { Sidebar } from './Sidebar'
import { Menu } from 'lucide-react'
import { usePOS } from '../../contexts/POSContext'
import { useSidebar } from '../../contexts/SidebarContext'

interface POSLayoutProps {
  children: React.ReactNode
}

export const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [showCashModal, setShowCashModal] = useState(false)
  const [cashModalType, setCashModalType] = useState<'open' | 'close'>('open')
  const { cajaAbierta, checkCajaStatus } = usePOS()
  const { isOpen } = useSidebar()

  // Check cash register status on mount
  useEffect(() => {
    checkCajaStatus()
  }, [])

  // Show cash modal if cash register is not open
  useEffect(() => {
    if (!cajaAbierta) {
      setShowCashModal(true)
      setCashModalType('open')
    }
  }, [cajaAbierta])

  const handleCashModalClose = () => {
    // Only allow closing if cash register is open
    if (cajaAbierta) {
      setShowCashModal(false)
    }
  }

  return (
    <>
      <Sidebar />
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">POS</span>
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
      {children}

      {/* Cash Register Modal */}
      <CashRegisterModal
        isOpen={showCashModal}
        onClose={handleCashModalClose}
        type={cashModalType}
      />
    </>
  )
}