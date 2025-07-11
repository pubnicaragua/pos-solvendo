import React, { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { usePOS } from '../../contexts/POSContext'

interface CashCloseModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CashCloseModal: React.FC<CashCloseModalProps> = ({
  isOpen,
  onClose
}) => {
  const [loading, setLoading] = useState(false)
  const { closeCaja } = usePOS()

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

  // Mock data for cash close summary
  const cashSummary = {
    fechaCierre: '14/05/2025',
    horaCierre: '22:00',
    cajaId: 'Caja N°1',
    pedidosInformes: 'Pedidos informes',
    ventasTotales: 102,
    resumenVentas: [
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3x2x3x6', metodoPago: 'Tarjeta' },
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3x2x3x6', metodoPago: 'Tarjeta' },
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3x2x3x6', metodoPago: 'Efectivo' }
    ],
    totales: {
      tarjeta: 34,
      efectivo: 68,
      resumenCaja: 102,
      efectivoFinal: 68,
      tarjetaFinal: 34,
      retiroEfectivo: 2,
      totalReal: 102,
      diferencia: 36
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-gray-900">Cierre de caja</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Cash Summary */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del cierre</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value="2025-05-14"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de cierre</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value="22:00"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caja N°</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Caja N°1</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Resumen de documentos</span>
                </div>
                <div className="text-xs text-blue-600">Ventas totales</div>
                <div className="text-xs text-blue-600 mt-1">Pedidos informes</div>
              </div>

              {/* Sales Summary Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left">Tipo de documento</th>
                      <th className="px-3 py-2 text-left">Hora</th>
                      <th className="px-3 py-2 text-left">Folio</th>
                      <th className="px-3 py-2 text-left">Método de pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashSummary.resumenVentas.map((venta, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="px-3 py-2">{venta.tipo}</td>
                        <td className="px-3 py-2">{venta.cantidad}</td>
                        <td className="px-3 py-2">{venta.folio}</td>
                        <td className="px-3 py-2">{venta.metodoPago}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column - Totals */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-800 mb-1">Tarjeta ($)</div>
                  <div className="text-lg font-bold text-green-900">+ 34 $</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-800 mb-1">Efectivo ($)</div>
                  <div className="text-lg font-bold text-blue-900">+ 68 $</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-800 mb-1">Resumen de Caja</div>
                  <div className="text-lg font-bold text-gray-900">102 $</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-800 mb-1">Efectivo ($)</div>
                  <div className="text-lg font-bold text-green-900">+ 68 $</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-800 mb-1">Tarjeta ($)</div>
                  <div className="text-lg font-bold text-blue-900">+ 34 $</div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-sm text-red-800 mb-1">Retiro de efectivo</div>
                <div className="text-lg font-bold text-red-900">- 2 $</div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total teórico</span>
                  <span className="font-bold">{formatPrice(cashSummary.totales.totalReal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Diferencia</span>
                  <span className="font-bold">{formatPrice(cashSummary.totales.diferencia)}</span>
                </div>
              </div>

              <button
                onClick={handleCloseCash}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Cerrando caja...' : 'Cerrar caja'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}