import React, { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, X } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { usePOS } from '../../contexts/POSContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface CashMovementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CashMovementModal: React.FC<CashMovementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [movementType, setMovementType] = useState<'ingreso' | 'retiro'>('retiro')
  const [amount, setAmount] = useState('')
  const [observation, setObservation] = useState('')
  const [loading, setLoading] = useState(false)
  const { empresaId, sucursalId, user } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!amount || !empresaId || !sucursalId || !user) return

    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('movimientos_caja')
        .insert({
          empresa_id: empresaId,
          sucursal_id: sucursalId,
          usuario_id: user.id,
          tipo: movementType,
          monto: parseFloat(amount),
          observacion: observation || `${movementType === 'ingreso' ? 'Ingreso' : 'Retiro'} de efectivo`
        })

      if (error) throw error
      
      onClose()
      setAmount('')
      setObservation('')
    } catch (error) {
      console.error('Error registering cash movement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Movimiento de efectivo</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de movimiento</h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMovementType('retiro')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  movementType === 'retiro'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="font-medium">Retiro de efectivo</span>
              </button>
              <button
                onClick={() => setMovementType('ingreso')}
                className={`p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                  movementType === 'ingreso'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium">Ingreso de efectivo</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <Input
              label="Monto del movimiento"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="0"
              icon={DollarSign}
              iconPosition="left"
              required
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observación
              </label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Escribe una observación..."
                className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400"
                rows={3}
              />
            </div>
          </div>

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
              disabled={!amount}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}