import React, { useState, useEffect } from 'react'
import { BarChart3, Filter, X, Download, RefreshCw, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface ReportsPageProps {
  onClose: () => void
}

interface ReportData {
  ventasTotales: number
  margen: number
  unidadesVendidas: number
  numeroVentas: number
  ticketPromedio: number
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ onClose }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showLastUpdateModal, setShowLastUpdateModal] = useState(false)
  const [reportData, setReportData] = useState<ReportData>({
    ventasTotales: 67750,
    margen: 67750,
    unidadesVendidas: 67750,
    numeroVentas: 67750,
    ticketPromedio: 67750
  })
  const [filters, setFilters] = useState({
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    caja1: true,
    caja2: true,
    caja3: true,
    caja4: true
  })
  const { empresaId } = useAuth()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  const loadReportData = async () => {
    if (!empresaId) return

    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: ventas, error } = await supabase
        .from('ventas')
        .select('total, fecha')
        .eq('empresa_id', empresaId)
        .eq('fecha::date', today)

      if (error) throw error

      const totalVentas = ventas?.reduce((sum, venta) => sum + venta.total, 0) || 0
      const numeroVentas = ventas?.length || 0
      const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0

      setReportData({
        ventasTotales: totalVentas,
        margen: totalVentas * 0.3, // 30% margin
        unidadesVendidas: numeroVentas * 2, // Estimate
        numeroVentas,
        ticketPromedio
      })
    } catch (error) {
      console.error('Error loading report data:', error)
    }
  }

  useEffect(() => {
    loadReportData()
  }, [empresaId])

  const handleUpdate = () => {
    setShowUpdateModal(true)
  }
  
  const handleDownload = () => {
    setShowLastUpdateModal(true)
  }

  const handleConfirmUpdate = () => {
    loadReportData()
    setShowUpdateModal(false)
    toast.success('Datos actualizados correctamente')
  }

  const handleConfirmDownload = () => {
    // Simulate download
    console.log('Downloading report...')
    setShowLastUpdateModal(false)
    toast.success('Reporte descargado correctamente')
  }

  if (showUpdateModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Última actualización</h3>
            <p className="text-gray-600 mb-2">Fecha: 20/05/2025</p>
            <p className="text-gray-600 mb-6">Hora: 21:19:50</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmUpdate}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Realizar nueva actualización
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showLastUpdateModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Última actualización</h3>
            <p className="text-gray-600 mb-2">Fecha: 20/05/2025</p>
            <p className="text-gray-600 mb-6">Hora: 21:19:50</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLastUpdateModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDownload}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Realizar nueva actualización
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Reportes</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            <button
              onClick={loadReportData}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-green-800">Ventas totales</h4>
              <span className="text-xs text-green-600">+10%</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{formatPrice(reportData.ventasTotales)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-blue-800">Margen</h4>
              <span className="text-xs text-blue-600">+10%</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{formatPrice(reportData.margen)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-purple-800">Unidades vendidas</h4>
              <span className="text-xs text-purple-600">+10%</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{reportData.unidadesVendidas.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-orange-800">N° de ventas</h4>
              <span className="text-xs text-orange-600">+10%</span>
            </div>
            <p className="text-2xl font-bold text-orange-900">{reportData.numeroVentas.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-red-800">Ticket promedio</h4>
              <span className="text-xs text-red-600">+10%</span>
            </div>
            <p className="text-2xl font-bold text-red-900">{formatPrice(reportData.ticketPromedio)}</p>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-white rounded-lg p-6 mb-6" style={{ height: '300px' }}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Ventas totales</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Período anterior: 01/05/2025 - 14/05/2025</span>
              <span>Período seleccionado: 15/05/2025 - 28/05/2025</span>
            </div>
          </div>
          
          {/* Mock Chart */}
          <div className="h-full flex items-end justify-between px-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className="bg-blue-500 w-8 rounded-t"
                  style={{ height: `${Math.random() * 200 + 50}px` }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(2025, 4, i + 15).toLocaleDateString('es-CL', { day: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span>Ver período anterior</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Realizar nueva actualización
          </button>
        </div>
      </div>

      {/* Filters Sidebar */}
      {showFilters && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white border-l border-gray-200 p-6 shadow-lg z-10 animate-slide-in-right">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Filtros</h4>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Reestablecer filtros</h5>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3">Cajeros</h5>
              <div className="space-y-2">
                {Object.entries(filters).map(([key, value]) => (
                  key.startsWith('caja') && (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">{key}</span>
                    </label>
                  )
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                setShowFilters(false);
                toast.success('Filtros aplicados');
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Realizar filtro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}