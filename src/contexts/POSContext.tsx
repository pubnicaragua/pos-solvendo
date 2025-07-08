import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Producto, Caja, Cliente, MedioPago, Venta, VentaItem } from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartItem {
  producto: Producto
  cantidad: number
  descuento?: number
}

interface POSContextType {
  productos: Producto[]
  carrito: CartItem[]
  cajaActual: Caja | null
  cajaAbierta: boolean
  clientes: Cliente[]
  mediosPago: MedioPago[]
  loadProductos: () => Promise<void>
  loadClientes: () => Promise<void>
  loadMediosPago: () => Promise<void>
  addToCart: (producto: Producto, cantidad?: number) => void
  updateCartItem: (index: number, cantidad: number) => void
  removeFromCart: (index: number) => void
  clearCart: () => void
  getTotal: () => number
  getSubtotal: () => number
  openCaja: (montoInicial: number) => Promise<boolean>
  closeCaja: () => Promise<boolean>
  checkCajaStatus: () => Promise<void>
  procesarVenta: (clienteId: string | null, metodoPago: string, tipoDte: string) => Promise<{ success: boolean; venta?: Venta; error?: string }>
  crearCliente: (cliente: Omit<Cliente, 'id' | 'activo'>) => Promise<{ success: boolean; cliente?: Cliente; error?: string }>
  procesarDevolucion: (ventaId: string, items: { producto_id: string; cantidad: number }[]) => Promise<{ success: boolean; error?: string }>
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
  const [carrito, setCarrito] = useState<CartItem[]>([])
  const [cajaActual, setCajaActual] = useState<Caja | null>(null)
  const [cajaAbierta, setCajaAbierta] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([])
  const { empresaId, sucursalId, user } = useAuth()

  useEffect(() => {
    if (empresaId && sucursalId) {
      loadProductos()
      loadClientes()
      loadMediosPago()
      checkCajaStatus()
    }
  }, [empresaId, sucursalId])

  const loadProductos = async () => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)
        .order('nombre')

      if (error) throw error
      setProductos(data || [])
    } catch (error) {
      console.error('Error loading productos:', error)
    }
  }

  const loadClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('activo', true)
        .order('razon_social')

      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error('Error loading clientes:', error)
    }
  }

  const loadMediosPago = async () => {
    try {
      const { data, error } = await supabase
        .from('medios_pago')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nombre')

      if (error) throw error
      setMediosPago(data || [])
    } catch (error) {
      console.error('Error loading medios de pago:', error)
    }
  }

  const checkCajaStatus = async () => {
    if (!sucursalId) return

    try {
      // Get the default caja for this sucursal
      const { data: caja, error: cajaError } = await supabase
        .from('cajas')
        .select('*')
        .eq('sucursal_id', sucursalId)
        .eq('activo', true)
        .single()

      if (cajaError || !caja) return

      setCajaActual(caja)

      // Check if caja is open (has movements today without closing)
      const today = new Date().toISOString().split('T')[0]
      const { data: movimientos } = await supabase
        .from('movimientos_caja')
        .select('*')
        .eq('sucursal_id', sucursalId)
        .gte('fecha', `${today}T00:00:00`)
        .order('fecha', { ascending: false })

      // Simple check: if there are movements today, assume caja is open
      setCajaAbierta(movimientos && movimientos.length > 0)
    } catch (error) {
      console.error('Error checking caja status:', error)
    }
  }

  const openCaja = async (montoInicial: number): Promise<boolean> => {
    if (!empresaId || !sucursalId || !user) return false

    try {
      const { error } = await supabase
        .from('movimientos_caja')
        .insert({
          empresa_id: empresaId,
          sucursal_id: sucursalId,
          usuario_id: user.id,
          tipo: 'ingreso',
          monto: montoInicial,
          observacion: 'Apertura de caja'
        })

      if (error) throw error
      
      setCajaAbierta(true)
      return true
    } catch (error) {
      console.error('Error opening caja:', error)
      return false
    }
  }

  const closeCaja = async (): Promise<boolean> => {
    try {
      setCajaAbierta(false)
      return true
    } catch (error) {
      console.error('Error closing caja:', error)
      return false
    }
  }

  const addToCart = (producto: Producto, cantidad: number = 1) => {
    setCarrito(prev => {
      const existingIndex = prev.findIndex(item => item.producto.id === producto.id)
      
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].cantidad += cantidad
        return updated
      } else {
        return [...prev, { producto, cantidad }]
      }
    })
  }

  const updateCartItem = (index: number, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(index)
      return
    }

    setCarrito(prev => {
      const updated = [...prev]
      updated[index].cantidad = cantidad
      return updated
    })
  }

  const removeFromCart = (index: number) => {
    setCarrito(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCarrito([])
  }

  const getSubtotal = () => {
    return carrito.reduce((total, item) => {
      const itemTotal = item.producto.precio * item.cantidad
      const descuento = item.descuento || 0
      return total + (itemTotal - descuento)
    }, 0)
  }

  const getTotal = () => {
    // For now, total = subtotal (no taxes implemented yet)
    return getSubtotal()
  }

  const procesarVenta = async (clienteId: string | null, metodoPago: string, tipoDte: string): Promise<{ success: boolean; venta?: Venta; error?: string }> => {
    if (!empresaId || !sucursalId || !user || carrito.length === 0) {
      return { success: false, error: 'Datos incompletos para procesar la venta' }
    }

    try {
      // Generate folio
      const folio = `V${Date.now()}`
      const total = getTotal()

      // Create venta
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert({
          empresa_id: empresaId,
          sucursal_id: sucursalId,
          caja_id: cajaActual?.id,
          cliente_id: clienteId,
          usuario_id: user.id,
          folio,
          tipo_dte: tipoDte,
          metodo_pago: metodoPago,
          total
        })
        .select()
        .single()

      if (ventaError) throw ventaError

      // Create venta items
      const ventaItems = carrito.map(item => ({
        venta_id: venta.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        descuento: item.descuento || 0
      }))

      const { error: itemsError } = await supabase
        .from('venta_items')
        .insert(ventaItems)

      if (itemsError) throw itemsError

      // Clear cart
      clearCart()

      return { success: true, venta }
    } catch (error) {
      console.error('Error procesando venta:', error)
      return { success: false, error: 'Error al procesar la venta' }
    }
  }

  const crearCliente = async (clienteData: Omit<Cliente, 'id' | 'activo'>): Promise<{ success: boolean; cliente?: Cliente; error?: string }> => {
    try {
      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert({
          ...clienteData,
          activo: true
        })
        .select()
        .single()

      if (error) throw error

      // Refresh clients list
      await loadClientes()

      return { success: true, cliente }
    } catch (error) {
      console.error('Error creando cliente:', error)
      return { success: false, error: 'Error al crear el cliente' }
    }
  }

  const procesarDevolucion = async (ventaId: string, items: { producto_id: string; cantidad: number }[]): Promise<{ success: boolean; error?: string }> => {
    try {
      // Here you would implement the return logic
      // For now, just return success
      return { success: true }
    } catch (error) {
      console.error('Error procesando devolución:', error)
      return { success: false, error: 'Error al procesar la devolución' }
    }
  }

  const value = {
    productos,
    carrito,
    cajaActual,
    cajaAbierta,
    clientes,
    mediosPago,
    loadProductos,
    loadClientes,
    loadMediosPago,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotal,
    getSubtotal,
    openCaja,
    closeCaja,
    checkCajaStatus,
    procesarVenta,
    crearCliente,
    procesarDevolucion
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}