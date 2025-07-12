import React, { useState, useEffect } from 'react'
import { Search, Menu, Clock, Star, FileText, Package, Users, Plus, Minus, X, Save } from 'lucide-react'
import { usePOS } from '../contexts/POSContext'
import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from '../components/pos/Sidebar'
import { ClientModal } from '../components/pos/ClientModal'
import { PaymentModal } from '../components/pos/PaymentModal'
import { ReceiptModal } from '../components/pos/ReceiptModal'
import { DraftSaveModal } from '../components/pos/DraftSaveModal'
import { SupervisorAuthModal } from '../components/auth/SupervisorAuthModal'
import { PromotionModal } from '../components/pos/PromotionModal'
import toast from 'react-hot-toast'

type TabType = 'destacado' | 'borradoras' | 'productos' | 'clientes'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('destacado')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showDraftSaveModal, setShowDraftSaveModal] = useState(false)
  const [showSupervisorAuthModal, setShowSupervisorAuthModal] = useState(false)
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>(undefined)
  
  const { 
    productos,
    carrito, 
    total,
    loading, 
    loadProductos,
    borradores,
    loadBorradores,
    loadDraft,
    deleteDraft,
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart
  } = usePOS()
  
  const { user } = useAuth()

  useEffect(() => {
    loadProductos()
    loadBorradores()
  }, [loadProductos])

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

  const filteredProducts = productos.filter(produto => {
    const matchesSearch = produto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (activeTab) {
      case 'destacado':
        return matchesSearch && produto.destacado
      case 'productos': 
        return matchesSearch
      default:
        return matchesSearch
    }
  })

  const handleSidebarAction = (action: string) => {
    setShowSidebar(false)
    
    // Navigate to the corresponding page
    window.location.href = `/${action}`;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'destacado':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Produtos destacados</span>
              </div>
              <div className="text-xs text-blue-600">Stock: 100 unidades</div>
              <div className="text-xs text-blue-600 mt-1">SKU: 4.54.9526.614223</div>
            </div>
            {renderProductList()}
          </div>
        )
      
      case 'borradoras':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Borradores de Venta</span>
                </div>
                <div className="text-xs text-blue-600">Fecha del borrador: 14/05/2025</div>
              </div>
              <div className="text-xs text-blue-600">Buscar borradores...</div>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Buscar borradores..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                />
              </div>
            </div>
            {borradores.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay borradores guardados
              </div>
            ) : (
              <div className="space-y-2">
                {borradores.map((borrador) => (
                  <div key={borrador.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{borrador.nombre} {new Date(borrador.fecha).toLocaleDateString('es-CL')}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => loadDraft(borrador.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteDraft(borrador.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'produtos':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Produtos / Servicios</span>
              </div>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm mb-2">
                <option>Todos los productos</option>
                <option>Destacados</option>
                <option>Con promoción</option>
                <option>Sin promoción</option>
              </select>
              <select className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm mb-2">
                <option>Produtos totales</option>
              </select>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
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
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Productos / Servicios</span>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cliente"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <button 
              onClick={() => setShowClientModal(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Registrar nuevo cliente
            </button>
          </div>
        )
      
      default:
        return null
    }
  }

  const handlePayment = () => {
    if (carrito.length === 0) return
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = (metodoPago: string, tipoDte: string) => {
    setShowPaymentModal(false)
    setShowReceiptModal(true)
  }

  const handlePrint = () => {
    window.print()
    setShowReceiptModal(false)
  }

  const handleSendEmail = () => {
    // Simulate sending email
    console.log('Sending email...')
    setShowReceiptModal(false)
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
        {filteredProducts.map((produto) => (
          <div key={produto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{produto.nombre}</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>+ $ {produto.precio}</span>
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  {produto.destacado ? '0' : '0'}
                </span>
              </div>
            </div>
            <button
              onClick={() => addToCart(produto)}
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
          
          <div className="flex items-center justify-center flex-1">
            <svg className="w-32 h-8" viewBox="0 0 195 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="42" rx="6" fill="#101014"/>
              <g clipPath="url(#clip0_390_976)">
                <path d="M10.2541 39.3614C10.2855 39.401 10.3153 39.4325 10.343 39.4555C10.2959 39.4733 10.2656 39.4401 10.2541 39.3614C9.33584 38.2016 7.08012 30.079 17.9678 25.5216C29.2276 20.8084 29.7214 15.7012 29.7214 15.7012C30.0984 19.9322 31.5349 22.1574 21.8036 26.5279C12.8047 30.5694 10.1129 38.3943 10.2541 39.3614Z" fill="white"/>
                <path d="M6.96423 35.7833C6.99415 35.824 7.0228 35.8566 7.04962 35.8806C7.00185 35.8967 6.97283 35.8623 6.96423 35.7833C6.08904 34.5907 4.13226 26.3909 15.1795 22.2352C26.6044 17.9375 27.2848 12.8518 27.2848 12.8518C27.5066 17.0938 28.8607 19.3701 18.9759 23.3813C9.83501 27.0906 6.85856 34.8117 6.96423 35.7833Z" fill="white"/>
                <path d="M12.1234 7.80196C10.0483 5.58823 9.71884 4.31743 10.655 2C11.1616 5.2098 15.278 7.65495 26.306 12.6369C26.1371 14.1994 25.8766 14.6897 25.2316 15.1439C25.2316 15.1439 14.1985 10.0157 12.1234 7.80196Z" fill="white"/>
                <path d="M10.3022 11.0369C8.26209 8.79091 7.95257 7.51509 8.925 5.21264C9.36192 8.29458 12.9905 10.6612 22.9186 15.3855C23.5633 15.6923 23.7063 16.5525 23.1891 17.0446C22.5706 17.6328 21.6509 17.7731 20.8895 17.3874C17.596 15.7188 11.7523 12.6334 10.3022 11.0369Z" fill="white"/>
              </g>
              <path d="M58.848 33.07C57.376 33.07 56.1173 32.8887 55.072 32.526C54.0267 32.1633 53.152 31.694 52.448 31.118C51.7653 30.542 51.2213 29.934 50.816 29.294C50.4107 28.6327 50.1013 28.014 49.888 27.438C49.696 26.862 49.568 26.3927 49.504 26.03C49.44 25.6673 49.408 25.486 49.408 25.486H53.824C53.824 25.486 53.8453 25.614 53.888 25.87C53.952 26.126 54.08 26.4567 54.272 26.862C54.464 27.246 54.7413 27.63 55.104 28.014C55.488 28.398 55.9893 28.7287 56.608 29.006C57.248 29.262 58.0373 29.39 58.976 29.39C60.4267 29.39 61.5253 29.07 62.272 28.43C63.04 27.7687 63.424 26.958 63.424 25.998C63.424 25.1873 63.136 24.5473 62.56 24.078C61.984 23.5873 61.1307 23.2247 60 22.99L56.864 22.318C55.648 22.062 54.5067 21.678 53.44 21.166C52.3947 20.654 51.552 19.9607 50.912 19.086C50.272 18.2113 49.952 17.0913 49.952 15.726C49.952 14.2967 50.304 13.0593 51.008 12.014C51.7333 10.9687 52.7253 10.1687 53.984 9.614C55.2427 9.038 56.7147 8.75 58.4 8.75C60 8.75 61.3227 8.98466 62.368 9.454C63.4133 9.92333 64.2453 10.4993 64.864 11.182C65.504 11.8647 65.9733 12.5473 66.272 13.23C66.5707 13.9127 66.7627 14.4887 66.848 14.958C66.9547 15.4273 67.008 15.662 67.008 15.662H62.752C62.752 15.662 62.7093 15.502 62.624 15.182C62.5387 14.8407 62.3467 14.4567 62.048 14.03C61.7493 13.6033 61.3013 13.23 60.704 12.91C60.1067 12.5687 59.3067 12.398 58.304 12.398C56.8747 12.398 55.8293 12.718 55.168 13.358C54.528 13.998 54.208 14.6913 54.208 15.438C54.208 16.206 54.5067 16.8033 55.104 17.23C55.7013 17.6567 56.5013 17.9873 57.504 18.222L60.864 18.926C62.1227 19.2033 63.2747 19.6193 64.32 20.174C65.3653 20.7287 66.1973 21.4647 66.816 22.382C67.4347 23.278 67.744 24.398 67.744 25.742C67.744 27.1073 67.4027 28.3447 66.72 29.454C66.0373 30.5633 65.0347 31.4487 63.712 32.11C62.3893 32.75 60.768 33.07 58.848 33.07ZM77.432 33.07C75.576 33.07 73.9973 32.654 72.696 31.822C71.3947 30.99 70.4027 29.9127 69.72 28.59C69.0587 27.246 68.728 25.806 68.728 24.27C68.728 22.734 69.0587 21.3047 69.72 19.982C70.4027 18.638 71.3947 17.55 72.696 16.718C73.9973 15.886 75.576 15.47 77.432 15.47C79.3093 15.47 80.888 15.886 82.168 16.718C83.4693 17.55 84.4507 18.638 85.112 19.982C85.7947 21.3047 86.136 22.734 86.136 24.27C86.136 25.806 85.7947 27.246 85.112 28.59C84.4507 29.9127 83.4693 30.99 82.168 31.822C80.888 32.654 79.3093 33.07 77.432 33.07ZM77.432 29.518C78.392 29.518 79.192 29.2727 79.832 28.782C80.4933 28.2913 80.9947 27.6513 81.336 26.862C81.6773 26.0513 81.848 25.1873 81.848 24.27C81.848 23.3313 81.6773 22.4673 81.336 21.678C80.9947 20.8887 80.4933 20.2487 79.832 19.758C79.192 19.2673 78.392 19.022 77.432 19.022C76.4933 19.022 75.6933 19.2673 75.032 19.758C74.3707 20.2487 73.8693 20.8887 73.528 21.678C73.1867 22.4673 73.016 23.3313 73.016 24.27C73.016 25.1873 73.1867 26.0513 73.528 26.862C73.8693 27.6513 74.3707 28.2913 75.032 28.782C75.6933 29.2727 76.4933 29.518 77.432 29.518ZM88.054 32.75L88.086 8.43H92.31V32.75H88.054ZM99.793 32.75L93.489 15.79H97.809L102.065 27.886L106.257 15.79H110.577L104.241 32.75H99.793ZM118.832 33.07C117.382 33.07 116.123 32.8247 115.056 32.334C114.011 31.822 113.136 31.15 112.432 30.318C111.75 29.4647 111.238 28.5153 110.896 27.47C110.555 26.4247 110.384 25.358 110.384 24.27C110.384 23.182 110.544 22.126 110.864 21.102C111.206 20.0567 111.707 19.1073 112.368 18.254C113.051 17.4007 113.915 16.7287 114.96 16.238C116.006 15.726 117.243 15.47 118.672 15.47C120.208 15.47 121.563 15.8113 122.736 16.494C123.91 17.1767 124.827 18.1793 125.488 19.502C126.15 20.8033 126.48 22.4247 126.48 24.366V25.454H114.672C114.736 26.606 115.131 27.6087 115.856 28.462C116.582 29.294 117.574 29.71 118.832 29.71C119.558 29.71 120.155 29.5927 120.624 29.358C121.094 29.1233 121.456 28.8567 121.712 28.558C121.968 28.238 122.15 27.9713 122.256 27.758C122.363 27.5233 122.416 27.406 122.416 27.406H126.352C126.352 27.406 126.299 27.598 126.192 27.982C126.086 28.3447 125.883 28.814 125.584 29.39C125.307 29.9447 124.891 30.51 124.336 31.086C123.782 31.6407 123.056 32.11 122.16 32.494C121.264 32.878 120.155 33.07 118.832 33.07ZM114.672 22.67H122.384C122.32 21.3473 121.926 20.366 121.2 19.726C120.475 19.086 119.622 18.766 118.64 18.766C117.552 18.766 116.646 19.118 115.92 19.822C115.195 20.5047 114.779 21.454 114.672 22.67ZM128.078 32.75V15.79H132.334V18.222H132.526C132.696 17.9233 132.963 17.5607 133.326 17.134C133.688 16.686 134.19 16.302 134.83 15.982C135.47 15.6407 136.28 15.47 137.262 15.47C138.563 15.47 139.63 15.7687 140.462 16.366C141.315 16.942 141.944 17.71 142.35 18.67C142.776 19.63 142.99 20.6647 142.99 21.774V32.75H138.734V22.35C138.734 21.4327 138.478 20.6433 137.966 19.982C137.454 19.3207 136.686 18.99 135.662 18.99C134.872 18.99 134.232 19.1927 133.742 19.598C133.251 19.982 132.888 20.4833 132.654 21.102C132.44 21.7207 132.334 22.3713 132.334 23.054V32.75H128.078ZM152.092 33.07C150.833 33.07 149.734 32.8247 148.796 32.334C147.857 31.822 147.068 31.15 146.428 30.318C145.809 29.4647 145.34 28.5153 145.02 27.47C144.721 26.4247 144.572 25.358 144.572 24.27C144.572 23.182 144.721 22.1153 145.02 21.07C145.34 20.0247 145.809 19.086 146.428 18.254C147.068 17.4007 147.857 16.7287 148.796 16.238C149.734 15.726 150.833 15.47 152.092 15.47C153.18 15.47 154.076 15.6513 154.78 16.014C155.484 16.3553 156.038 16.7393 156.444 17.166C156.849 17.5713 157.126 17.902 157.276 18.158H157.468V8.43H161.724V32.75H157.468V30.382H157.276C157.126 30.638 156.849 30.9793 156.444 31.406C156.038 31.8327 155.484 32.2167 154.78 32.558C154.076 32.8993 153.18 33.07 152.092 33.07ZM153.212 29.582C154.172 29.582 154.972 29.326 155.612 28.814C156.252 28.2807 156.732 27.6087 157.052 26.798C157.372 25.9873 157.532 25.1447 157.532 24.27C157.532 23.3953 157.372 22.5527 157.052 21.742C156.732 20.9313 156.252 20.27 155.612 19.758C154.972 19.2247 154.172 18.958 153.212 18.958C152.252 18.958 151.441 19.2247 150.78 19.758C150.14 20.27 149.66 20.9313 149.34 21.742C149.02 22.5527 148.86 23.3953 148.86 24.27C148.86 25.1447 149.02 25.9873 149.34 26.798C149.66 27.6087 150.14 28.2807 150.78 28.814C151.441 29.326 152.252 29.582 153.212 29.582ZM172.338 33.07C170.482 33.07 168.904 32.654 167.602 31.822C166.301 30.99 165.309 29.9127 164.626 28.59C163.965 27.246 163.634 25.806 163.634 24.27C163.634 22.734 163.965 21.3047 164.626 19.982C165.309 18.638 166.301 17.55 167.602 16.718C168.904 15.886 170.482 15.47 172.338 15.47C174.216 15.47 175.794 15.886 177.074 16.718C178.376 17.55 179.357 18.638 180.018 19.982C180.701 21.3047 181.042 22.734 181.042 24.27C181.042 25.806 180.701 27.246 180.018 28.59C179.357 29.9127 178.376 30.99 177.074 31.822C175.794 32.654 174.216 33.07 172.338 33.07ZM172.338 29.518C173.298 29.518 174.098 29.2727 174.738 28.782C175.4 28.2913 175.901 27.6513 176.242 26.862C176.584 26.0513 176.754 25.1873 176.754 24.27C176.754 23.3313 176.584 22.4673 176.242 21.678C175.901 20.8887 175.4 20.2487 174.738 19.758C174.098 19.2673 173.298 19.022 172.338 19.022C171.4 19.022 170.6 19.2673 169.938 19.758C169.277 20.2487 168.776 20.8887 168.434 21.678C168.093 22.4673 167.922 23.3313 167.922 24.27C167.922 25.1873 168.093 26.0513 168.434 26.862C168.776 27.6513 169.277 28.2913 169.938 28.782C170.6 29.2727 171.4 29.518 172.338 29.518Z" fill="#101014"/>
              <defs>
                <clipPath id="clip0_390_976">
                  <rect width="24.5" height="37.4886" fill="white" transform="translate(5.75 2.25574)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          
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
              placeholder="Ingresa aquí el produto o servicio..."
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
              <option>Productos totales</option>
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
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t pt-4">
            <div className="flex gap-3 mb-4">
              <button
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => { setSelectedProductId(item.id); setShowPromotionModal(true); }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Percent className="w-4 h-4" />
              </button>
              <button
                onClick={() => carrito.length > 0 ? clearCart() : toast.error('No hay productos en el carrito')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Cancelar</span>
                <X className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <span>Guardar borrador</span>
                <Save className="w-4 h-4" onClick={() => carrito.length > 0 ? setShowDraftSaveModal(true) : toast.error('No hay productos en el carrito')} />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-semibold">{formatPrice(total)} $</span>
            </div>
            
            <button
              onClick={handlePayment}
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
            { id: 'destacado', label: 'Destacado', icon: Star },
            { id: 'borradoras', label: 'Borradores', icon: FileText },
            { id: 'productos', label: 'Productos', icon: Package },
            { id: 'clientes', label: 'Clientes', icon: Users }
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

      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onAction={handleSidebarAction}
      />
      
      {/* Client Modal */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onClientSelect={() => {}}
      />
      
      {/* Draft Save Modal */}
      <DraftSaveModal
        isOpen={showDraftSaveModal}
        onClose={() => setShowDraftSaveModal(false)}
      />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentComplete={handlePaymentComplete}
        total={total}
      />

      {/* Supervisor Auth Modal */}
      <SupervisorAuthModal
        isOpen={showSupervisorAuthModal}
        onClose={() => setShowSupervisorAuthModal(false)}
        onAuthorize={() => toast.success('Operación autorizada')}
      />
      
      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        onPrint={handlePrint}
        onSendEmail={handleSendEmail}
      />

      {/* Promotion Modal */}
      <PromotionModal
        isOpen={showPromotionModal}
        onClose={() => setShowPromotionModal(false)}
        productId={selectedProductId}
      />
    </div>
  )
}