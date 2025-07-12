import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Produto, Cliente, Venta } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartItem extends Produto {
  quantity: number
}

interface POSContextType {
  // Products
  produtos: Produto[]
  loading: boolean
  loadProductos: () => Promise<void>
  
  // Cart
  carrito: CartItem[]
  total: number
  addToCart: (produto: Produto) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  
  // Sales
  procesarVenta: (metodoPago: string, tipoDte: string, clienteId?: string) => Promise<{ success: boolean; venta?: any; error?: string }>
  
  // Clients
  crearCliente: (clienteData: any) => Promise<{ success: boolean; cliente?: Cliente; error?: string }>
  
  // Cash register
  cajaAbierta: boolean
  checkCajaStatus: () => Promise<void>
  openCaja: (montoInicial: number) => Promise<boolean>
  closeCaja: () => Promise<boolean>
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
  const [produtos, setProductos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [carrito, setCarrito] = useState<CartItem[]>([])
  const [cajaAbierta, setCajaAbierta] = useState(false)
  const { user, empresaId, sucursalId } = useAuth()

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

  const loadProductos = async () => {
    if (!empresaId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nome')

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error loading produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (produto: Produto) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.id === produto.id)
      if (existing) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...produto, quantity: 1 }]
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
    }
  }, [empresaId])

  const value = {
    produtos,
    loading,
    loadProductos,
    carrito,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    procesarVenta,
    crearCliente,
    cajaAbierta,
    checkCajaStatus,
    openCaja,
    closeCaja
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
};