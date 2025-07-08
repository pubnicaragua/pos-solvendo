import React, { useState } from 'react'
import { User, Search, Plus, X } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { usePOS } from '../../contexts/POSContext'
import { Cliente } from '../../lib/supabase'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onClientSelect: (cliente: Cliente | null) => void
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onClientSelect
}) => {
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [clientType, setClientType] = useState<'empresa' | 'persona'>('empresa')
  const [newClient, setNewClient] = useState({
    razon_social: '',
    rut: '',
    direccion: '',
    comuna: '',
    ciudad: '',
    giro: '',
    telefono: '',
    email: '',
    contacto: ''
  })
  const [loading, setLoading] = useState(false)
  const { clientes, crearCliente } = usePOS()

  if (!isOpen) return null

  const handleCreateClient = async () => {
    if (!newClient.razon_social || !newClient.rut) return

    setLoading(true)
    const result = await crearCliente(newClient)
    
    if (result.success && result.cliente) {
      onClientSelect(result.cliente)
      onClose()
    }
    
    setLoading(false)
  }

  const handleClientSelect = (cliente: Cliente) => {
    onClientSelect(cliente)
    onClose()
  }

  if (showNewClientForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Registrar nuevo cliente</h3>
            </div>
            <button
              onClick={() => setShowNewClientForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            {/* Client Type Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tipo de Cliente</h4>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="clientType"
                    value="empresa"
                    checked={clientType === 'empresa'}
                    onChange={(e) => setClientType(e.target.value as 'empresa')}
                    className="text-blue-600"
                  />
                  <span>Empresas</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="clientType"
                    value="persona"
                    checked={clientType === 'persona'}
                    onChange={(e) => setClientType(e.target.value as 'persona')}
                    className="text-blue-600"
                  />
                  <span>Persona</span>
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente Extranjero</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
                <input
                  type="text"
                  value={newClient.rut}
                  onChange={(e) => setNewClient(prev => ({ ...prev, rut: e.target.value }))}
                  placeholder="No"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                <input
                  type="text"
                  value={newClient.razon_social}
                  onChange={(e) => setNewClient(prev => ({ ...prev, razon_social: e.target.value }))}
                  placeholder="Giro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giro</label>
                <input
                  type="text"
                  value={newClient.giro}
                  onChange={(e) => setNewClient(prev => ({ ...prev, giro: e.target.value }))}
                  placeholder="Giro"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
                <input
                  type="text"
                  value={newClient.contacto}
                  onChange={(e) => setNewClient(prev => ({ ...prev, contacto: e.target.value }))}
                  placeholder="Nombres"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  placeholder="Apellidos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Más atributos</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Seleccionar</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={newClient.direccion}
                  onChange={(e) => setNewClient(prev => ({ ...prev, direccion: e.target.value }))}
                  placeholder="Dirección"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                <input
                  type="text"
                  value={newClient.comuna}
                  onChange={(e) => setNewClient(prev => ({ ...prev, comuna: e.target.value }))}
                  placeholder="Comuna"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={newClient.ciudad}
                  onChange={(e) => setNewClient(prev => ({ ...prev, ciudad: e.target.value }))}
                  placeholder="Ciudad"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowNewClientForm(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleCreateClient}
                loading={loading}
                disabled={!newClient.razon_social || !newClient.rut}
              >
                Guardar cliente
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Clientes</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <Input
              placeholder="Cliente"
              icon={Search}
              iconPosition="left"
            />
          </div>

          <Button
            fullWidth
            variant="primary"
            onClick={() => setShowNewClientForm(true)}
          >
            Registrar nuevo cliente
          </Button>
        </div>
      </div>
    </div>
  )
}