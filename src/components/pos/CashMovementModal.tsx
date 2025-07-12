import React, { useState } from 'react'
import { TrendingUp, X, Calendar } from 'lucide-react'
import { Button } from '../common/Button'
import { usePOS } from '../../contexts/POSContext'
import { useAuth } from '../../contexts/AuthContext'

interface CashMovementModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CashMovementModal: React.FC<CashMovementModalProps> = ({
  isOpen,
  onClose
}) => {
  const [movementType, setMovementType] = useState<'ingreso' | 'retiro'>('retiro')
  const [amount, setAmount] = useState('0')
  const [observation, setObservation] = useState('Escribe tu observación...')
  const [loading, setLoading] = useState(false)
  const { empresaId, sucursalId, user } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !empresaId || !sucursalId || !user) return

    setLoading(true)
    
    try {
      // For demo, just simulate the movement
      console.log('Cash movement:', { movementType, amount, observation })
      
      onClose()
      setAmount('0')
      setObservation('Escribe tu observación...')
    } catch (error) {
      console.error('Error registering cash movement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Movimiento de efectivo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Form */}
          <div className="w-1/2 p-6 bg-white">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de caja</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Caja N°1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha movimiento</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    defaultValue="2025-05-19"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de movimiento</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as 'ingreso' | 'retiro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="retiro">Retiro de efectivo</option>
                  <option value="ingreso">Ingreso de efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monto movimiento</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observación</label>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                />
              </div>
            </div>

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
                onClick={handleSubmit}
                loading={loading}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Guardar
              </Button>
            </div>
          </div>

          {/* Right Panel - Available Movements */}
          <div className="w-1/2 p-6 bg-gray-50 border-l border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Movimientos disponibles</span>
              </div>
              <div className="text-xs text-blue-600">Fecha movimiento: 19/05/2025</div>
              <div className="text-xs text-blue-600 mt-1">Sin registros</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}