import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, Usuario } from '../lib/supabase'

interface AuthContextType {
  user: Usuario | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  empresaId: string | null
  sucursalId: string | null
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

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const { data: usuario, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (usuario && !error) {
          setUser(usuario)
          
          // Get empresa and sucursal from usuario_empresa
          const { data: usuarioEmpresa } = await supabase
            .from('usuario_empresa')
            .select('empresa_id, sucursal_id')
            .eq('usuario_id', usuario.id)
            .eq('activo', true)
            .single()

          if (usuarioEmpresa) {
            setEmpresaId(usuarioEmpresa.empresa_id)
            setSucursalId(usuarioEmpresa.sucursal_id)
          }
        }
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)
      
      // First check if user exists in usuarios table
      const { data: usuario, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('activo', true)
        .single()

      if (userError || !usuario) {
        return { success: false, error: 'Usuario no encontrado o inactivo' }
      }

      // Then try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: 'Credenciales inválidas' }
      }

      if (data.user) {
        setUser(usuario)
        
        // Get empresa and sucursal
        const { data: usuarioEmpresa } = await supabase
          .from('usuario_empresa')
          .select('empresa_id, sucursal_id')
          .eq('usuario_id', usuario.id)
          .eq('activo', true)
          .single()

        if (usuarioEmpresa) {
          setEmpresaId(usuarioEmpresa.empresa_id)
          setSucursalId(usuarioEmpresa.sucursal_id)
        }

        return { success: true }
      }

      return { success: false, error: 'Error al iniciar sesión' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error inesperado' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setEmpresaId(null)
    setSucursalId(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    empresaId,
    sucursalId
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}