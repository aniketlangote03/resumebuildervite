import React, { useState, useEffect } from 'react'
import Landing from './components/Landing'
import TemplateGallery from './components/TemplateGallery'
import DataInputChoice from './components/DataInputChoice'
import Builder from './components/Builder'
import './App.css'
import { getOrCreateUserId } from './utils/userId'
import { fetchResume } from './api'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedTemplate, setSelectedTemplate] = useState('Minimalist')
  const [resumeData, setResumeData] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const init = async () => {
      const id = getOrCreateUserId()
      setUserId(id)
      try {
        const res = await fetchResume(id)
        if (res?.data) {
          setResumeData(res.data)
          setCurrentPage('builder')
          return
        }
      } catch (_) {
      }
      const saved = localStorage.getItem('currentResumeData')
      if (saved && currentPage === 'landing') {
        const parsed = JSON.parse(saved)
        setResumeData(parsed)
        setCurrentPage('builder')
      }
    }
    init()
  }, [])

  const handleStartBuilding = () => {
    setCurrentPage('templates')
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    setCurrentPage('inputChoice')
  }

  const handleInputChoice = (data) => {
    setResumeData(data)
    setCurrentPage('builder')
  }

  return (
    <div className="App min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <Landing onStartClick={handleStartBuilding} />
      )}
      {currentPage === 'templates' && (
        <TemplateGallery onSelectTemplate={handleTemplateSelect} />
      )}
      {currentPage === 'inputChoice' && (
        <DataInputChoice 
          template={selectedTemplate}
          onDataReady={handleInputChoice}
        />
      )}
      {currentPage === 'builder' && (
        <Builder 
          initialData={resumeData}
          selectedTemplate={selectedTemplate}
          onBack={() => setCurrentPage('templates')}
          userId={userId}
        />
      )}
    </div>
  )
}

export default App
