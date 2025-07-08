import React, { useState } from 'react'
import { RotateCcw, Search, X } from 'lucide-react'
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

  if (!isOpen) return null

  const handleSearchSale = async () => {
    if (!searchFolio) return
    
    setLoading(true)
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Devolución</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
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

          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Número de folio (ej: V1234567890)"
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
                <Button fullWidth>
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