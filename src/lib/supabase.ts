import { createClient } from '@supabase/supabase-js'

// Fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables, using fallback values')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Usuario {
  id: string
  email: string
  password_hash?: string
  nombre: string
  apellidos: string
  rut: string
  telefono?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Empresa {
  id: string
  rut: string
  razon_social: string
  giro?: string
  direccion: string
  comuna?: string
  ciudad?: string
  region?: string
  telefono?: string
  email?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Sucursal {
  id: string
  empresa_id: string
  nombre: string
  direccion: string
  comuna?: string
  ciudad?: string
  telefono?: string
  email?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface UsuarioEmpresa {
  id: string
  usuario_id: string
  empresa_id: string
  sucursal_id: string
  rol: 'admin' | 'supervisor' | 'cajero'
  activo: boolean
  created_at: string
}

export interface Categoria {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface Producto {
  id: string
  empresa_id: string
  categoria_id?: string
  codigo: string
  nombre: string
  descripcion?: string
  precio: number
  costo?: number
  stock?: number
  stock_minimo?: number
  destacado: boolean
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  empresa_id: string
  razon_social: string
  rut?: string
  direccion?: string
  comuna?: string
  ciudad?: string
  region?: string
  giro?: string
  telefono?: string
  email?: string
  contacto?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface MedioPago {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface Caja {
  id: string
  empresa_id: string
  sucursal_id: string
  nombre: string
  descripcion?: string
  activo: boolean
  created_at: string
}

export interface AperturaCaja {
  id: string
  caja_id: string
  usuario_id: string
  fecha_apertura: string
  fecha_cierre?: string
  monto_inicial: number
  monto_final?: number
  diferencia?: number
  estado: 'abierta' | 'cerrada'
  observaciones?: string
  created_at: string
}

export interface MovimientoCaja {
  id: string
  apertura_caja_id: string
  usuario_id: string
  tipo: 'ingreso' | 'retiro' | 'venta'
  monto: number
  observacion?: string
  fecha: string
  created_at: string
}

export interface Promocion {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
  tipo: 'descuento_porcentaje' | 'descuento_monto' | '2x1' | '3x2'
  valor?: number
  fecha_inicio?: string
  fecha_fin?: string
  activo: boolean
  created_at: string
}

export interface Venta {
  id: string
  empresa_id: string
  sucursal_id: string
  caja_id?: string
  apertura_caja_id?: string
  cliente_id?: string
  usuario_id: string
  folio: string
  tipo_dte: 'boleta' | 'factura' | 'nota_credito'
  metodo_pago_id: string
  subtotal: number
  descuento: number
  impuestos: number
  total: number
  estado: 'pendiente' | 'completada' | 'anulada'
  fecha: string
  created_at: string
}

export interface VentaItem {
  id: string
  venta_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  descuento: number
  subtotal: number
  created_at: string
}

export interface Devolucion {
  id: string
  venta_id: string
  usuario_id: string
  tipo: 'total' | 'parcial'
  motivo?: string
  monto_devuelto: number
  fecha: string
  created_at: string
}

export interface DevolucionItem {
  id: string
  devolucion_id: string
  venta_item_id: string
  cantidad_devuelta: number
  created_at: string
}

export interface DocumentoTributario {
  id: string
  venta_id: string
  tipo: string
  folio: string
  fecha_emision: string
  estado_sii: string
  xml_content?: string
  pdf_url?: string
  created_at: string
}