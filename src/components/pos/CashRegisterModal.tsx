import React, { useState } from 'react'
import { DollarSign, Calculator } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
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
  const title = isOpenCash ? 'Efectivo inicial' : 'Cierre de caja'
  const subtitle = isOpenCash 
    ? 'Ingresa el monto inicial de efectivo' 
    : 'Confirma el cierre de caja del día'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {isOpenCash ? (
              <DollarSign className="w-8 h-8 text-blue-600" />
            ) : (
              <Calculator className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {isOpenCash && (
          <div className="mb-6">
            <Input
              label="Ingreso efectivo"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="0"
              icon={DollarSign}
              iconPosition="left"
              required
              autoFocus
            />
          </div>
        )}

        {!isOpenCash && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Fecha del cierre</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('es-CL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            onClick={handleSubmit}
            loading={loading}
            disabled={isOpenCash && !amount}
          >
            {isOpenCash ? 'Aperturar' : 'Cerrar caja'}
          </Button>
        </div>
      </div>
    </div>
  )
}