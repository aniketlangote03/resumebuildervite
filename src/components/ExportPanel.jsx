import React, { useState } from 'react'
import { exportPDF, exportDOCX, exportTXT } from '../utils/exportFunctions'

export default function ExportPanel({ data, template, colors, font, onClose }) {
  const [exporting, setExporting] = useState(false)
  const [status, setStatus] = useState('')

  const handleExport = async (format) => {
    setExporting(true)
    setStatus(`Exporting ${format.toUpperCase()}...`)
    try {
      if (format === 'pdf') {
        await exportPDF()
      } else if (format === 'docx') {
        await exportDOCX(data, template, colors, font)
      } else if (format === 'txt') {
        await exportTXT(data)
      }
      setStatus(`✅ ${format.toUpperCase()} exported!`)
      setTimeout(() => setStatus(''), 2000)
    } catch (error) {
      console.error('Export error:', error)
      setStatus(`❌ Export failed: ${error.message || 'Unknown error'}`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">Export Resume</h2>
        <p className="text-sm text-gray-500 mb-6">Choose your preferred format</p>

        <div className="space-y-3">
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={exporting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            📝 Export as DOCX
          </button>
          <button
            onClick={() => handleExport('txt')}
            disabled={exporting}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            📋 Export as TXT
          </button>
        </div>

        {status && (
          <p className="text-sm text-center mt-4 font-medium">{status}</p>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}
