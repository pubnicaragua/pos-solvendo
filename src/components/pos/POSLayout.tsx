import React, { useState, useEffect } from 'react'
import { CashRegisterModal } from './CashRegisterModal'
import { usePOS } from '../../contexts/POSContext'

interface POSLayoutProps {
  children: React.ReactNode
}

export const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [showCashModal, setShowCashModal] = useState(false)
  const [cashModalType, setCashModalType] = useState<'open' | 'close'>('open')
  const { cajaAbierta, checkCajaStatus } = usePOS()

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