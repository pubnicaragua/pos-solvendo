import React, { useState, useEffect } from 'react' 
import { Search, Save, CreditCard, User, Star, Percent, X, Plus, Minus, Calendar, Edit, Trash2 as Trash } from 'lucide-react'
import { ClientModal } from '../components/pos/ClientModal'
import { PaymentModal } from '../components/pos/PaymentModal'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { ReportsModal } from '../components/pos/ReportsModal'
import { ReprintModal } from '../components/pos/ReprintModal'
import { ReturnsModal } from '../components/pos/ReturnsModal'
import { CashCloseModal } from '../components/pos/CashCloseModal'
import { DraftSaveModal } from '../components/pos/DraftSaveModal'
import { PromotionModal } from '../components/pos/PromotionModal'
import { TabNavigation } from '../components/pos/TabNavigation'
import { usePOS } from '../contexts/POSContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../contexts/SidebarContext'
import toast from 'react-hot-toast'
import { Logo } from '../components/common/Logo'
import { Menu as MenuIcon } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const { toggleSidebar } = useSidebar()
  const [activeTab, setActiveTab] = useState<'destacado' | 'borradores' | 'productos' | 'clientes'>('destacado')
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showReprintModal, setShowReprintModal] = useState(false)
  const [showReturnsModal, setShowReturnsModal] = useState(false)
  const [showCashCloseModal, setShowCashCloseModal] = useState(false)
  const [showDraftSaveModal, setShowDraftSaveModal] = useState(false)
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [draftName, setDraftName] = useState('')
  const [loadingDrafts, setLoadingDrafts] = useState(false)
  
  const { 
    productos, 
    loading, 
    carrito, 
    total, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    loadProductos,
    borradores,
    loadBorradores,
    saveDraft,
    loadDraft,
    deleteDraft
  } = usePOS()
  const { user, logout, empresaId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadProductos()
    loadBorradores()
  }, [loadProductos])

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        (productos || []).filter(product =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.codigo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredProducts([])
    }
  }, [searchTerm, productos])

  const handleSaveDraft = async () => {
    if (!draftName.trim()) {
      toast.error('Ingrese un nombre para el borrador')
      return
    }
    
    if (carrito.length === 0) {
      toast.error('No hay productos en el carrito')
      return
    }
    
    const success = await saveDraft(draftName)
    if (success) {
      setShowDraftSaveModal(false)
      setDraftName('')
      await loadBorradores()
      toast.success('Borrador guardado correctamente')
    }
  }
  
  const handleLoadDraft = async (draftId: string) => {
    const success = await loadDraft(draftId)
    if (success) {
      setActiveTab('destacado')
      toast.success('Borrador cargado correctamente')
    }
  }
  
  const handleDeleteDraft = async (draftId: string) => {
    if (confirm('¿Está seguro de eliminar este borrador?')) {
      const success = await deleteDraft(draftId)
      if (success) {
        await loadBorradores()
        toast.success('Borrador eliminado correctamente')
      }
    }
  }

  const handlePaymentComplete = (metodoPago: string, tipoDte: string) => {
    setShowPaymentModal(false)
    setShowReceiptModal(true)
  }

  const handlePrint = () => {
    setShowReceiptModal(false)
    clearCart()
    toast.success('Venta completada exitosamente')
  }

  const handleSendEmail = () => {
    setShowReceiptModal(false)
    clearCart()
    toast.success('Documento enviado por correo')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'destacado':
        return (
          <div className="grid grid-cols-2 gap-4">
            {(productos || []).filter(p => p.destacado).map(product => (
              <div 
                key={product.id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => addToCart(product)}
              >
                <h3 className="font-medium text-gray-900">{product.nombre}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Precio</span>
                  <span className="font-bold">{formatPrice(product.precio)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      case 'borradores':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-blue-600 font-bold">Borradores de Venta</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Fecha del borrador</span>
                <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center">
                  <span className="font-bold">14/05/2025</span>
                  <Calendar className="ml-2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar borradores..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            {loadingDrafts ? (
              <div className="text-center py-8 text-gray-500">Cargando borradores...</div>
            ) : borradores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No hay borradores guardados</div>
            ) : (
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {borradores.map((draft) => (
                  <div key={draft.id} className="flex justify-between items-center py-4 border-b border-gray-200">
                    <span className="font-bold">{draft.nombre} - {formatDate(draft.fecha)}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleLoadDraft(draft.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'productos':
        return (
          <div className="grid grid-cols-2 gap-4">
            {(searchTerm ? (filteredProducts || []) : (productos || [])).map(product => (
              <div 
                key={product.id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">{product.nombre}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Precio</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{formatPrice(product.precio)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return <div>Contenido no disponible</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MenuIcon className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">POS</span>
          </div>
          
          <Logo size="md" />
          
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
              placeholder="Ingresa aquí el producto o servicio"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as any)}
            tabs={[
              { id: 'destacado', label: 'Destacado' },
              { id: 'borradores', label: 'Borradores' },
              { id: 'productos', label: 'Productos' },
              { id: 'clientes', label: 'Clientes' }
            ]}
          />

          {/* Tab Content */}
          <div className="mb-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Cart Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {carrito.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.nombre}</h4>
                    <div className="flex items-center mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{formatPrice(item.precio * item.quantity)}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="block ml-auto mt-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                N° Líneas {carrito.length} / Tot. ítems {carrito.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <select className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg">
                <option>Boleta manual (No válido al SII)</option>
              </select>
            </div>

            <div className="mb-4">
              <button
                onClick={() => setShowClientModal(true)}
                className="w-full px-3 py-2 bg-gray-100 border-0 rounded-lg text-left flex items-center justify-between"
              >
                <span>Cliente</span>
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="flex justify-between items-center text-lg font-semibold mb-4">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => clearCart()}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={() => setShowDraftSaveModal(true)}
                className="bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar borrador
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={carrito.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-3"
            >
              Pagar
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClientModal 
        isOpen={showClientModal} 
        onClose={() => setShowClientModal(false)} 
        onClientSelect={() => {}} 
      />

      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onPaymentComplete={handlePaymentComplete}
        total={total}
      />

      <ReceiptModal 
        isOpen={showReceiptModal} 
        onClose={() => setShowReceiptModal(false)} 
        onPrint={handlePrint}
        onSendEmail={handleSendEmail}
      />

      <ReportsModal 
        isOpen={showReportsModal} 
        onClose={() => setShowReportsModal(false)} 
      />

      <ReprintModal 
        isOpen={showReprintModal} 
        onClose={() => setShowReprintModal(false)} 
      />

      <ReturnsModal 
        isOpen={showReturnsModal} 
        onClose={() => setShowReturnsModal(false)} 
      />

      <CashCloseModal 
        isOpen={showCashCloseModal} 
        onClose={() => setShowCashCloseModal(false)} 
      />

      <DraftSaveModal
        isOpen={showDraftSaveModal}
        onClose={() => setShowDraftSaveModal(false)}
        draftName={draftName}
        setDraftName={setDraftName}
        onSave={handleSaveDraft}
      />

      <PromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        productId={selectedProductId || undefined}
      />
    </div>
  )
}

export default Dashboard