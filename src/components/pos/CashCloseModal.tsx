import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, TrendingDown, X } from 'lucide-react'
import { Button } from '../common/Button'
import { usePOS } from '../../contexts/POSContext'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface CashCloseModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CashSummary {
  totalIngresos: number
  totalEgresos: number
  totalVentas: number
  diferencia: number
}

export const CashCloseModal: React.FC<CashCloseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [summary, setSummary] = useState<CashSummary>({
    totalIngresos: 0,
    totalEgresos: 0,
    totalVentas: 0,
    diferencia: 0
  })
  const [loading, setLoading] = useState(false)
  const { closeCaja } = usePOS()
  const { sucursalId } = useAuth()

  useEffect(() => {
    if (isOpen && sucursalId) {
      loadCashSummary()
    }
  }, [isOpen, sucursalId])

  const loadCashSummary = async () => {
    if (!sucursalId) return

    try {
      const today = new Date().toISOString().split('T')[0]

      // Get cash movements
      const { data: movimientos } = await supabase
        .from('movimientos_caja')
        .select('*')
        .eq('sucursal_id', sucursalId)
        .gte('fecha', `${today}T00:00:00`)

      // Get sales
      const { data: ventas } = await supabase
        .from('ventas')
        .select('total')
        .eq('sucursal_id', sucursalId)
        .gte('fecha', `${today}T00:00:00`)

      const totalIngresos = movimientos
        ?.filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + Number(m.monto), 0) || 0

      const totalEgresos = movimientos
        ?.filter(m => m.tipo === 'retiro')
        .reduce((sum, m) => sum + Number(m.monto), 0) || 0

      const totalVentas = ventas
        ?.reduce((sum, v) => sum + Number(v.total), 0) || 0

      setSummary({
        totalIngresos,
        totalEgresos,
        totalVentas,
        diferencia: totalIngresos - totalEgresos
      })
    } catch (error) {
      console.error('Error loading cash summary:', error)
    }
  }

  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handleCloseCash = async () => {
    setLoading(true)
    const success = await closeCaja()
    if (success) {
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Cierre de caja</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Resumen del día
            </h4>
            <p className="text-gray-600">
              {new Date().toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Total ingresos</span>
              </div>
              <span className="font-bold text-green-900">
                {formatPrice(summary.totalIngresos)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Total egresos</span>
              </div>
              <span className="font-bold text-red-900">
                {formatPrice(summary.totalEgresos)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Total ventas</span>
              </div>
              <span className="font-bold text-blue-900">
                {formatPrice(summary.totalVentas)}
              </span>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold text-gray-800">Diferencia</span>
                <span className="font-bold text-gray-900 text-lg">
                  {formatPrice(summary.diferencia)}
                </span>
              </div>
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
              onClick={handleCloseCash}
              loading={loading}
            >
              Cerrar caja
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}