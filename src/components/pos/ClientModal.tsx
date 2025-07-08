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
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewClientForm, setShowNewClientForm] = useState(false)
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

  const filteredClientes = clientes.filter(cliente =>
    cliente.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.rut.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Seleccionar cliente</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        {!showNewClientForm ? (
          <>
            {/* Search and Actions */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nombre o RUT..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    icon={Search}
                    iconPosition="left"
                  />
                </div>
                <Button
                  variant="outline"
                  icon={Plus}
                  onClick={() => setShowNewClientForm(true)}
                >
                  Nuevo cliente
                </Button>
              </div>
            </div>

            {/* Client List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {/* Anonymous Client Option */}
                <button
                  onClick={() => handleClientSelect(null as any)}
                  className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Cliente anónimo</h4>
                      <p className="text-sm text-gray-600">Sin datos de cliente</p>
                    </div>
                  </div>
                </button>

                {filteredClientes.map((cliente) => (
                  <button
                    key={cliente.id}
                    onClick={() => handleClientSelect(cliente)}
                    className="w-full p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{cliente.razon_social}</h4>
                        <p className="text-sm text-gray-600">RUT: {cliente.rut}</p>
                        {cliente.email && (
                          <p className="text-sm text-gray-500">{cliente.email}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                {filteredClientes.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron clientes</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* New Client Form */
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-gray-900">Registrar nuevo cliente</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewClientForm(false)}
              >
                Volver
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="Razón social"
                value={newClient.razon_social}
                onChange={(value) => setNewClient(prev => ({ ...prev, razon_social: value }))}
                placeholder="Nombre de la empresa"
                required
              />
              <Input
                label="RUT"
                value={newClient.rut}
                onChange={(value) => setNewClient(prev => ({ ...prev, rut: value }))}
                placeholder="12.345.678-9"
                required
              />
              <Input
                label="Giro"
                value={newClient.giro}
                onChange={(value) => setNewClient(prev => ({ ...prev, giro: value }))}
                placeholder="Actividad comercial"
              />
              <Input
                label="Teléfono"
                value={newClient.telefono}
                onChange={(value) => setNewClient(prev => ({ ...prev, telefono: value }))}
                placeholder="+56 9 1234 5678"
              />
              <Input
                label="Email"
                type="email"
                value={newClient.email}
                onChange={(value) => setNewClient(prev => ({ ...prev, email: value }))}
                placeholder="contacto@empresa.cl"
              />
              <Input
                label="Contacto"
                value={newClient.contacto}
                onChange={(value) => setNewClient(prev => ({ ...prev, contacto: value }))}
                placeholder="Nombre del contacto"
              />
              <Input
                label="Dirección"
                value={newClient.direccion}
                onChange={(value) => setNewClient(prev => ({ ...prev, direccion: value }))}
                placeholder="Dirección completa"
              />
              <Input
                label="Comuna"
                value={newClient.comuna}
                onChange={(value) => setNewClient(prev => ({ ...prev, comuna: value }))}
                placeholder="Comuna"
              />
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
        )}
      </div>
    </div>
  )
}