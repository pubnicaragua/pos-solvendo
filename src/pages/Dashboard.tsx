import React, { useEffect, useState } from 'react'
import { ShoppingCart, Search, Users, Star, Calendar, X, Plus, Minus } from 'lucide-react'
import { POSLayout } from '../components/pos/POSLayout'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { PaymentModal } from '../components/pos/PaymentModal'
import { ClientModal } from '../components/pos/ClientModal'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { CashCloseModal } from '../components/pos/CashCloseModal'
import { ReturnsModal } from '../components/pos/ReturnsModal'
import { CashRegisterModal } from '../components/pos/CashRegisterModal'
import { usePOS } from '../contexts/POSContext'
import { Cliente, Venta } from '../lib/supabase'

export const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showCashCloseModal, setShowCashCloseModal] = useState(false)
  const [showReturnsModal, setShowReturnsModal] = useState(false)
  const [showCashModal, setShowCashModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [lastVenta, setLastVenta] = useState<Venta | null>(null)
  const [activeTab, setActiveTab] = useState<'destacados' | 'borradoras' | 'productos' | 'clientes'>('destacados')
  
  const {
    productos,
    carrito,
    cajaAbierta,
    loadProductos,
    addToCart,
    updateCartItem,
    removeFromCart,
    getTotal,
    clearCart,
    procesarVenta
  } = usePOS()

  useEffect(() => {
    loadProductos()
  }, [])

  useEffect(() => {
    if (!cajaAbierta) {
      setShowCashModal(true)
    }
  }, [cajaAbierta])

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const cartTotal = getTotal()
  const cartItemsCount = carrito.reduce((total, item) => total + item.cantidad, 0)

  const handlePayment = () => {
    if (carrito.length === 0) return
    setShowPaymentModal(true)
  }

  const handleClientSelect = () => {
    setShowClientModal(true)
  }

  const handlePaymentComplete = async (metodoPago: string, tipoDte: string) => {
    const result = await procesarVenta(selectedClient?.id || null, metodoPago, tipoDte)
    
    if (result.success && result.venta) {
      setLastVenta(result.venta)
      setShowReceiptModal(true)
      setSelectedClient(null)
    }
  }

  const handleClientModalSelect = (cliente: Cliente | null) => {
    setSelectedClient(cliente)
  }

  const renderProductGrid = () => {
    if (activeTab === 'destacados') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-blue-600 fill-current" />
              <span className="text-sm font-medium text-blue-800">Productos destacados</span>
            </div>
            <div className="text-xs text-blue-600">Stock: 100 unidades</div>
            <div className="text-xs text-blue-600">SKU: 4.5/5 (8624/8623)</div>
          </div>
          
          {filteredProductos.slice(0, 3).map((producto) => (
            <div key={producto.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs">📦</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{producto.nombre}</div>
                  <div className="text-xs text-gray-500">Stock: 100 unidades</div>
                  <div className="text-xs text-gray-500">SKU: {producto.codigo}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatPrice(producto.precio)}</span>
                <button
                  onClick={() => addToCart(producto)}
                  className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'borradoras') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Borradoras de Venta</span>
            </div>
            <div className="text-xs text-blue-600">Fecha del borrador: 14/05/2025</div>
            <div className="space-y-2 mt-3">
              <div className="text-xs">Buscar borradoras...</div>
              <div className="text-xs">N°1 - Pedido N°: 14/05/2025</div>
            </div>
          </div>
        </div>
      )
    }

    if (activeTab === 'productos') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Productos / Servicios</span>
            </div>
            <div className="text-xs text-blue-600">Productos totales</div>
          </div>
          
          {filteredProductos.map((producto) => (
            <div key={producto.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs">📦</span>
                </div>
                <div>
                  <div className="font-medium text-sm">{producto.nombre}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatPrice(producto.precio)}</span>
                <button
                  onClick={() => addToCart(producto)}
                  className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center py-4">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
              iconPosition="left"
            />
          </div>
        </div>
      )
    }

    if (activeTab === 'clientes') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Clientes</span>
            </div>
            <div className="text-xs text-blue-600">Cliente</div>
          </div>
          
          <Button
            fullWidth
            variant="primary"
            onClick={handleClientSelect}
          >
            Registrar nuevo cliente
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <POSLayout>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <Input
              placeholder="Ingresa aquí el producto o servicio..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
              iconPosition="left"
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderProductGrid()}
          </div>

          {/* Bottom Tabs */}
          <div className="border-t border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setActiveTab('destacados')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'destacados' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5" />
                <span className="text-xs">Destacado</span>
              </button>
              <button
                onClick={() => setActiveTab('borradoras')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'borradoras' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">📄</div>
                <span className="text-xs">Borradoras</span>
              </button>
              <button
                onClick={() => setActiveTab('productos')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'productos' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">📦</div>
                <span className="text-xs">Productos</span>
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'clientes' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs">Clientes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{cartItemsCount} ítems</span>
                {carrito.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>

            {/* Date Display */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Fecha del vendedor: {new Date().toLocaleDateString('es-CL')}</span>
            </div>

            {/* Client Selection */}
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
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClientSelect}
                className="w-full p-3 border border-gray-300 rounded-lg text-left hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Cliente</span>
                </div>
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {carrito.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">N° Líneas / Tot. Items: 0</div>
                <div className="text-gray-400 mb-4">Boleta manual (No válida)</div>
                <div className="text-center text-gray-500">
                  <p>No hay productos en el carrito</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  N° Líneas / Tot. Items: {cartItemsCount} | Boleta manual (No válida)
                </div>
                
                {carrito.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{item.producto.nombre}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartItem(index, item.cantidad - 1)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center">{item.cantidad}</span>
                          <button
                            onClick={() => updateCartItem(index, item.cantidad + 1)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span>Descuento: 0%</span>
                        <span>Importe: {formatPrice(item.producto.precio * item.cantidad)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(cartTotal)}
              </span>
            </div>
            
            <Button 
              fullWidth 
              size="lg"
              onClick={handlePayment}
              disabled={!cajaAbierta || carrito.length === 0}
            >
              Pagar
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
        total={cartTotal}
      />

      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientSelect={handleClientModalSelect}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        venta={lastVenta}
      />

      <CashCloseModal
        isOpen={showCashCloseModal}
        onClose={() => setShowCashCloseModal(false)}
      />

      <ReturnsModal
        isOpen={showReturnsModal}
        onClose={() => setShowReturnsModal(false)}
      />

      <CashRegisterModal
        isOpen={showCashModal}
        onClose={() => setShowCashModal(false)}
        type="open"
      />
    </POSLayout>
  )
}