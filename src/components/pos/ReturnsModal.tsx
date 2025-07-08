import React, { useState } from 'react'
import { RotateCcw, Search, X, Calendar } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'

interface ReturnsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ReturnsModal: React.FC<ReturnsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchFolio, setSearchFolio] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReturnForm, setShowReturnForm] = useState(false)
  const [showCreditNote, setShowCreditNote] = useState(false)
  const [returnData, setReturnData] = useState({
    fecha: '19/05/2025',
    motivo: 'Escribir motivo...',
    numeroFolio: '3x2x3x2031'
  })

  if (!isOpen) return null

  const handleSearchSale = async () => {
    if (!searchFolio) return
    
    setLoading(true)
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000))
    setShowReturnForm(true)
    setLoading(false)
  }

  const handleConfirmReturn = () => {
    setShowCreditNote(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  if (showCreditNote) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nota de crédito generada</h3>
            <p className="text-gray-600 mb-6">Enviar por correo electrónico (Opcional)</p>
            
            <div className="flex gap-3 mb-6">
              <Button variant="outline" fullWidth>
                Enviar
              </Button>
              <Button fullWidth onClick={() => { setShowCreditNote(false); onClose(); }}>
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showReturnForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Devolución</h3>
            </div>
            <button
              onClick={() => setShowReturnForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex h-[calc(80vh-80px)]">
            {/* Left Panel - Products */}
            <div className="flex-1 p-6 border-r border-gray-200">
              <div className="mb-6">
                <Input
                  placeholder="Ingresa aquí el producto o servicio..."
                  icon={Search}
                  iconPosition="left"
                />
              </div>

              {/* Available Documents Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-800">Folio de documento</span>
                </div>
                <div className="text-xs text-blue-600">Ingresa aquí el número de folio</div>
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
                    <button className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">-</button>
                    <span className="w-8 text-center">1</span>
                    <button className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">+</button>
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
                <div className="flex justify-between items-center text-lg font-semibold mb-4">
                  <span>Total</span>
                  <span>{formatPrice(34500)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Devolución total</span>
                  <span>{formatPrice(34500)}</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Return Details */}
            <div className="w-96 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de devolución</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Tipo de devolución</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value="2025-05-19"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <Calendar className="w-4 h-4 text-gray-400" />
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
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-4">
                  N° Líneas / Tot. Items: 1 | Nota de crédito manual (No...)
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Cliente"
                    icon={Search}
                    iconPosition="left"
                  />
                  
                  <div className="flex gap-3">
                    <Button variant="outline" fullWidth>
                      Cancelar
                    </Button>
                    <Button variant="outline" fullWidth>
                      Anular venta
                    </Button>
                  </div>
                  
                  <Button fullWidth onClick={handleConfirmReturn}>
                    Confirmar devolución
                  </Button>
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
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Devolución</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Buscar venta para devolver
            </h4>
            <p className="text-gray-600">
              Ingresa el número de folio de la venta
            </p>
          </div>

          {/* Available Documents Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Folio de documento</span>
            </div>
            <div className="text-xs text-blue-600">Ingresa aquí el número de folio</div>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Folio: 3x2x3x2031"
                value={searchFolio}
                onChange={setSearchFolio}
                icon={Search}
                iconPosition="left"
              />
            </div>
            <Button
              onClick={handleSearchSale}
              loading={loading}
              disabled={!searchFolio}
            >
              Buscar
            </Button>
          </div>

          {/* Mock sale found */}
          {searchFolio && !loading && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">Venta encontrada</h5>
                  <p className="text-sm text-gray-600">Folio: {searchFolio}</p>
                  <p className="text-sm text-gray-600">Fecha: 14/05/2025</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">$34.500</p>
                  <p className="text-sm text-gray-600">Efectivo</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Ejemplo producto 1</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">1 x $34.500</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" fullWidth>
                  Cancelar
                </Button>
                <Button fullWidth onClick={() => setShowReturnForm(true)}>
                  Confirmar devolución
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}