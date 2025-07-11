import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  supabase, 
  Producto, 
  Caja, 
  Cliente, 
  MedioPago, 
  Venta, 
  VentaItem,
  AperturaCaja,
  MovimientoCaja,
  Promocion,
  Categoria
} from '../lib/supabase'
import { useAuth } from './AuthContext'

interface CartItem {
  producto: Producto
  cantidad: number
  descuento?: number
}

interface POSContextType {
  productos: Producto[]
  categorias: Categoria[]
  promociones: Promocion[]
  carrito: CartItem[]
  cajaActual: Caja | null
  aperturaActual: AperturaCaja | null
  cajaAbierta: boolean
  clientes: Cliente[]
  mediosPago: MedioPago[]
  loadProductos: () => Promise<void>
  loadCategorias: () => Promise<void>
  loadPromociones: () => Promise<void>
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
  addMovimientoCaja: (tipo: 'ingreso' | 'retiro', monto: number, observacion?: string) => Promise<boolean>
  procesarVenta: (clienteId: string | null, metodoPago: string, tipoDte: string) => Promise<{ success: boolean; venta?: Venta; error?: string }>
  crearCliente: (cliente: Omit<Cliente, 'id' | 'empresa_id' | 'activo' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; cliente?: Cliente; error?: string }>
  procesarDevolucion: (ventaId: string, items: { producto_id: string; cantidad: number }[]) => Promise<{ success: boolean; error?: string }>
  buscarVentaPorFolio: (folio: string) => Promise<{ success: boolean; venta?: Venta; items?: VentaItem[]; error?: string }>
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
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [promociones, setPromociones] = useState<Promocion[]>([])
  const [carrito, setCarrito] = useState<CartItem[]>([])
  const [cajaActual, setCajaActual] = useState<Caja | null>(null)
  const [aperturaActual, setAperturaActual] = useState<AperturaCaja | null>(null)
  const [cajaAbierta, setCajaAbierta] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [mediosPago, setMediosPago] = useState<MedioPago[]>([])
  const { empresaId, sucursalId, user } = useAuth()

  useEffect(() => {
    if (empresaId && sucursalId) {
      loadProductos()
      loadCategorias()
      loadPromociones()
      loadClientes()
      loadMediosPago()
      checkCajaStatus()
    }
  }, [empresaId, sucursalId])

  const loadProductos = async () => {
    try {
      if (!empresaId) return

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('Error loading productos:', error)
        return
      }

      setProductos(data || [])
    } catch (error) {
      console.error('Error loading productos:', error)
    }
  }

  const loadCategorias = async () => {
    try {
      if (!empresaId) return

      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('Error loading categorias:', error)
        return
      }

      setCategorias(data || [])
    } catch (error) {
      console.error('Error loading categorias:', error)
    }
  }

  const loadPromociones = async () => {
    try {
      if (!empresaId) return

      const { data, error } = await supabase
        .from('promociones')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('Error loading promociones:', error)
        return
      }

      setPromociones(data || [])
    } catch (error) {
      console.error('Error loading promociones:', error)
    }
  }

  const loadClientes = async () => {
    try {
      if (!empresaId) return

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('razon_social')

      if (error) {
        console.error('Error loading clientes:', error)
        return
      }

      setClientes(data || [])
    } catch (error) {
      console.error('Error loading clientes:', error)
    }
  }

  const loadMediosPago = async () => {
    try {
      if (!empresaId) return

      const { data, error } = await supabase
        .from('medios_pago')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('activo', true)
        .order('nombre')

      if (error) {
        console.error('Error loading medios de pago:', error)
        return
      }

      setMediosPago(data || [])
    } catch (error) {
      console.error('Error loading medios de pago:', error)
    }
  }

  const checkCajaStatus = async () => {
    try {
      if (!empresaId || !sucursalId) return

      // Get active cash register
      const { data: caja, error: cajaError } = await supabase
        .from('cajas')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('sucursal_id', sucursalId)
        .eq('activo', true)
        .single()

      if (cajaError || !caja) {
        console.error('No active cash register found')
        return
      }

      setCajaActual(caja)

      // Check if cash register is open
      const { data: apertura, error: aperturaError } = await supabase
        .from('aperturas_caja')
        .select('*')
        .eq('caja_id', caja.id)
        .eq('estado', 'abierta')
        .single()

      if (apertura && !aperturaError) {
        setCajaAbierta(true)
        setAperturaActual(apertura)
      } else {
        setCajaAbierta(false)
        setAperturaActual(null)
      }
    } catch (error) {
      console.error('Error checking caja status:', error)
    }
  }

  const openCaja = async (montoInicial: number): Promise<boolean> => {
    try {
      if (!cajaActual || !user) return false

      const { data, error } = await supabase
        .from('aperturas_caja')
        .insert({
          caja_id: cajaActual.id,
          usuario_id: user.id,
          monto_inicial: montoInicial,
          estado: 'abierta'
        })
        .select()
        .single()

      if (error) {
        console.error('Error opening caja:', error)
        return false
      }

      setCajaAbierta(true)
      setAperturaActual(data)
      return true
    } catch (error) {
      console.error('Error opening caja:', error)
      return false
    }
  }

  const closeCaja = async (): Promise<boolean> => {
    try {
      if (!aperturaActual) return false

      // Calculate final amount and difference
      const { data: movimientos } = await supabase
        .from('movimientos_caja')
        .select('tipo, monto')
        .eq('apertura_caja_id', aperturaActual.id)

      let montoFinal = aperturaActual.monto_inicial
      movimientos?.forEach(mov => {
        if (mov.tipo === 'ingreso' || mov.tipo === 'venta') {
          montoFinal += mov.monto
        } else if (mov.tipo === 'retiro') {
          montoFinal -= mov.monto
        }
      })

      const diferencia = montoFinal - aperturaActual.monto_inicial

      const { error } = await supabase
        .from('aperturas_caja')
        .update({
          fecha_cierre: new Date().toISOString(),
          monto_final: montoFinal,
          diferencia: diferencia,
          estado: 'cerrada'
        })
        .eq('id', aperturaActual.id)

      if (error) {
        console.error('Error closing caja:', error)
        return false
      }

      setCajaAbierta(false)
      setAperturaActual(null)
      return true
    } catch (error) {
      console.error('Error closing caja:', error)
      return false
    }
  }

  const addMovimientoCaja = async (tipo: 'ingreso' | 'retiro', monto: number, observacion?: string): Promise<boolean> => {
    try {
      if (!aperturaActual || !user) return false

      const { error } = await supabase
        .from('movimientos_caja')
        .insert({
          apertura_caja_id: aperturaActual.id,
          usuario_id: user.id,
          tipo,
          monto,
          observacion
        })

      if (error) {
        console.error('Error adding cash movement:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error adding cash movement:', error)
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
      if (!empresaId || !sucursalId || !user || !aperturaActual) {
        return { success: false, error: 'Datos de sesión incompletos' }
      }

      if (carrito.length === 0) {
        return { success: false, error: 'Carrito vacío' }
      }

      // Find payment method
      const medioPago = mediosPago.find(mp => mp.nombre.toLowerCase() === metodoPago.toLowerCase())
      if (!medioPago) {
        return { success: false, error: 'Método de pago no válido' }
      }

      // Generate folio
      const folio = `V${Date.now()}`
      const subtotal = getSubtotal()
      const total = getTotal()

      // Create sale
      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .insert({
          empresa_id: empresaId,
          sucursal_id: sucursalId,
          caja_id: cajaActual?.id,
          apertura_caja_id: aperturaActual.id,
          cliente_id: clienteId,
          usuario_id: user.id,
          folio,
          tipo_dte: tipoDte as 'boleta' | 'factura' | 'nota_credito',
          metodo_pago_id: medioPago.id,
          subtotal,
          descuento: 0,
          impuestos: 0,
          total,
          estado: 'completada'
        })
        .select()
        .single()

      if (ventaError || !venta) {
        console.error('Error creating sale:', ventaError)
        return { success: false, error: 'Error al crear la venta' }
      }

      // Create sale items
      const ventaItems = carrito.map(item => ({
        venta_id: venta.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        descuento: item.descuento || 0,
        subtotal: item.producto.precio * item.cantidad - (item.descuento || 0)
      }))

      const { error: itemsError } = await supabase
        .from('venta_items')
        .insert(ventaItems)

      if (itemsError) {
        console.error('Error creating sale items:', itemsError)
        return { success: false, error: 'Error al crear los items de venta' }
      }

      // Add cash movement for sale
      if (metodoPago.toLowerCase() === 'efectivo') {
        await addMovimientoCaja('venta', total, `Venta ${folio}`)
      }

      // Clear cart
      clearCart()

      return { success: true, venta }
    } catch (error) {
      console.error('Error procesando venta:', error)
      return { success: false, error: 'Error al procesar la venta' }
    }
  }

  const crearCliente = async (clienteData: Omit<Cliente, 'id' | 'empresa_id' | 'activo' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; cliente?: Cliente; error?: string }> => {
    try {
      if (!empresaId) {
        return { success: false, error: 'No hay empresa seleccionada' }
      }

      const { data: cliente, error } = await supabase
        .from('clientes')
        .insert({
          empresa_id: empresaId,
          ...clienteData
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating client:', error)
        return { success: false, error: 'Error al crear el cliente' }
      }

      // Reload clients
      await loadClientes()

      return { success: true, cliente }
    } catch (error) {
      console.error('Error creando cliente:', error)
      return { success: false, error: 'Error al crear el cliente' }
    }
  }

  const buscarVentaPorFolio = async (folio: string): Promise<{ success: boolean; venta?: Venta; items?: VentaItem[]; error?: string }> => {
    try {
      if (!empresaId) {
        return { success: false, error: 'No hay empresa seleccionada' }
      }

      const { data: venta, error: ventaError } = await supabase
        .from('ventas')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('folio', folio)
        .single()

      if (ventaError || !venta) {
        return { success: false, error: 'Venta no encontrada' }
      }

      const { data: items, error: itemsError } = await supabase
        .from('venta_items')
        .select('*, productos(*)')
        .eq('venta_id', venta.id)

      if (itemsError) {
        return { success: false, error: 'Error al cargar items de venta' }
      }

      return { success: true, venta, items: items || [] }
    } catch (error) {
      console.error('Error searching sale:', error)
      return { success: false, error: 'Error en la búsqueda' }
    }
  }

  const procesarDevolucion = async (ventaId: string, items: { producto_id: string; cantidad: number }[]): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Usuario no autenticado' }
      }

      // Calculate return amount
      let montoDevuelto = 0
      for (const item of items) {
        const { data: ventaItem } = await supabase
          .from('venta_items')
          .select('precio_unitario')
          .eq('venta_id', ventaId)
          .eq('producto_id', item.producto_id)
          .single()

        if (ventaItem) {
          montoDevuelto += ventaItem.precio_unitario * item.cantidad
        }
      }

      // Create return
      const { data: devolucion, error: devolucionError } = await supabase
        .from('devoluciones')
        .insert({
          venta_id: ventaId,
          usuario_id: user.id,
          tipo: 'parcial',
          monto_devuelto: montoDevuelto
        })
        .select()
        .single()

      if (devolucionError) {
        return { success: false, error: 'Error al crear devolución' }
      }

      // Create return items
      const devolucionItems = items.map(item => ({
        devolucion_id: devolucion.id,
        venta_item_id: item.producto_id, // This should be venta_item_id, not producto_id
        cantidad_devuelta: item.cantidad
      }))

      const { error: itemsError } = await supabase
        .from('devolucion_items')
        .insert(devolucionItems)

      if (itemsError) {
        return { success: false, error: 'Error al crear items de devolución' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error procesando devolución:', error)
      return { success: false, error: 'Error al procesar la devolución' }
    }
  }

  const value = {
    productos,
    categorias,
    promociones,
    carrito,
    cajaActual,
    aperturaActual,
    cajaAbierta,
    clientes,
    mediosPago,
    loadProductos,
    loadCategorias,
    loadPromociones,
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
    addMovimientoCaja,
    procesarVenta,
    crearCliente,
    procesarDevolucion,
    buscarVentaPorFolio
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}