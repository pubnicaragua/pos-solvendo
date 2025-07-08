import React, { useEffect, useState } from 'react'
import { ShoppingCart, Search, Grid3X3, Users, Star, Trash2, RotateCcw, Calendar } from 'lucide-react'
import { POSLayout } from '../components/pos/POSLayout'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
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

  return (
    <POSLayout>
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  icon={Search}
                  iconPosition="left"
                />
              </div>
              <Button variant="outline" icon={Grid3X3}>
                Categorías
              </Button>
              <Button 
                variant="outline" 
                icon={RotateCcw}
                onClick={() => setShowReturnsModal(true)}
              >
                Devoluciones
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProductos.length} productos encontrados
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={Star}>
                  Destacados
                </Button>
                <Button variant="ghost" size="sm">
                  Más vendidos
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredProductos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group hover:border-blue-300"
                  onClick={() => addToCart(producto)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <div className="text-3xl">📦</div>
                  </div>
                  <h3 className="font-medium text-gray-900 text-xs mb-1 line-clamp-2">
                    {producto.nombre}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">
                    Código: {producto.codigo}
                  </p>
                  <p className="text-sm font-semibold text-blue-600 mb-2">
                    {formatPrice(producto.precio)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Cart Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Carrito</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{cartItemsCount} ítems</span>
                {carrito.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={clearCart}
                  >
                    Limpiar
                  </Button>
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
                icon={Users}
                onClick={handleClientSelect}
              >
                Seleccionar cliente
              </Button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {carrito.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay productos en el carrito</p>
                <p className="text-sm text-gray-400 mt-1">
                  Selecciona productos para comenzar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {carrito.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {item.producto.nombre}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {formatPrice(item.producto.precio)} c/u
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, item.cantidad - 1)}
                          className="w-8 h-8 p-0 text-lg"
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.cantidad}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(index, item.cantidad + 1)}
                          className="w-8 h-8 p-0 text-lg"
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.producto.precio * item.cantidad)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {carrito.length > 0 && (
            <div className="p-6 border-t border-gray-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              
              <Button 
                fullWidth 
                size="lg" 
                icon={ShoppingCart}
                onClick={handlePayment}
                disabled={!cajaAbierta}
              >
                Pagar
              </Button>
            </div>
          )}
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