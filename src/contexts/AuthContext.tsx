import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Usuario, UsuarioEmpresa } from '../lib/supabase'

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (rut: string, password: string) => Promise<{ success: boolean; error?: string }>
  validateUser: (rut: string, password: string) => Promise<{ success: boolean; user?: Usuario; error?: string }>
  logout: () => Promise<void>
  empresaId: string | null
  sucursalId: string | null
  userRole: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [sucursalId, setSucursalId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('pos_user')
    const savedEmpresa = localStorage.getItem('pos_empresa')
    const savedSucursal = localStorage.getItem('pos_sucursal')
    const savedRole = localStorage.getItem('pos_role')
    
    if (savedUser && savedEmpresa && savedSucursal) {
      setUser(JSON.parse(savedUser))
      setEmpresaId(savedEmpresa)
      setSucursalId(savedSucursal)
      setUserRole(savedRole)
    }
    
    setLoading(false)
  }, [])

  const validateUser = async (rut: string, password: string): Promise<{ success: boolean; user?: Usuario; error?: string }> => {
    try {
      console.log('Validating user with RUT:', rut)
      
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('rut', rut)
        .eq('activo', true)
        .single()

      console.log('User query result:', { usuario, error })

      if (error || !usuario) {
        console.error('User not found or error:', error)
        return { success: false, error: 'Usuario no encontrado o inactivo' }
      }

      // Simple password validation for demo
      if (password !== '123456') {
        return { success: false, error: 'Contraseña incorrecta' }
      }

      return { success: true, user: usuario }
    } catch (error) {
      console.error('Error validating user:', error)
      return { success: false, error: 'Error de validación' }
    }
  }

  const login = async (rut: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      console.log('Starting login process for RUT:', rut)
      
      // Validate user
      const userResult = await validateUser(rut, password)
      if (!userResult.success || !userResult.user) {
        console.error('User validation failed:', userResult.error)
        return { success: false, error: userResult.error }
      }

      console.log('User validated successfully:', userResult.user)

      // Get empresa and sucursal from usuario_empresa
      const { data: usuarioEmpresa, error: empresaError } = await supabase
        .from('usuario_empresa')
        .select('empresa_id, sucursal_id, rol')
        .eq('usuario_id', userResult.user.id)
        .eq('activo', true)
        .single()

      console.log('Usuario empresa query result:', { usuarioEmpresa, empresaError })

      if (empresaError || !usuarioEmpresa) {
        console.error('Usuario empresa error:', empresaError)
        return { success: false, error: 'Usuario no asignado a empresa/sucursal activa' }
      }

      // Set user data
      setUser(userResult.user)
      setEmpresaId(usuarioEmpresa.empresa_id)
      setSucursalId(usuarioEmpresa.sucursal_id)
      setUserRole(usuarioEmpresa.rol)

      // Save to localStorage for persistence
      localStorage.setItem('pos_user', JSON.stringify(userResult.user))
      localStorage.setItem('pos_empresa', usuarioEmpresa.empresa_id)
      localStorage.setItem('pos_sucursal', usuarioEmpresa.sucursal_id)
      localStorage.setItem('pos_role', usuarioEmpresa.rol)

      console.log('Login successful, user data saved')

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error inesperado' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setUser(null)
    setEmpresaId(null)
    setSucursalId(null)
    setUserRole(null)
    
    // Clear localStorage
    localStorage.removeItem('pos_user')
    localStorage.removeItem('pos_empresa')
    localStorage.removeItem('pos_sucursal')
    localStorage.removeItem('pos_role')
  }

  const value = {
    user,
    loading,
    login,
    validateUser,
    logout,
    empresaId,
    sucursalId,
    userRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}