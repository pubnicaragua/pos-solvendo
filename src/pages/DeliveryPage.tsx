import React, { useState } from 'react'
import { Truck, Search, User, Calendar, Plus, Minus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { usePOS } from '../contexts/POSContext'
import { ClientModal } from '../components/pos/ClientModal'
import { Cliente } from '../lib/supabase'

interface DeliveryPageProps {
  onClose: () => void
}

export const DeliveryPage: React.FC<DeliveryPageProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showClientError, setShowClientError] = useState(false)
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
  const { carrito, total, addToCart, removeFromCart, updateQuantity } = usePOS()
  const { user } = useAuth()

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
            <button
              onClick={() => setShowClientError(false)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
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
              <Truck className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Despacho</span>
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
        {/* Left Panel - Products */}
        <div className="flex-1 p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Ingresa aquí el producto o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Available Documents Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Documentos disponibles</span>
            </div>
            <div className="text-xs text-blue-600">Ingresa aquí el número de documento</div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Ingresa aquí el número de documento"
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm"
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

          {/* Products List */}
          <div className="space-y-3 mb-6">
            {carrito.map((item) => (
              <div key={item.id} className="grid grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">{item.nombre}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-sm">0%</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{formatPrice(item.precio * item.quantity)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                N° Líneas / Tot. Items: {carrito.length}
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Guía de despacho manual</option>
              </select>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cliente"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={handleConfirmDelivery}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Despachar
            </button>
          </div>
        </div>

        {/* Right Panel - Delivery Details */}
        <div className="w-96 p-6 bg-white border-l border-gray-200">
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
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Clientes</span>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cliente"
                      className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowClientModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Registrar nuevo cliente
                </button>
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
                    value={deliveryData.fecha}
                    onChange={(e) => setDeliveryData(prev => ({ ...prev, fecha: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={deliveryData.tipo}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Tipo de despacho</option>
                  <option>Entrega inmediata</option>
                  <option>Entrega programada</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario</label>
              <input
                type="text"
                value={deliveryData.destinatario}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, destinatario: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={deliveryData.direccion}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, direccion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                <input
                  type="text"
                  value={deliveryData.comuna}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, comuna: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={deliveryData.ciudad}
                  onChange={(e) => setDeliveryData(prev => ({ ...prev, ciudad: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
              <input
                type="text"
                value={deliveryData.region}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Núm. documento</label>
              <input
                type="text"
                value={deliveryData.numeroDocumento}
                onChange={(e) => setDeliveryData(prev => ({ ...prev, numeroDocumento: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4 text-lg font-semibold">
              <span>Total de despacho</span>
              <span>{formatPrice(total)}</span>
            </div>
            
            <button
              onClick={handleConfirmDelivery}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Confirmar despacho
            </button>
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
  )
}