import React, { useState } from 'react'
import { CreditCard, DollarSign, Smartphone, X, Copy, Plus } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { usePOS } from '../../contexts/POSContext'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: (metodoPago: string, tipoDte: string) => void
  total: number
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentComplete,
  total
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('cheque')
  const [selectedDte, setSelectedDte] = useState<string>('boleta')
  const [amountReceived, setAmountReceived] = useState('')
  const [loading, setLoading] = useState(false)
  const { mediosPago } = usePOS()

  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const calculateChange = () => {
    const received = parseFloat(amountReceived) || 0
    return Math.max(0, received - total)
  }

  const handleConfirmPayment = async () => {
    setLoading(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onPaymentComplete(selectedMethod, selectedDte)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Pagar</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Facturación</h4>
            
            {/* Document Type Selection */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dte"
                    value="boleta"
                    checked={selectedDte === 'boleta'}
                    onChange={(e) => setSelectedDte(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>Boleta electrónica</span>
                </label>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm">Envío inmediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Despacho</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <span className="text-sm">Documentos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Agregar cupón</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Métodos de pago</h4>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="cheque">Cheque</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total a pagar</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total pagado</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Vuelto</span>
                <span>$0</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              onClick={handleConfirmPayment}
              loading={loading}
            >
              Confirmar pago
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}