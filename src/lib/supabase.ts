import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Usuario {
  id: string
  email: string
  nombre: string
  apellidos: string
  rut: string
  activo: boolean
  created_at: string
}

export interface Empresa {
  id: string
  rut: string
  razon_social: string
  direccion: string
  activo: boolean
}

export interface Sucursal {
  id: string
  empresa_id: string
  nombre: string
  direccion: string
  activo: boolean
}

export interface Producto {
  id: string
  codigo: string
  nombre: string
  descripcion: string
  precio: number
  activo: boolean
}

export interface Venta {
  id: string
  empresa_id: string
  sucursal_id: string
  caja_id?: string
  cliente_id?: string
  usuario_id: string
  folio: string
  tipo_dte: string
  metodo_pago: string
  total: number
  fecha: string
}

export interface VentaItem {
  id: string
  venta_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  descuento: number
}

export interface Caja {
  id: string
  empresa_id: string
  sucursal_id: string
  nombre: string
  activo: boolean
}

export interface Cliente {
  id: string
  razon_social: string
  rut: string
  direccion?: string
  comuna?: string
  ciudad?: string
  giro?: string
  telefono?: string
  email?: string
  contacto?: string
  activo: boolean
}

export interface MedioPago {
  id: string
  empresa_id: string
  nombre: string
  descripcion?: string
}