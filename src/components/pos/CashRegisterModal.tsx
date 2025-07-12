import React, { useState } from 'react'
import { DollarSign, X } from 'lucide-react'
import { usePOS } from '../../contexts/POSContext'

interface CashRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'open' | 'close'
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({
  isOpen,
  onClose,
  type
}) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { openCaja, closeCaja } = usePOS()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (type === 'open' && !amount) return

    setLoading(true)
    
    let success = false
    if (type === 'open') {
      success = await openCaja(parseFloat(amount))
    } else {
      success = await closeCaja()
    }

    if (success) {
      onClose()
      setAmount('')
    }
    
    setLoading(false)
  }

  const isOpenCash = type === 'open'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header con botón cerrar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center">
          {/* Ícono */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          
          {/* Título */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Efectivo inicial
          </h3>
          
          {/* Subtítulo */}
          <p className="text-gray-600 mb-6">
            Ingresar efectivo...
          </p>

          {/* Input de monto */}
          <div className="mb-6">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-center text-lg border-2 border-blue-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
              min="0"
              step="0.01"
            />
          </div>

          {/* Botón de acción */}
          <button
            onClick={handleSubmit}
            disabled={!amount || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-12"
          >
            {loading ? 'Procesando...' : 'Aperturar'}
          </button>
        </div>
      </div>
    </div>
  )
}