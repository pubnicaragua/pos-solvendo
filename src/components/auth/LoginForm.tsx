import React, { useState } from 'react'
import { Eye, EyeOff, User, Shield } from 'lucide-react'
import { Logo } from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'

export const LoginForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'login' | 'user_validation' | 'supervisor_auth'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userRut, setUserRut] = useState('78.168.951-3')
  const [userPassword, setUserPassword] = useState('123456')
  const [supervisorRut, setSupervisorRut] = useState('12.345.678-9')
  const [supervisorPassword, setSupervisorPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const { login, validateUser } = useAuth()

  // Pantalla 1: Login principal (Inicio sesión)
  const handleMainLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    if (!captchaVerified) {
      setError('Por favor verifica el captcha')
      return
    }

    setLoading(true)
    setError('')

    // Simular validación de email/password
    if (email === 'admin@solvendo.cl' && password === '123456') {
      setCurrentStep('user_validation')
    } else {
      setError('Credenciales inválidas')
    }
    
    setLoading(false)
  }

  // Pantalla 2: Validación de usuario (RUT + contraseña)
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

  // Pantalla 3: Autorización supervisor
  const handleSupervisorAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supervisorRut || !supervisorPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    // Validar supervisor
    const result = await validateUser(supervisorRut, supervisorPassword)
    
    if (result.success) {
      // Autorización exitosa, volver a validación de usuario
      setCurrentStep('user_validation')
      setError('')
    } else {
      setError('Supervisor no autorizado')
    }
    
    setLoading(false)
  }

  // Pantalla 1: Inicio sesión
  if (currentStep === 'login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Inicio sesión</h2>

            <form onSubmit={handleMainLogin} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  autoFocus
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                ¿Olvidaste tu contraseña?
              </div>

              {/* Captcha simulado */}
              <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-gray-50">
                <input
                  type="checkbox"
                  checked={captchaVerified}
                  onChange={(e) => setCaptchaVerified(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No soy un robot</span>
                <div className="ml-auto">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-xs text-blue-600 font-bold">reCAPTCHA</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={!email || !password || !captchaVerified || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-12"
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

  // Pantalla 2: Usuario (RUT + contraseña)
  if (currentStep === 'user_validation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Logo size="lg" className="mx-auto mb-6" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Usuario</h2>
            </div>

            <form onSubmit={handleUserValidation} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID / RUT</label>
                <input
                  type="text"
                  value={userRut}
                  onChange={(e) => setUserRut(e.target.value)}
                  placeholder="78.168.951-3"
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
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
                disabled={!userRut || !userPassword || loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-12"
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla 3: Autorización supervisor
  if (currentStep === 'supervisor_auth') {
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

            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentStep('login')}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}