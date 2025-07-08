import React, { useState } from 'react'
import { CreditCard, DollarSign, Smartphone, X } from 'lucide-react'
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
  const [selectedMethod, setSelectedMethod] = useState<string>('efectivo')
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

  const paymentMethods = [
    { id: 'efectivo', name: 'Efectivo', icon: DollarSign },
    { id: 'tarjeta', name: 'Tarjeta', icon: CreditCard },
    { id: 'transferencia', name: 'Transferencia', icon: Smartphone }
  ]

  const dteTypes = [
    { id: 'boleta', name: 'Boleta electrónica' },
    { id: 'factura', name: 'Factura electrónica' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Métodos de pago</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Método de pago</h4>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <method.icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Document Type */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de documento</h4>
            <div className="space-y-2">
              {dteTypes.map((dte) => (
                <button
                  key={dte.id}
                  onClick={() => setSelectedDte(dte.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    selectedDte === dte.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{dte.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cash Payment Details */}
        {selectedMethod === 'efectivo' && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total a pagar
                </label>
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(total)}
                </div>
              </div>
              <div>
                <Input
                  label="Efectivo recibido"
                  type="number"
                  value={amountReceived}
                  onChange={setAmountReceived}
                  placeholder="0"
                  icon={DollarSign}
                  iconPosition="left"
                />
              </div>
            </div>
            
            {amountReceived && parseFloat(amountReceived) >= total && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Vuelto:</span>
                  <span className="text-lg font-bold text-green-900">
                    {formatPrice(calculateChange())}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
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
            disabled={
              selectedMethod === 'efectivo' 
                ? !amountReceived || parseFloat(amountReceived) < total
                : false
            }
          >
            Confirmar pago
          </Button>
        </div>
      </div>
    </div>
  )
}