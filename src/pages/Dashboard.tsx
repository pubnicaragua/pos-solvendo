import React, { useState, useEffect } from 'react'
import { Search, Menu, Clock, User, Star, FileText, Package, Users, Plus, Minus, X } from 'lucide-react'
import { usePOS } from '../contexts/POSContext'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/pos/Sidebar'
import { ClientModal } from '../components/pos/ClientModal'
import { PaymentModal } from '../components/pos/PaymentModal'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { CashCloseModal } from '../components/pos/CashCloseModal'
import { CashMovementModal } from '../components/pos/CashMovementModal'
import { ReturnsModal } from '../components/pos/ReturnsModal'
import { ReprintModal } from '../components/pos/ReprintModal'
import { ReportsModal } from '../components/pos/ReportsModal'
import { DeliveryModal } from '../components/pos/DeliveryModal'
import { Logo } from '../components/common/Logo'
import { Producto, Cliente } from '../lib/supabase'

// Import new pages
import { CashMovementPage } from './CashMovementPage'
import { ReprintPage } from './ReprintPage'
import { ReportsPage } from './ReportsPage'
import { DeliveryPage } from './DeliveryPage'
import { PromotionsPage } from './PromotionsPage'

type TabType = 'destacados' | 'borradoras' | 'productos' | 'clientes' | 'promociones'
type PageType = 'dashboard' | 'movimiento' | 'reimprimir' | 'reportes' | 'despacho' | 'promociones'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('destacados')
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null)
  const [lastSale, setLastSale] = useState(null)
  
  const { 
    productos, 
    carrito, 
    total, 
    loading, 
    loadProductos, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    procesarVenta
  } = usePOS()
  
  const { user } = useAuth()

  useEffect(() => {
    loadProductos()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         producto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeTab) {
      case 'destacados':
        return matchesSearch && producto.destacado
      case 'productos':
        return matchesSearch
      default:
        return matchesSearch
    }
  })

  const handlePayment = async (metodoPago: string, tipoDte: string) => {
    const result = await procesarVenta(metodoPago, tipoDte, selectedClient?.id)
    if (result.success) {
      setLastSale(result.venta)
      setShowPaymentModal(false)
      setShowReceiptModal(true)
      clearCart()
      setSelectedClient(null)
    }
  }

  const handleSidebarAction = (action: string) => {
    setShowSidebar(false)
    
    switch (action) {
      case 'movimiento':
        setCurrentPage('movimiento')
        break
      case 'reimprimir':
        setCurrentPage('reimprimir')
        break
      case 'reportes':
        setCurrentPage('reportes')
        break
      case 'despacho':
        setCurrentPage('despacho')
        break
      case 'promociones':
        setCurrentPage('promociones')
        break
    }
  }

  // Render different pages
  if (currentPage === 'movimiento') {
    return <CashMovementPage onClose={() => setCurrentPage('dashboard')} />
  }

  if (currentPage === 'reimprimir') {
    return <ReprintPage onClose={() => setCurrentPage('dashboard')} />
  }

  if (currentPage === 'reportes') {
    return <ReportsPage onClose={() => setCurrentPage('dashboard')} />
  }

  if (currentPage === 'despacho') {
    return <DeliveryPage onClose={() => setCurrentPage('dashboard')} />
  }

  if (currentPage === 'promociones') {
    return <PromotionsPage onClose={() => setCurrentPage('dashboard')} />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'destacados':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Productos destacados</span>
              </div>
              <div className="text-xs text-blue-600">Stock: 100 unidades</div>
              <div className="text-xs text-blue-600 mt-1">SKU: 4.5x950x40x23</div>
            </div>
            {renderProductList()}
          </div>
        )
      
      case 'borradoras':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Borradores de Venta</span>
                </div>
                <div className="text-xs text-blue-600">Fecha del borrador: 14/05/2025</div>
              </div>
              <div className="text-xs text-blue-600">Buscar borradores...</div>
            </div>
            <div className="text-center text-gray-500 py-8">
              No hay borradores guardados
            </div>
          </div>
        )
      
      case 'productos':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Productos / Servicios</span>
              </div>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm">
                <option>Productos totales</option>
              </select>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                />
              </div>
            </div>
            {renderProductList()}
          </div>
        )
      
      case 'clientes':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Clientes</span>
              </div>
              <div className="text-xs text-blue-600">Cliente</div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder=""
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={() => setShowClientModal(true)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Registrar nuevo cliente
            </button>
          </div>
        )

      case 'promociones':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Promociones</span>
              </div>
              <div className="text-xs text-blue-600">Gestionar promociones activas</div>
            </div>
            <button
              onClick={() => setCurrentPage('promociones')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Ver todas las promociones
            </button>
          </div>
        )
      
      default:
        return null
    }
  }

  const renderProductList = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {filteredProducts.map((producto) => (
          <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{producto.nombre}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>- 1 +</span>
                <span>Precio: {formatPrice(producto.precio)}</span>
              </div>
            </div>
            <button
              onClick={() => addToCart(producto)}
              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
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
              onClick={() => setShowSidebar(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">POS</span>
          </div>
          
          <Logo size="md" />
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{getCurrentTime()}</span>
            </div>
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

          {/* Tab Content */}
          {renderTabContent()}
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-4">
              N° Líneas / Tot. Items: {carrito.length}
            </div>
            
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 text-sm">
              <option>Boleta manual (No válida al SII)</option>
            </select>

            <div className="space-y-3 mb-6">
              {carrito.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.nombre}</h4>
                    <div className="flex items-center gap-2 mt-1">
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
                      <span className="ml-auto text-sm">Precio: {formatPrice(item.precio)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Client Selection */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cliente"
                value={selectedClient?.razon_social || ''}
                readOnly
                onClick={() => setShowClientModal(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Total and Pay Button */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold">{formatPrice(total)} $</span>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={carrito.length === 0}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-center space-x-8">
          {[
            { id: 'destacados', label: 'Destacado', icon: Star },
            { id: 'borradoras', label: 'Borradoras', icon: FileText },
            { id: 'productos', label: 'Productos', icon: Package },
            { id: 'clientes', label: 'Clientes', icon: Users },
            { id: 'promociones', label: 'Promociones', icon: Star }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as TabType)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Modals */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onAction={handleSidebarAction}
      />

      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientSelect={(cliente) => {
          setSelectedClient(cliente)
          setShowClientModal(false)
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePayment}
        total={total}
      />

      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        venta={lastSale}
      />
    </div>
  )
}