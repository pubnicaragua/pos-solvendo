import React, { useState } from 'react'
import { Truck, Search, X, Plus, User } from 'lucide-react'
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
  const [deliveryData, setDeliveryData] = useState({
    fecha: new Date().toISOString().split('T')[0],
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
    console.log('Confirming delivery...', deliveryData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Despacho</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="flex h-[calc(90vh-80px)]">
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
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Documentos disponibles
              </h4>
            </div>

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
                <Button
                  variant="outline"
                  fullWidth
                  icon={Plus}
                  onClick={() => setShowClientModal(true)}
                >
                  Registrar nuevo cliente
                </Button>
              )}
            </div>

            {/* Delivery Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={deliveryData.fecha}
                    onChange={(e) => setDeliveryData(prev => ({ ...prev, fecha: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
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
                label="Número documento"
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