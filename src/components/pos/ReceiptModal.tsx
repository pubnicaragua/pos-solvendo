import React from 'react'
import { Printer, Mail, X, Download } from 'lucide-react'
import { Button } from '../common/Button'
import { Venta } from '../../lib/supabase'

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  venta: Venta | null
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  venta
}) => {
  if (!isOpen || !venta) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    // Implement email functionality
    console.log('Sending email...')
  }

  const handleDownload = () => {
    // Implement PDF download
    console.log('Downloading PDF...')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Boleta generada</h3>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            onClick={onClose}
          />
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Venta procesada exitosamente!
            </h4>
            <p className="text-gray-600">
              Folio: {venta.folio}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(venta.total)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Método de pago:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {venta.metodo_pago}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tipo de documento:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {venta.tipo_dte}
              </span>
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
      </div>
    </div>
  )
}