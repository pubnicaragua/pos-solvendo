import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface CashMovementPageProps {
  onClose: () => void
}

export const CashMovementPage: React.FC<CashMovementPageProps> = ({ onClose }) => {
  const [movementType, setMovementType] = useState<'ingreso' | 'retiro'>('retiro')
  const [amount, setAmount] = useState('')
  const [observation, setObservation] = useState('Escribe tu observación...')
  const [loading, setLoading] = useState(false)
  const [movements, setMovements] = useState<any[]>([])
  const { user, empresaId, sucursalId } = useAuth()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadMovements()
  }, [])

  const loadMovements = async () => {
    if (!empresaId) return

    try {
      const { data, error } = await supabase
        .from('movimientos_caja')
        .select('*')
        .eq('fecha::date', today)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMovements(data || [])
    } catch (error) {
      console.error('Error loading movements:', error)
    }
  }

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !user) return

    setLoading(true)
    
    try {
      // Get current apertura_caja
      const { data: apertura } = await supabase
        .from('aperturas_caja')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('estado', 'abierta')
        .single()

      if (!apertura) {
        throw new Error('No hay caja abierta')
      }

      const { error } = await supabase
        .from('movimientos_caja')
        .insert([{
          apertura_caja_id: apertura.id,
          usuario_id: user.id,
          tipo: movementType,
          monto: parseFloat(amount),
          observacion: observation === 'Escribe tu observación...' ? '' : observation
        }])

      if (error) throw error

      // Reset form
      setAmount('')
      setObservation('Escribe tu observación...')
      loadMovements()
    } catch (error) {
      console.error('Error registering movement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Movimiento de efectivo</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">22:00</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">EA</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Emilio Aguilera</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Form */}
        <div className="w-1/2 bg-white p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Número de caja</label>
              <select className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-100">
                <option>Caja N°1</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha movimiento</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  defaultValue={today}
                  className="flex-1 h-12 px-4 rounded-lg border border-gray-200 bg-gray-100"
                />
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de movimiento</label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value as 'ingreso' | 'retiro')}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-100"
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
                placeholder="0 $"
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observación</label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full h-24 px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
              className="flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* Right Panel - Available Movements */}
        <div className="w-1/2 bg-gray-50 p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Movimientos disponibles</span>
            </div>
            <div className="text-xs text-blue-600">Fecha movimiento: {today}</div>
            <div className="text-xs text-blue-600 mt-1">
              {movements.length === 0 ? 'Sin registros' : `${movements.length} movimientos`}
            </div>
          </div>

          {movements.length > 0 && (
            <div className="mt-4 space-y-2">
              {movements.map((movement) => (
                <div key={movement.id} className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{movement.tipo}</span>
                    <span className="text-sm font-semibold">
                      {movement.tipo === 'ingreso' ? '+' : '-'}${movement.monto}
                    </span>
                  </div>
                  {movement.observacion && (
                    <p className="text-xs text-gray-600 mt-1">{movement.observacion}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}