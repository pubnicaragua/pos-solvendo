import React, { useEffect, useState } from 'react'
import { Search, X, Plus, Minus, Menu, Star, FileText, Package, Users, Gift } from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { PaymentModal } from '../components/pos/PaymentModal'
import { ClientModal } from '../components/pos/ClientModal'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { CashCloseModal } from '../components/pos/CashCloseModal'
import { ReturnsModal } from '../components/pos/ReturnsModal'
import { CashRegisterModal } from '../components/pos/CashRegisterModal'
import { CashMovementModal } from '../components/pos/CashMovementModal'
import { ReprintModal } from '../components/pos/ReprintModal'
import { ReportsModal } from '../components/pos/ReportsModal'
import { DeliveryModal } from '../components/pos/DeliveryModal'
import { usePOS } from '../contexts/POSContext'
import { useAuth } from '../contexts/AuthContext'
import { Cliente, Venta, Producto } from '../lib/supabase'

export const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showCashCloseModal, setShowCashCloseModal] = useState(false)
  const [showReturnsModal, setShowReturnsModal] = useState(false)
  const [showCashModal, setShowCashModal] = useState(false)
  const [showCashMovementModal, setShowCashMovementModal] = useState(false)
  const [showReprintModal, setShowReprintModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [lastVenta, setLastVenta] = useState<Venta | null>(null)
  const [activeTab, setActiveTab] = useState<'destacados' | 'promociones' | 'borradoras' | 'productos' | 'clientes'>('destacados')
  
  const {
    productos,
    promociones,
    carrito,
    cajaAbierta,
    loadProductos,
    loadPromociones,
    addToCart,
    updateCartItem,
    removeFromCart,
    getTotal,
    clearCart,
    procesarVenta
  } = usePOS()

  const { user, logout } = useAuth()

  useEffect(() => {
    loadProductos()
    loadPromociones()
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

  const productosDestacados = productos.filter(producto => producto.destacado)

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

  const menuItems = [
    { icon: Package, label: 'Movimiento', onClick: () => setShowCashMovementModal(true) },
    { icon: FileText, label: 'Reimprimir', onClick: () => setShowReprintModal(true) },
    { icon: Star, label: 'Reportes', onClick: () => setShowReportsModal(true) },
    { icon: Package, label: 'Despacho', onClick: () => setShowDeliveryModal(true) },
    { icon: X, label: 'Devolución', onClick: () => setShowReturnsModal(true) }
  ]

  const currentTime = new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                <span className="text-xl font-semibold text-gray-900">POS</span>
              </button>
              <Logo size="md" />
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                {currentTime}
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user?.nombre?.charAt(0)}{user?.apellidos?.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {user?.nombre} {user?.apellidos}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="relative bg-white w-80 shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Módulos</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick()
                      setShowSidebar(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
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

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'destacados' && (
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-blue-600 fill-current" />
                    <span className="text-sm font-medium text-blue-800">Productos destacados</span>
                  </div>
                  <div className="text-xs text-blue-600">Stock: 100 unidades</div>
                  <div className="text-xs text-blue-600">SKU: 4.5/5 (8624/8623)</div>
                </div>
                
                <div className="space-y-3">
                  {(searchTerm ? filteredProductos : productosDestacados).slice(0, 10).map((producto) => (
                    <div key={producto.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{producto.nombre}</div>
                          <div className="text-xs text-gray-500">Stock: {producto.stock || 0} unidades</div>
                          <div className="text-xs text-gray-500">SKU: {producto.codigo}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatPrice(producto.precio)}</span>
                        <button
                          onClick={() => addToCart(producto)}
                          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'promociones' && (
              <div className="p-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Promociones activas</span>
                  </div>
                  <div className="text-xs text-green-600">Promociones disponibles: {promociones.length}</div>
                </div>
                
                <div className="space-y-3">
                  {promociones.map((promocion) => (
                    <div key={promocion.id} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="font-medium text-sm text-green-800">{promocion.nombre}</div>
                      <div className="text-xs text-gray-500 mt-1">{promocion.descripcion}</div>
                      <div className="text-xs text-green-600 mt-1">
                        Tipo: {promocion.tipo} {promocion.valor && `- ${promocion.valor}${promocion.tipo.includes('porcentaje') ? '%' : '$'}`}
                      </div>
                    </div>
                  ))}
                  {promociones.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No hay promociones activas</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'borradoras' && (
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Borradoras de Venta</span>
                  </div>
                  <div className="text-xs text-blue-600">Fecha del borrador: 14/05/2025</div>
                  <div className="space-y-2 mt-3">
                    <div className="text-xs">Buscar borradoras...</div>
                    <div className="text-xs">N°1 - Pedido N°: 14/05/2025</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'productos' && (
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Productos / Servicios</span>
                  </div>
                  <div className="text-xs text-blue-600">Productos totales</div>
                </div>
                
                <div className="space-y-3">
                  {filteredProductos.map((producto) => (
                    <div key={producto.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{producto.nombre}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatPrice(producto.precio)}</span>
                        <button
                          onClick={() => addToCart(producto)}
                          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'clientes' && (
              <div className="p-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Clientes</span>
                  </div>
                  <div className="text-xs text-blue-600">Cliente</div>
                </div>
                
                <button
                  onClick={handleClientSelect}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Registrar nuevo cliente
                </button>
              </div>
            )}
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
                onClick={() => setActiveTab('promociones')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'promociones' ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-xs">Promociones</span>
              </button>
              <button
                onClick={() => setActiveTab('borradoras')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'borradoras' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="text-xs">Borradoras</span>
              </button>
              <button
                onClick={() => setActiveTab('productos')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                  activeTab === 'productos' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5" />
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
                        <span>Precio: {formatPrice(item.producto.precio)}</span>
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

          {/* Client Selection */}
          <div className="p-4 border-t border-gray-200">
            {selectedClient ? (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
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
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cliente"
                  onClick={handleClientSelect}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  readOnly
                />
              </div>
            )}
          </div>

          {/* Cart Footer */}
          <div className="p-4 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(cartTotal)} $
              </span>
            </div>
            
            <button 
              onClick={handlePayment}
              disabled={!cajaAbierta || carrito.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Pagar
            </button>
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

      <CashMovementModal
        isOpen={showCashMovementModal}
        onClose={() => setShowCashMovementModal(false)}
      />

      <ReprintModal
        isOpen={showReprintModal}
        onClose={() => setShowReprintModal(false)}
      />

      <ReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      <DeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
      />
    </div>
  )
}