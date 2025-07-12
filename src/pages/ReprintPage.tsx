import React, { useState, useEffect } from 'react'
import { Printer, Search, Calendar, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface ReprintPageProps {
  onClose: () => void
}

interface Document {
  id: string
  folio: string
  tipo: string
  total: number
  fecha_emision: string
}

export const ReprintPage: React.FC<ReprintPageProps> = ({ onClose }) => {
  const [searchFolio, setSearchFolio] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [copies, setCopies] = useState(1)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const { empresaId } = useAuth()
  const [printDialogVisible, setPrintDialogVisible] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [selectedDate])

  const loadDocuments = async () => {
    if (!empresaId) return

    try {
      const { data, error } = await supabase
        .from('ventas')
        .select('id, folio, tipo_dte, total, fecha')
        .eq('empresa_id', empresaId)
        .eq('fecha::date', selectedDate)
        .order('fecha', { ascending: false })

      if (error) throw error

      const docs: Document[] = (data || []).map(venta => ({
        id: venta.id,
        folio: venta.folio,
        tipo: venta.tipo_dte === 'boleta' ? 'Boleta manual (no válida al SII)' : venta.tipo_dte,
        total: venta.total,
        fecha_emision: venta.fecha
      }))

      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
    }
  }

  const handleSearch = () => {
    if (!searchFolio) return
    
    const found = documents.find(doc => 
      doc.folio.toLowerCase().includes(searchFolio.toLowerCase())
    )
    
    if (found) {
      setSelectedDoc(found)
    }
  }

  const handlePrint = () => {
    setShowPrintModal(true)
  }
  
  const generatePdf = async () => {
    // Simulación de generación de PDF
    return `https://example.com/pdf/${Date.now()}.pdf`;
  }

  const handleConfirmPrint = () => {
    setPrintDialogVisible(true);
    window.print();
    
    // Guardar URL del PDF en documentos_tributarios
    if (selectedDoc) {
      savePdfUrl(selectedDoc.id);
    }
    
    
    // Guardar URL del PDF en documentos_tributarios
    if (selectedDoc) {
      savePdfUrl(selectedDoc.id);
    }
    
    setShowPrintModal(false)
    toast.success('Documento enviado a impresión')
  }
  
  const savePdfUrl = async (documentId: string) => {
    try {
      const url = await generatePdf();
      
      const { error } = await supabase
        .from('documentos_tributarios')
        .update({ pdf_url: url })
        .eq('venta_id', documentId);
        
      if (error) throw error;
      
      // Recargar la lista después de guardar
      loadDocuments();
    } catch (error) {
      console.error('Error saving PDF URL:', error);
      toast.error('Error al guardar el documento');
    }
  }
  
  const generatePdf = async () => {
    // Simulación de generación de PDF
    return `https://example.com/pdf/${Date.now()}.pdf`;
  }
  
  const savePdfUrl = async (documentId: string) => {
    try {
      const url = await generatePdf();
      
      const { error } = await supabase
        .from('documentos_tributarios')
        .update({ pdf_url: url })
        .eq('venta_id', documentId);
        
      if (error) throw error;
      
      // Recargar la lista después de guardar
      loadDocuments();
    } catch (error) {
      console.error('Error saving PDF URL:', error);
      toast.error('Error al guardar el documento');
    }
  }

  const handleSendEmail = () => {
    setShowEmailModal(true);
  }

  const handleConfirmEmail = () => {
    if (selectedDoc) {
      sendEmail(selectedDoc.id);
    }
    if (selectedDoc) {
      sendEmail(selectedDoc.id);
    }
    setShowEmailModal(false);
  }
  
  const sendEmail = async (documentId: string) => {
    try {
      // Aquí iría la lógica real para enviar el email
      // Por ahora solo simulamos
      
      // Guardar también la URL del PDF
      await savePdfUrl(documentId);
      
      toast.success('Documento enviado por correo');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar el correo');
    }
  }
  
  const sendEmail = async (documentId: string) => {
    try {
      // Aquí iría la lógica real para enviar el email
      // Por ahora solo simulamos
      
      // Guardar también la URL del PDF
      await savePdfUrl(documentId);
      
      toast.success('Documento enviado por correo');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error al enviar el correo');
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  // Print dialog simulation
  if (printDialogVisible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This webpage is trying to print...</h3>
            <div className="flex gap-3">
              <button 
                onClick={() => setPrintDialogVisible(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setPrintDialogVisible(false)
                  toast.success('Impresión completada')
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showEmailModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Boleta generada</h3>
            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">Enviar por correo electrónico (Opcional)</p>
          
          <div className="flex mb-4">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleConfirmEmail}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
          
          <button
            onClick={handlePrint}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Imprimir
          </button>
        </div>
      </div>
    )
  }

  if (showPrintModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Boleta generada</h3>
            <p className="text-gray-600 mb-6">Enviar por correo electrónico (Opcional)</p>
            
            <div className="flex gap-3">
              <button 
                onClick={handleSendEmail}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Enviar
              </button>
              <button 
                onClick={handleConfirmPrint}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Printer className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Reimprimir</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">22:00</span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">EA</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Emilio Aguilera</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div className="w-1/2 bg-white p-6 flex items-center justify-center">
          <p className="text-gray-500 italic">Debe seleccionar el documento a reimprimir</p>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-gray-50 p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-800">Documentos disponibles</span>
            </div>
            <div className="text-xs text-blue-600 mb-2">Fecha movimiento: {selectedDate}</div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                />
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ingresa aquí el número de documento"
                  value={searchFolio}
                  onChange={(e) => setSearchFolio(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Document Found */}
          {selectedDoc && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h5 className="font-semibold text-gray-900">{selectedDoc.tipo} N°{selectedDoc.folio}</h5>
                  <p className="text-sm text-gray-600">{formatPrice(selectedDoc.total)}</p>
                </div>
                <button
                  onClick={handlePrint}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Printer className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{copies}</span>
                <button
                  onClick={() => setCopies(Math.min(10, copies + 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  +
                </button>
                <span className="text-sm text-gray-600 ml-2">Copias</span>
              </div>

              <button
                onClick={handlePrint}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Reimprimir
              </button>
            </div>
          )}

          {/* Available Documents List */}
          {documents.length > 0 && !selectedDoc && (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-white p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{doc.tipo} N°{doc.folio}</span>
                    <span className="text-sm">{formatPrice(doc.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}