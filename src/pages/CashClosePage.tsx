import React, { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import { usePOS } from '../contexts/POSContext'

interface CashClosePageProps {
  onClose: () => void
}

export const CashClosePage: React.FC<CashClosePageProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false)
  const { closeCaja } = usePOS()

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
    horaCierre: '22:50',
    cajaId: 'Pedro Infantas',
    pedidosInformes: 'Pedidos informes',
    ventasTotales: 102,
    resumenVentas: [
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3421456', metodoPago: 'Tarjeta' },
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3421456', metodoPago: 'Tarjeta' },
      { tipo: 'Boleta manual', cantidad: 22000, folio: '3421456', metodoPago: 'Efectivo' }
    ],
    totales: {
      tarjeta: 34,
      efectivo: 68,
      resumenCaja: 102,
      efectivoFinal: 68,
      tarjetaFinal: 34,
      retiroEfectivo: 2,
      totalReal: 66,
      diferencia: 36
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
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Cierre de caja</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">23:00</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">EA</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Emilio Aguilera</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
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
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora de cierre</label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value="22:50"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caja de</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                Pedro Infantas
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resumen de ventas</label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                102 $
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Tarjeta (1)</span>
                <span className="font-medium">+ 34 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Efectivo (2)</span>
                <span className="font-medium">+ 68 $</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Resumen de Caja</span>
                <span className="font-medium">102 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Efectivo (2)</span>
                <span className="font-medium">+ 68 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tarjeta (1)</span>
                <span className="font-medium">+ 34 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Retiro de efectivo</span>
                <span className="font-medium text-red-600">- 2 $</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total teórico</span>
                <span className="font-bold">102 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total real</span>
                <span className="font-bold">66 $</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Diferencia</span>
                <span className="font-bold">36 $</span>
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

          {/* Right Column - Documents Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">📄 Resumen de documentos</span>
            </div>

            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option>Ventas totales</option>
            </select>

            {/* Documents Table */}
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
                      <td className="px-3 py-2">22:00</td>
                      <td className="px-3 py-2">{venta.folio}</td>
                      <td className="px-3 py-2">{venta.metodoPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}