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
      // For demo, use hardcoded products
      const demoProductos = [
        { id: 'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD001', nombre: 'Ejemplo producto 1', descripcion: 'Producto de ejemplo', precio: 34500, activo: true },
        { id: 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD002', nombre: 'Ejemplo producto 2', descripcion: 'Producto de ejemplo', precio: 68500, activo: true },
        { id: 'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD003', nombre: 'Ejemplo producto 3', descripcion: 'Producto de ejemplo', precio: 34500, activo: true },
        { id: 'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD004', nombre: 'Ejemplo producto 4', descripcion: 'Producto de ejemplo', precio: 34500, activo: true },
        { id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD005', nombre: 'Ejemplo producto 5', descripcion: 'Producto de ejemplo', precio: 34500, activo: true },
        { id: 'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', codigo: 'PROD006', nombre: 'Ejemplo producto 6', descripcion: 'Producto de ejemplo', precio: 0, activo: true }
      ]
      setProductos(demoProductos)
    } catch (error) {
      console.error('Error loading productos:', error)
    }
  }

  const loadClientes = async () => {
    try {
      // For demo, use hardcoded clients
      const demoClientes = [
        { 
          id: 'g1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
          razon_social: 'Cliente Demo', 
          rut: '11.111.111-1', 
          direccion: 'Calle Demo 456', 
          comuna: 'Santiago', 
          ciudad: 'Santiago', 
          giro: 'Persona Natural', 
          telefono: '+56 9 8765 4321', 
          email: 'cliente@demo.cl', 
          contacto: 'Cliente Demo', 
          activo: true 
        }
      ]
      setClientes(demoClientes)
    } catch (error) {
      console.error('Error loading clientes:', error)
    }
  }

  const loadMediosPago = async () => {
    try {
      // For demo, use hardcoded payment methods
      const demoMediosPago = [
        { id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', empresa_id: empresaId!, nombre: 'Efectivo', descripcion: 'Pago en efectivo' },
        { id: 'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', empresa_id: empresaId!, nombre: 'Tarjeta', descripcion: 'Pago con tarjeta' },
        { id: 'e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', empresa_id: empresaId!, nombre: 'Transferencia', descripcion: 'Transferencia bancaria' }
      ]
      setMediosPago(demoMediosPago)
    } catch (error) {
      console.error('Error loading medios de pago:', error)
    }
  }

  const checkCajaStatus = async () => {
    // For demo, assume caja is closed initially
    setCajaAbierta(false)
    setCajaActual({
      id: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      empresa_id: empresaId!,
      sucursal_id: sucursalId!,
      nombre: 'Caja Principal',
      activo: true
    })
  }

  const openCaja = async (montoInicial: number): Promise<boolean> => {
    try {
      // For demo, just set caja as open
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
    return getSubtotal()
  }

  const procesarVenta = async (clienteId: string | null, metodoPago: string, tipoDte: string): Promise<{ success: boolean; venta?: Venta; error?: string }> => {
    try {
      // For demo, create a mock venta
      const folio = `V${Date.now()}`
      const total = getTotal()

      const venta: Venta = {
        id: `venta-${Date.now()}`,
        empresa_id: empresaId!,
        sucursal_id: sucursalId!,
        caja_id: cajaActual?.id,
        cliente_id: clienteId,
        usuario_id: user!.id,
        folio,
        tipo_dte: tipoDte,
        metodo_pago: metodoPago,
        total,
        fecha: new Date().toISOString()
      }

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
      const cliente: Cliente = {
        id: `cliente-${Date.now()}`,
        ...clienteData,
        activo: true
      }

      // Add to local state
      setClientes(prev => [...prev, cliente])

      return { success: true, cliente }
    } catch (error) {
      console.error('Error creando cliente:', error)
      return { success: false, error: 'Error al crear el cliente' }
    }
  }

  const procesarDevolucion = async (ventaId: string, items: { producto_id: string; cantidad: number }[]): Promise<{ success: boolean; error?: string }> => {
    try {
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