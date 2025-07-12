import React, { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Logo } from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'

export const LoginForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'supervisor'>('supervisor')
  const [supervisorRut, setSupervisorRut] = useState('')
  const [supervisorPassword, setSupervisorPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { validateUser, login } = useAuth()

  const handleSupervisorAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supervisorRut || !supervisorPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validar supervisor
      const result = await validateUser(supervisorRut, supervisorPassword)
      
      if (result.success && result.user) {
        // Si es supervisor válido, proceder con login
        const loginResult = await login(supervisorRut, supervisorPassword)
        if (!loginResult.success) {
          setError(loginResult.error || 'Error en el login')
        }
      } else {
        setError('Supervisor no autorizado')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-6" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Autorización</h2>
            <p className="text-gray-600">ID / RUT Supervisor</p>
          </div>

          <form onSubmit={handleSupervisorAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID / RUT Supervisor</label>
              <input
                type="text"
                value={supervisorRut}
                onChange={(e) => setSupervisorRut(e.target.value)}
                placeholder="12.345.678-9"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                autoFocus
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña del Supervisor</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={supervisorPassword}
                onChange={(e) => setSupervisorPassword(e.target.value)}
                placeholder="Contraseña del Supervisor"
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform translate-y-1 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!supervisorRut || !supervisorPassword || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-12"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}</parameter>