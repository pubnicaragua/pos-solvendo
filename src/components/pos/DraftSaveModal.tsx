import React, { useState } from 'react'
import { X, Save } from 'lucide-react'
import { usePOS } from '../../contexts/POSContext'
import toast from 'react-hot-toast'

interface DraftSaveModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DraftSaveModal: React.FC<DraftSaveModalProps> = ({
  isOpen,
  onClose
}) => {
  const [draftName, setDraftName] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveDraft, carrito } = usePOS()

  if (!isOpen) return null

  const handleSaveDraft = async () => {
    if (!draftName.trim()) {
      toast.error('Ingrese un nombre para el borrador')
      return
    }

    if (carrito.length === 0) {
      toast.error('No hay productos en el carrito')
      return
    }

    setLoading(true)
    const success = await saveDraft(draftName)
    setLoading(false)

    if (success) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Guardar borrador</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del borrador</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Ingrese un nombre para identificar este borrador"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={!draftName.trim() || loading || carrito.length === 0}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}