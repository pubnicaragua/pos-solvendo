import React, { useState } from 'react'
import { X, Search, Minus, Plus } from 'lucide-react'

interface ReturnsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ReturnsModal: React.FC<ReturnsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchFolio, setSearchFolio] = useState('')
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [showCreditNote, setShowCreditNote] = useState(false)
  const [returnData, setReturnData] = useState({
    tipoDevolucion: 'Tipo de devolución',
    fecha: '19/05/2025',
    motivo: 'Escribir motivo...',
    numeroFolio: '3x2x3x2031'
  })

  if (!isOpen) return null

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
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nota de crédito generada</h3>
            <p className="text-gray-600 mb-6">Enviar por correo electrónico (Opcional)</p>
            
            <div className="flex gap-3">
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
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

  if (showReturnForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Devolución</h3>
            <button onClick={() => setShowReturnForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Products */}
            <div className="flex-1 p-6 border-r border-gray-200">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ingresa aquí el producto o servicio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-800">Folio de documento</span>
                </div>
                <div className="text-xs text-blue-600">Ingresa aquí el número de folio</div>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Ingresa aquí el número de folio"
                    className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Product Table */}
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                  <span>Producto</span>
                  <span>Cantidad</span>
                  <span>Descuento</span>
                  <span>Importe</span>
                </div>
                
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
                    <span className="text-sm">{formatPrice(34500)}</span>
                    <button className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-4">
                  N° Líneas / Tot. Items: 1 | Nota de crédito manual (No...)
                </div>
                <div className="flex justify-between items-center text-lg font-semibold mb-2">
                  <span>Total</span>
                  <span>{formatPrice(204)} $</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Devolución total</span>
                  <span>{formatPrice(204)} $</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Return Details */}
            <div className="w-96 p-6">
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
                  <input
                    type="date"
                    value="2025-05-19"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
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
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cliente"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Cancelar
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                      Anular venta
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleConfirmReturn}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Confirmar devolución
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Devolución</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ingresa aquí el producto o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Folio de documento</span>
            </div>
            <div className="text-xs text-blue-600">Ingresa aquí el número de folio</div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Folio: 3x2x3x2031"
                value={searchFolio}
                onChange={(e) => setSearchFolio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Product Table */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
              <span>Producto</span>
              <span>Cantidad</span>
              <span>Descuento</span>
              <span>Importe</span>
            </div>
            
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
                <span className="text-sm">{formatPrice(34500)}</span>
                <button className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="text-sm text-gray-600 mb-4">
              N° Líneas / Tot. Items: 1 | Nota de crédito manual (No...)
            </div>
            <div className="flex justify-between items-center text-lg font-semibold mb-2">
              <span>Total</span>
              <span>{formatPrice(204)} $</span>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cliente"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSearchReturn}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Devolver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}