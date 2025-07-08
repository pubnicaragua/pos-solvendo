import React, { useState } from 'react'
import { Printer, Search, X, Download, Mail } from 'lucide-react'
import { Button } from '../common/Button'
import { Input } from '../common/Input'

interface ReprintModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ReprintModal: React.FC<ReprintModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const mockDocuments = [
    {
      id: '1',
      folio: 'V1234567890',
      fecha: '14/05/2025',
      tipo: 'Boleta manual',
      total: 34500
    }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handlePrint = () => {
    console.log('Printing document...')
  }

  const handleEmail = () => {
    console.log('Sending email...')
  }

  const handleDownload = () => {
    console.log('Downloading PDF...')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Reimprimir</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Printer className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Debe seleccionar el documento a reimprimir
            </h4>
            <p className="text-gray-600">
              Busca el documento por número de folio
            </p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Ingresa aquí el número de documento..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
              iconPosition="left"
            />
          </div>

          {/* Mock Document Found */}
          {searchTerm && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">Boleta manual</h5>
                  <p className="text-sm text-gray-600">Folio: V1234567890</p>
                  <p className="text-sm text-gray-600">Fecha: 14/05/2025</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(34500)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Printer}
                  onClick={handlePrint}
                  fullWidth
                >
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Mail}
                  onClick={handleEmail}
                  fullWidth
                >
                  Enviar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Download}
                  onClick={handleDownload}
                  fullWidth
                >
                  Descargar
                </Button>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Copias: 1
            </p>
            <Button className="mt-4" disabled={!searchTerm}>
              Reimprimir
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}