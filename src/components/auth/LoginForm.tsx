import React, { useState } from 'react'
import { Eye, EyeOff, User } from 'lucide-react'
import { Logo } from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'

export const LoginForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'login' | 'user_validation' | 'supervisor_auth'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userRut, setUserRut] = useState('78.168.951-3')
  const [userPassword, setUserPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [supervisorPassword, setSupervisorPassword] = useState('')
  const { login, validateUser } = useAuth()

  const handleMainLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    // For demo, redirect to user validation
    setCurrentStep('user_validation')
    setLoading(false)
  }

  const handleUserValidation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userRut || !userPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(userRut, userPassword)
    
    if (!result.success) {
      setError(result.error || 'Credenciales inválidas')
    }
    
    setLoading(false)
  }

  const handleSupervisorAuth = () => {
    // Simulate supervisor authorization
    console.log('Supervisor authorization:', supervisorPassword)
    setCurrentStep('user_validation')
    setSupervisorPassword('')
  }

  // Main login screen (Inicio sesión)
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Inicio sesión</h2>

            <form onSubmit={handleMainLogin} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-gray-600">¿Olvidaste tu contraseña?</span>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!email || !password || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentStep('supervisor_auth')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Autorización de Supervisor
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User validation screen (RUT and password before cash opening)
  if (currentStep === 'user_validation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Usuario</h2> {/* Changed from "Usuario\" to "Usuario" */}
            </div>

            <form onSubmit={handleUserValidation} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID / RUT</label>
                <input
                  type="text"
                  value={userRut}
                  onChange={(e) => setUserRut(e.target.value)}
                  placeholder="78.168.951-3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                disabled={!userRut || !userPassword || loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Supervisor authorization screen
  if (currentStep === 'supervisor_auth') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Autorización</h2>
            <p className="text-gray-600 text-center mb-8">ID / RUT Supervisor</p>

            <form onSubmit={(e) => { e.preventDefault(); handleSupervisorAuth(); }} className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña del Supervisor</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={supervisorPassword}
                  onChange={(e) => setSupervisorPassword(e.target.value)}
                  placeholder="Contraseña del Supervisor"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={!supervisorPassword}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Ingresar
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}