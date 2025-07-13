import React, { useState } from 'react'
import { RotateCcw, Search, Calendar, Plus, Minus, X } from 'lucide-react'
import { HeaderWithMenu } from '../components/common/HeaderWithMenu'

interface ReturnsPageProps {
  onClose: () => void
}

export const ReturnsPage: React.FC<ReturnsPageProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFolio, setSearchFolio] = useState('')
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [showCreditNote, setShowCreditNote] = useState(false)
  const [returnData, setReturnData] = useState({
    tipoDevolucion: 'Tipo de devolución',
    fecha: '18/05/2025',
    motivo: 'Escribir motivo...',
    numeroFolio: '342043593'
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handleSearchReturn = () => {
    setShowReturnForm(true)
  }

  const handleConfirmReturn = () => {
    setShowCreditNote(true)
  }

  if (showCreditNote) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nota de crédito generada</h3>
            <button onClick={() => setShowCreditNote(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-6">Enviar por correo electrónico (Opcional)</p>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors">
                Enviar
              </button>
              <button 
                onClick={() => { setShowCreditNote(false); onClose(); }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <HeaderWithMenu title="Devolución" icon={<RotateCcw className="w-6 h-6 text-gray-600" />} />

      <div className="flex-1 flex">
        {/* Left Panel - Products */}
        <div className="flex-1 p-6 border-r border-gray-200">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ingresa aquí el producto o servicio"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Product Table Headers */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b pb-2 mb-4">
            <span>Producto</span>
            <span>Cantidad</span>
            <span>Descuento</span>
            <span>Importe</span>
          </div>

          {/* Product Item */}
          <div className="grid grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Ejemplo producto 1</span>
            <div className="flex items-center gap-2">
              <button className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center">1</span>
              <button className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300">
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="text-sm">0%</span>
            <div className="flex items-center justify-between">
              <span className="text-sm">34 $</span>
              <button className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4">
              N° Líneas 1 / Tot. items 1 | Nota de crédito manual (No...)
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mb-2">
              <span>Total</span>
              <span>204 $</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Anular venta
            </button>
          </div>
        </div>

        {/* Right Panel - Return Details */}
        <div className="w-96 p-6 bg-gray-50">
          {!showReturnForm ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800">📄 Folio de documento</span>
              </div>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ingresa aquí el número de folio"
                    value={searchFolio}
                    onChange={(e) => setSearchFolio(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Folio: 342043593</span>
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="text-sm">ℹ️</span>
                </button>
              </div>

              <button 
                onClick={handleSearchReturn}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Devolver
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de devolución</label>
                <select 
                  value={returnData.tipoDevolucion}
                  onChange={(e) => setReturnData(prev => ({ ...prev, tipoDevolucion: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Tipo de devolución</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <div className="flex items-center">
                  <input
                    type="date"
                    value="2025-05-18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="ml-2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea
                  value={returnData.motivo}
                  onChange={(e) => setReturnData(prev => ({ ...prev, motivo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de folio</label>
                <input
                  type="text"
                  value={returnData.numeroFolio}
                  onChange={(e) => setReturnData(prev => ({ ...prev, numeroFolio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                  <span>Devolución total</span>
                  <span>204 $</span>
                </div>
                
                <button 
                  onClick={handleConfirmReturn}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Confirmar devolución
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}