import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Producto, Cliente, Venta } from '../lib/supabase'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

interface CartItem extends Producto {
  quantity: number
}

interface DraftSale {
  id: string
  nombre: string
  fecha: string
  items: CartItem[]
  total: number
}

interface POSContextType {
  // Products
  productos: Producto[]
  loading: boolean
  loadProductos: () => Promise<void>
  
  // Cart
  carrito: CartItem[]
  total: number
  addToCart: (produto: Produto) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Drafts
  borradores: DraftSale[]
  loadBorradores: () => Promise<void>
  saveDraft: (nombre: string) => Promise<boolean>
  loadDraft: (draftId: string) => Promise<boolean>
  deleteDraft: (draftId: string) => Promise<boolean>
  
  // Sales
  procesarVenta: (metodoPago: string, tipoDte: string, clienteId?: string) => Promise<{ success: boolean; venta?: any; error?: string }>
  
  // Clients
  crearCliente: (clienteData: any) => Promise<{ success: boolean; cliente?: Cliente; error?: string }>
  
  // Cash register
  cajaAbierta: boolean
  checkCajaStatus: () => Promise<void>
  openCaja: (montoInicial: number) => Promise<boolean>
  closeCaja: () => Promise<boolean>

  // Promotions
  promociones: any[]
  loadPromociones: () => Promise<void>
  aplicarPromocion: (produtoId: string, promocionId: string) => Promise<boolean>
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export const usePOS = () => {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error('usePOS must be used within a POSProvider')
  }
  return context
}

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [carrito, setCarrito] = useState<CartItem[]>([])
  const [borradores, setBorradores] = useState<DraftSale[]>([])
  const [promociones, setPromociones] = useState<any[]>([])
  const [cajaAbierta, setCajaAbierta] = useState(false)
  const { user, empresaId, sucursalId } = useAuth() 

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

  const loadProductos = async () => {
    if (!empresaId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error loading productos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBorradores = async () => {
    if (!empresaId || !user) return
    
    try {
      const { data, error } = await supabase
        .from('borradores_venta')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('usuario_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBorradores(data || [])
    } catch (error) {
      console.error('Error loading drafts:', error)
      toast.error('Error al cargar borradores')
    }
  }

  const saveDraft = async (nombre: string) => {
    if (!empresaId || !user || carrito.length === 0) return false
    
    try {
      const { error } = await supabase
        .from('borradores_venta')
        .insert([{
          empresa_id: empresaId,
          usuario_id: user.id,
          nombre,
          items: carrito,
          total
        }])

      if (error) throw error
      
      toast.success('Borrador guardado correctamente')
      await loadBorradores()
      return true
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Error al guardar borrador')
      return false
    }
  }

  const loadDraft = async (draftId: string) => {
    try {
      const { data, error } = await supabase
        .from('borradores_venta')
        .select('*')
        .eq('id', draftId)
        .single()

      if (error) throw error
      if (!data) return false

      setCarrito(data.items || [])
      toast.success('Borrador cargado correctamente')
      return true
    } catch (error) {
      console.error('Error loading draft:', error)
      toast.error('Error al cargar borrador')
      return false
    }
  }

  const deleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('borradores_venta')
        .delete()
        .eq('id', draftId)

      if (error) throw error
      
      toast.success('Borrador eliminado correctamente')
      await loadBorradores()
      return true
    } catch (error) {
      console.error('Error deleting draft:', error)
      toast.error('Error al eliminar borrador')
      return false
    }
  }

  const loadPromociones = async () => {
    if (!empresaId) return
    
    try {
      const { data, error } = await supabase
        .from('promociones')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromociones(data || [])
    } catch (error) {
      console.error('Error loading promotions:', error)
      toast.error('Error al cargar promociones')
    }
  }

  const aplicarPromocion = async (produtoId: string, promocionId: string) => {
    // Implementación básica, se puede expandir según necesidades
    try {
      // Buscar el produto en el carrito
      const produtoIndex = carrito.findIndex(item => item.id === produtoId)
      if (produtoIndex === -1) return false

      // Buscar la promoción
      const promocion = promociones.find(p => p.id === promocionId)
      if (!promocion) return false

      // Aplicar la promoción según su tipo
      const newCarrito = [...carrito]
      const producto = newCarrito[produtoIndex]

      if (promocion.tipo === 'descuento_porcentaje') {
        const descuento = producto.precio * (promocion.valor / 100)
        newCarrito[produtoIndex] = {
          ...producto,
          precio: producto.precio - descuento
        }
      } else if (promocion.tipo === 'descuento_monto') {
        newCarrito[produtoIndex] = {
          ...producto,
          precio: Math.max(0, producto.precio - promocion.valor)
        }
      }

      setCarrito(newCarrito)
      toast.success(`Promoción "${promocion.nombre}" aplicada`)
      return true
    } catch (error) {
      console.error('Error applying promotion:', error)
      toast.error('Error al aplicar promoción')
      return false
    }
  }

  const addToCart = (producto: Producto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.id === producto.id)
      if (existing) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...producto, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCarrito(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCarrito(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCarrito([])
  }

  const procesarVenta = async (metodoPago: string, tipoDte: string, clienteId?: string) => {
    if (!user || !empresaId || !sucursalId || carrito.length === 0) {
      return { success: false, error: 'Dados incompletos para processar venda' }
    }

    try {
      // Generate folio
      const folio = `${Date.now()}`
      
      // Create sale
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert([{
          empresa_id: empresaId,
          sucursal_id: sucursalId,
          cliente_id: clienteId,
          usuario_id: user.id,
          folio,
          tipo_dte: tipoDte,
          metodo_pago: metodoPago,
          subtotal: total,
          total,
          estado: 'completada'
        }])
        .select()
        .single()

      if (ventaError) throw ventaError

      // Create sale items
      const ventaItems = carrito.map(item => ({
        venta_id: venta.id,
        produto_id: item.id,
        cantidad: item.quantity,
        precio_unitario: item.precio,
        subtotal: item.precio * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from('venta_items')
        .insert(ventaItems)

      if (itemsError) throw itemsError

      return { success: true, venta }
    } catch (error) {
      console.error('Error processing sale:', error)
      return { success: false, error: 'Erro ao processar a venda' }
    }
  }

  const crearCliente = async (clienteData: any) => {
    if (!empresaId) {
      return { success: false, error: 'Nenhuma empresa selecionada' }
    }

    try {
      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert([{
          empresa_id: empresaId,
          ...clienteData
        }])
        .select()
        .single()

      if (error) throw error

      return { success: true, cliente }
    } catch (error) {
      console.error('Error creating client:', error)
      return { success: false, error: 'Erro ao criar cliente' }
    }
  }

  const checkCajaStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('aperturas_caja')
        .select('*')
        .eq('usuario_id', user.id)
        .eq('estado', 'abierta')
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) throw error
      setCajaAbierta(data && data.length > 0)
    } catch (error) {
      console.error('Error checking caja status:', error)
      setCajaAbierta(false)
    }
  }

  const openCaja = async (montoInicial: number) => {
    if (!user || !empresaId || !sucursalId) return false

    try {
      // Get default caja
      const { data: cajas } = await supabase
        .from('cajas')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('sucursal_id', sucursalId)
        .eq('activo', true)
        .limit(1)

      if (!cajas || cajas.length === 0) return false

      const { error } = await supabase
        .from('aperturas_caja')
        .insert([{
          caja_id: cajas[0].id,
          usuario_id: user.id,
          monto_inicial: montoInicial,
          estado: 'abierta'
        }])

      if (error) throw error

      setCajaAbierta(true)
      return true
    } catch (error) {
      console.error('Error opening caja:', error)
      return false
    }
  }

  const closeCaja = async () => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('aperturas_caja')
        .update({
          fecha_cierre: new Date().toISOString(),
          estado: 'cerrada'
        })
        .eq('usuario_id', user.id)
        .eq('estado', 'abierta')

      if (error) throw error

      setCajaAbierta(false)
      return true
    } catch (error) {
      console.error('Error closing caja:', error)
      return false
    }
  }

  useEffect(() => {
    if (empresaId) {
      loadProductos()
      loadPromociones()
      loadBorradores()
    }
  }, [empresaId])

  const value = {
    productos: productos,
    loading: loading,
    loadProductos: loadProductos,
    carrito: carrito,
    total: total,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    clearCart: clearCart,
    borradores: borradores,
    loadBorradores: loadBorradores,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    deleteDraft: deleteDraft,
    procesarVenta: procesarVenta,
    crearCliente: crearCliente,
    cajaAbierta: cajaAbierta,
    checkCajaStatus: checkCajaStatus,
    openCaja: openCaja,
    closeCaja: closeCaja,
    promociones: promociones,
    loadPromociones: loadPromociones,
    aplicarPromocion: aplicarPromocion
  }

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  )
};