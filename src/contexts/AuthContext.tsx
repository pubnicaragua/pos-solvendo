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
      
      // For demo purposes, allow login with demo credentials
      if (email === 'cajero@demo.cl' && password === 'demo123') {
        // Create demo user
        const demoUser = {
          id: 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          email: 'cajero@demo.cl',
          nombre: 'Emilio',
          apellidos: 'Aguilera',
          rut: '12.345.678-9',
          activo: true,
          created_at: new Date().toISOString()
        }
        
        setUser(demoUser)
        setEmpresaId('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
        setSucursalId('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
        
        return { success: true }
      } else {
        return { success: false, error: 'Credenciales inválidas. Use: cajero@demo.cl / demo123' }
      }
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