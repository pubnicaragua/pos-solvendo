import React, { useState } from 'react'
import { DollarSign } from 'lucide-react'
import { Button } from '../common/Button'
import { CashRegisterModal } from './CashRegisterModal'
import { usePOS } from '../../contexts/POSContext'

interface POSLayoutProps {
  children: React.ReactNode
}

export const POSLayout: React.FC<POSLayoutProps> = ({ children }) => {
  const [showCashModal, setShowCashModal] = useState(false)
  const [cashModalType, setCashModalType] = useState<'open' | 'close'>('open')
  const { cajaAbierta } = usePOS()

  // Show cash modal if cash register is not open
  React.useEffect(() => {
    if (!cajaAbierta) {
      setShowCashModal(true)
    }
  }, [cajaAbierta])

  const handleOpenCash = () => {
    setCashModalType('open')
    setShowCashModal(true)
  }

  return (
    <>
      {children}

      {/* Modals */}
      <CashRegisterModal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        type={cashModalType}
      />
    </>
  )
}