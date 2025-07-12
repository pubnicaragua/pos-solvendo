import React, { useState } from 'react'
import { Truck, Search, X, Plus, User, Calendar } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { ClientModal } from './ClientModal'
import { Cliente } from '../../lib/supabase'

interface DeliveryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showClientError, setShowClientError] = useState(false)
  const [deliveryData, setDeliveryData] = useState({
    fecha: '19/05/2025',
    tipo: 'Tipo de despacho',
    destinatario: 'Inicial demo',
    direccion: 'Dirección',
    comuna: 'Comuna',
    ciudad: 'Ciudad',
    region: 'Región',
    numeroDocumento: 'Número de documento'
  })

  if (!isOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handleClientSelect = (cliente: Cliente | null) => {
    setSelectedClient(cliente)
    if (cliente) {
      setDeliveryData(prev => ({
        ...prev,
        destinatario: cliente.razon_social,
        direccion: cliente.direccion || 'Dirección',
        comuna: cliente.comuna || 'Comuna',
        ciudad: cliente.ciudad || 'Ciudad'
      }))
    }
  }

  const handleConfirmDelivery = () => {
    if (!selectedClient) {
      setShowClientError(true)
      return
    }
    console.log('Confirming delivery...', deliveryData)
    onClose()
  }

  if (showClientError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No has seleccionado el cliente</h3>
            <Button fullWidth onClick={() => setShowClientError(false)}>
              OK
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Despacho</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Products */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <div className="mb-6">
              <Input
                placeholder="Ingresa aquí el producto o servicio..."
                value={searchTerm}
                onChange={setSearchTerm}
                icon={Search}
                iconPosition="left"
              />
            </div>

            {/* Available Documents Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800">Documentos disponibles</span>
              </div>
              <div className="text-xs text-blue-600">Ingresa aquí el número de documento</div>
            </div>

            {/* Mock Product */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Ejemplo producto 1</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>Cantidad: 1</span>
                    <span>Descuento: 0%</span>
                    <span>Importe: {formatPrice(34500)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={X} />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(34500)}</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Delivery Details */}
          <div className="w-96 p-6">
            {/* Client Selection */}
            <div className="mb-6">
              {selectedClient ? (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {selectedClient.razon_social}
                      </p>
                      <p className="text-xs text-blue-700">RUT: {selectedClient.rut}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(null)}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Clientes</span>
                    </div>
                    <Input
                      placeholder="Cliente"
                      icon={Search}
                      iconPosition="left"
                    />
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setShowClientModal(true)}
                  >
                    Registrar nuevo cliente
                  </Button>
                </div>
              )}
            </div>

            {/* Delivery Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={deliveryData.tipo}
                    onChange={(e) => setDeliveryData(prev => ({ ...prev, tipo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option>Tipo de despacho</option>
                    <option>Entrega inmediata</option>
                    <option>Entrega programada</option>
                  </select>
                </div>
              </div>

              <Input
                label="Destinatario"
                value={deliveryData.destinatario}
                onChange={(value) => setDeliveryData(prev => ({ ...prev, destinatario: value }))}
              />

              <Input
                label="Dirección"
                value={deliveryData.direccion}
                onChange={(value) => setDeliveryData(prev => ({ ...prev, direccion: value }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Comuna"
                  value={deliveryData.comuna}
                  onChange={(value) => setDeliveryData(prev => ({ ...prev, comuna: value }))}
                />
                <Input
                  label="Ciudad"
                  value={deliveryData.ciudad}
                  onChange={(value) => setDeliveryData(prev => ({ ...prev, ciudad: value }))}
                />
              </div>

              <Input
                label="Región"
                value={deliveryData.region}
                onChange={(value) => setDeliveryData(prev => ({ ...prev, region: value }))}
              />

              <Input
                label="Núm. documento"
                value={deliveryData.numeroDocumento}
                onChange={(value) => setDeliveryData(prev => ({ ...prev, numeroDocumento: value }))}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                <span>Total de despacho</span>
                <span>{formatPrice(34500)}</span>
              </div>
              
              <Button
                fullWidth
                onClick={handleConfirmDelivery}
              >
                Confirmar despacho
              </Button>
            </div>
          </div>
        </div>

        {/* Client Modal */}
        <ClientModal
          isOpen={showClientModal}
          onClose={() => setShowClientModal(false)}
          onClientSelect={handleClientSelect}
        />
      </div>
    </div>
  )
}