import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { Logo } from '../common/Logo'
import { useAuth } from '../../contexts/AuthContext'

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión')
    }
    
    setLoading(false)
  }

  const handleLogin = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Logo size="lg" className="mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicio sesión</h2>
          <p className="text-gray-600">Ingresa tus credenciales para acceder al sistema POS</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Correo"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Ingresa tu correo electrónico"
              icon={Mail}
              iconPosition="left"
              required
              autoFocus
              onEnter={handleLogin}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder="Ingresa tu contraseña"
                icon={Lock}
                iconPosition="left"
                required
                onEnter={handleLogin}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                ¿Olvidaste tu contraseña?
              </label>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={!email || !password}
          >
            Ingresar
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Solvendo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}