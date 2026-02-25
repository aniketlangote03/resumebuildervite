import React, { useState, useEffect } from 'react'
import Preview from './Preview'
import SaveLoadPanel from './SaveLoadPanel'
import ColorPicker from './ColorPicker'
import FontSelector from './FontSelector'
import ExportPanel from './ExportPanel'
import ATSChecker from './ATSChecker'
import AnalyticsDashboard from './AnalyticsDashboard'
import CoverLetterBuilder from './CoverLetterBuilder'
import { save as lsSave, load as lsLoad } from '../utils/localStorage'
import { saveResume, fetchResume } from '../api'

const INPUT = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
const CARD = "border border-gray-200 p-4 rounded-lg bg-gray-50"
const ADD_BTN = "w-full px-4 py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 transition"
const DEL_BTN = "text-red-500 hover:text-red-700 text-sm font-semibold transition"
const TAG = "flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg"

const TABS = [
  { key: 'personal', label: '👤 Personal' },
  { key: 'summary', label: '📝 Summary' },
  { key: 'experience', label: '💼 Experience' },
  { key: 'education', label: '🎓 Education' },
  { key: 'projects', label: '🚀 Projects' },
  { key: 'skills', label: '⚡ Skills' },
  { key: 'certifications', label: '📜 Certifications' },
  { key: 'achievements', label: '🏆 Achievements' },
  { key: 'languages', label: '🌐 Languages' },
  { key: 'interests', label: '❤️ Interests' },
  { key: 'references', label: '📋 References' },
  { key: 'custom', label: '✏️ Custom' },
]

export default function Builder({ initialData, selectedTemplate, onBack, userId }) {
  const [resumeData, setResumeData] = useState(initialData || getDefaultResumeData())
  const [colors, setColors] = useState({
    accent: '#2563eb',
    background: '#ffffff',
    text: '#111827'
  })
  const [font, setFont] = useState('Inter')
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved')
  const [showExport, setShowExport] = useState(false)
  const [showSaveLoad, setShowSaveLoad] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCover, setShowCover] = useState(false)
  const [activeTab, setActiveTab] = useState(
    (() => {
      try {
        const t = localStorage.getItem('activeTab')
        return t || 'personal'
      } catch {
        return 'personal'
      }
    })()
  )
  const [recentSaves, setRecentSaves] = useState([])

  // --- Auto-save ---
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('currentResumeData', JSON.stringify(resumeData))
      localStorage.setItem('resumeColors', JSON.stringify(colors))
      localStorage.setItem('resumeFont', font)
      const persist = async () => {
        try {
          if (userId) {
            await saveResume(userId, resumeData)
          }
          setAutoSaveStatus('saved')
        } catch (_) {
          setAutoSaveStatus('saved')
        }
      }
      persist()
    }, 3000)
    return () => clearTimeout(timer)
  }, [resumeData, colors, font, userId])

  useEffect(() => {
    const idx = lsLoad('saved_index', []) || []
    setRecentSaves(idx.slice(0, 3))
  }, [showSaveLoad])

  useEffect(() => {
    try { localStorage.setItem('activeTab', activeTab) } catch { }
  }, [activeTab])

  useEffect(() => {
    try { localStorage.setItem('currentPage', 'builder') } catch { }
  }, [])

  useEffect(() => {
    const handler = () => {
      try {
        localStorage.setItem('currentResumeData', JSON.stringify(resumeData))
        localStorage.setItem('resumeColors', JSON.stringify(colors))
        localStorage.setItem('resumeFont', font)
        try { localStorage.setItem('currentPage', 'builder') } catch { }
        if (userId && typeof fetch === 'function') {
          const body = JSON.stringify({ data: resumeData })
          const url = `${(typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api'}/resume/${encodeURIComponent(userId)}`
          fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
        }
      } catch { }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [resumeData, colors, font, userId])

  // --- Default data ---
  function getDefaultResumeData() {
    return {
      personalInfo: {
        fullName: '', jobTitle: '', email: '', phone: '',
        location: '', linkedin: '', website: '', github: '', photoUrl: ''
      },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: [],
      references: [],
      customFields: []
    }
  }

  // --- Generic helpers ---
  const markSaving = () => setAutoSaveStatus('saving')

  const updateField = (path, value) => {
    markSaving()
    setResumeData(prev => {
      const keys = path.split('.')
      const copy = JSON.parse(JSON.stringify(prev))
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return copy
    })
  }

  const addToArray = (key, item) => {
    markSaving()
    setResumeData(prev => ({ ...prev, [key]: [...(prev[key] || []), item] }))
  }

  const removeFromArray = (key, index) => {
    markSaving()
    setResumeData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }))
  }

  const updateArrayItem = (key, index, field, value) => {
    markSaving()
    setResumeData(prev => {
      const updated = [...prev[key]]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, [key]: updated }
    })
  }

  // --- Render helpers ---
  const renderInput = (placeholder, value, onChange, type = 'text') => (
    <input type={type} placeholder={placeholder} value={value || ''} onChange={onChange} className={INPUT} />
  )

  const renderTextarea = (placeholder, value, onChange, rows = 4) => (
    <textarea placeholder={placeholder} value={value || ''} onChange={onChange} rows={rows} className={INPUT} />
  )

  const renderSectionHeader = (index, label, arrayKey) => (
    <div className="flex justify-between items-center mb-3">
      <h4 className="font-semibold text-gray-900">{label} {index + 1}</h4>
      <button onClick={() => removeFromArray(arrayKey, index)} className={DEL_BTN}>Delete</button>
    </div>
  )

  // ==================== TAB CONTENT ====================

  const renderPersonal = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {renderInput('Full Name', resumeData.personalInfo.fullName, e => updateField('personalInfo.fullName', e.target.value))}
        {renderInput('Job Title', resumeData.personalInfo.jobTitle, e => updateField('personalInfo.jobTitle', e.target.value))}
        {renderInput('Email', resumeData.personalInfo.email, e => updateField('personalInfo.email', e.target.value), 'email')}
        {renderInput('Phone', resumeData.personalInfo.phone, e => updateField('personalInfo.phone', e.target.value), 'tel')}
        {renderInput('Location (e.g. New York, NY)', resumeData.personalInfo.location, e => updateField('personalInfo.location', e.target.value))}
        {renderInput('LinkedIn URL', resumeData.personalInfo.linkedin, e => updateField('personalInfo.linkedin', e.target.value), 'url')}
        {renderInput('Website / Portfolio URL', resumeData.personalInfo.website, e => updateField('personalInfo.website', e.target.value), 'url')}
        {renderInput('GitHub URL', resumeData.personalInfo.github, e => updateField('personalInfo.github', e.target.value), 'url')}
      </div>
      {renderInput('Photo URL (optional)', resumeData.personalInfo.photoUrl, e => updateField('personalInfo.photoUrl', e.target.value), 'url')}
    </div>
  )

  const renderSummary = () => (
    <div>
      {renderTextarea('Write your professional summary...', resumeData.summary, e => updateField('summary', e.target.value), 8)}
      <p className="text-xs text-gray-400 mt-2">Tip: 2–4 sentences highlighting your key qualifications and career goals.</p>
    </div>
  )

  const renderExperience = () => (
    <div className="space-y-4">
      {(resumeData.experience || []).map((exp, i) => (
        <div key={i} className={CARD}>
          {renderSectionHeader(i, 'Experience', 'experience')}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderInput('Job Title', exp.jobTitle, e => updateArrayItem('experience', i, 'jobTitle', e.target.value))}
              {renderInput('Company', exp.company, e => updateArrayItem('experience', i, 'company', e.target.value))}
              {renderInput('Location', exp.location, e => updateArrayItem('experience', i, 'location', e.target.value))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {renderInput('Start Date (e.g. Jan 2022)', exp.startDate, e => updateArrayItem('experience', i, 'startDate', e.target.value))}
              {renderInput('End Date (e.g. Present)', exp.endDate, e => updateArrayItem('experience', i, 'endDate', e.target.value))}
            </div>
            {renderTextarea('Description / bullet points...', exp.description, e => updateArrayItem('experience', i, 'description', e.target.value), 4)}
          </div>
        </div>
      ))}
      <button onClick={() => addToArray('experience', { jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' })} className={ADD_BTN}>
        + Add Experience
      </button>
    </div>
  )

  const renderEducation = () => (
    <div className="space-y-4">
      {(resumeData.education || []).map((edu, i) => (
        <div key={i} className={CARD}>
          {renderSectionHeader(i, 'Education', 'education')}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderInput('Degree (e.g. B.S. Computer Science)', edu.degree, e => updateArrayItem('education', i, 'degree', e.target.value))}
              {renderInput('Institution', edu.institution, e => updateArrayItem('education', i, 'institution', e.target.value))}
              {renderInput('Year (e.g. 2018 – 2022)', edu.year, e => updateArrayItem('education', i, 'year', e.target.value))}
            </div>
            {renderTextarea('Additional details (GPA, honors, coursework...)', edu.description, e => updateArrayItem('education', i, 'description', e.target.value), 3)}
          </div>
        </div>
      ))}
      <button onClick={() => addToArray('education', { degree: '', institution: '', year: '', description: '' })} className={ADD_BTN}>
        + Add Education
      </button>
    </div>
  )

  const renderProjects = () => (
    <div className="space-y-4">
      {(resumeData.projects || []).map((proj, i) => (
        <div key={i} className={CARD}>
          {renderSectionHeader(i, 'Project', 'projects')}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {renderInput('Project Title', proj.title, e => updateArrayItem('projects', i, 'title', e.target.value))}
              {renderInput('Your Role', proj.role, e => updateArrayItem('projects', i, 'role', e.target.value))}
              {renderInput('Technologies Used', proj.technologies, e => updateArrayItem('projects', i, 'technologies', e.target.value))}
              {renderInput('Project Link', proj.link, e => updateArrayItem('projects', i, 'link', e.target.value), 'url')}
            </div>
            {renderTextarea('Description...', proj.description, e => updateArrayItem('projects', i, 'description', e.target.value), 4)}
          </div>
        </div>
      ))}
      <button onClick={() => addToArray('projects', { title: '', role: '', description: '', technologies: '', link: '' })} className={ADD_BTN}>
        + Add Project
      </button>
    </div>
  )

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.skills || []).map((skill, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{skill}</span>
            <button onClick={() => removeFromArray('skills', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a skill and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            const skill = e.currentTarget.value.trim()
            if (!(resumeData.skills || []).includes(skill)) {
              addToArray('skills', skill)
            }
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
      <p className="text-xs text-gray-400">Press Enter to add each skill. Examples: JavaScript, React, Project Management</p>
    </div>
  )

  const renderCertifications = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.certifications || []).map((cert, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{cert}</span>
            <button onClick={() => removeFromArray('certifications', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a certification and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addToArray('certifications', e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
      <p className="text-xs text-gray-400">Example: AWS Solutions Architect – Associate (2024)</p>
    </div>
  )

  const renderAchievements = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.achievements || []).map((ach, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{ach}</span>
            <button onClick={() => removeFromArray('achievements', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type an achievement and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addToArray('achievements', e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
      <p className="text-xs text-gray-400">Example: Led team of 12 to deliver project 2 weeks ahead of schedule</p>
    </div>
  )

  const renderLanguages = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.languages || []).map((lang, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{lang}</span>
            <button onClick={() => removeFromArray('languages', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a language and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addToArray('languages', e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
      <p className="text-xs text-gray-400">Example: English (Native), Spanish (Conversational)</p>
    </div>
  )

  const renderInterests = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.interests || []).map((int, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{int}</span>
            <button onClick={() => removeFromArray('interests', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type an interest/hobby and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addToArray('interests', e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
    </div>
  )

  const renderReferences = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        {(resumeData.references || []).map((ref, i) => (
          <div key={i} className={TAG}>
            <span className="flex-1">{ref}</span>
            <button onClick={() => removeFromArray('references', i)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a reference and press Enter..."
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
            addToArray('references', e.currentTarget.value.trim())
            e.currentTarget.value = ''
          }
        }}
        className={INPUT}
      />
      <p className="text-xs text-gray-400">Example: Jane Doe – Manager at Acme Inc – jane@acme.com</p>
    </div>
  )

  const renderCustomFields = () => (
    <div className="space-y-4">
      {(resumeData.customFields || []).map((field, i) => (
        <div key={field.id || i} className={CARD}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-900">Custom Section {i + 1}</h4>
            <button onClick={() => removeFromArray('customFields', i)} className={DEL_BTN}>Delete</button>
          </div>
          <div className="space-y-3">
            {renderInput('Section Title', field.title, e => updateArrayItem('customFields', i, 'title', e.target.value))}
            {renderTextarea('Content...', field.content, e => updateArrayItem('customFields', i, 'content', e.target.value), 4)}
          </div>
        </div>
      ))}
      <button onClick={() => addToArray('customFields', { id: `custom_${Date.now()}`, title: '', content: '', type: 'text', isCustom: true })} className={ADD_BTN}>
        + Add Custom Section
      </button>
    </div>
  )

  const tabRenderers = {
    personal: renderPersonal,
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    projects: renderProjects,
    skills: renderSkills,
    certifications: renderCertifications,
    achievements: renderAchievements,
    languages: renderLanguages,
    interests: renderInterests,
    references: renderReferences,
    custom: renderCustomFields,
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition">← Back</button>
            <h1 className="text-xl font-bold">Resume Builder</h1>
            <span className="text-sm text-gray-500">
              {autoSaveStatus === 'saved' && '✓ Saved'}
              {autoSaveStatus === 'saving' && '⟳ Saving...'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {userId && (
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 border rounded px-2 py-1">
                <span className="truncate max-w-[120px]">{userId}</span>
                <button onClick={() => navigator.clipboard.writeText(userId)} className="underline">Copy</button>
              </div>
            )}
            <button
              onClick={() => {
                const id = `${Date.now()}`
                const name = resumeData?.personalInfo?.fullName || 'Resume'
                lsSave(`saved_${id}`, resumeData)
                const idx = lsLoad('saved_index', []) || []
                const next = [{ id, name, date: new Date().toISOString() }, ...idx]
                lsSave('saved_index', next)
                setRecentSaves(next.slice(0, 3))
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >Save</button>
            <button
              onClick={async () => {
                try {
                  setAutoSaveStatus('saving')
                  if (userId) await saveResume(userId, resumeData)
                  setAutoSaveStatus('saved')
                } catch { }
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >☁️ Cloud</button>
            <button
              onClick={async () => {
                try {
                  if (userId) {
                    const res = await fetchResume(userId)
                    if (res?.data) setResumeData(res.data)
                  }
                } catch { }
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
            >⬇️ Load</button>
            <button onClick={() => setShowSaveLoad(true)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">📁</button>
            <button onClick={() => setShowAnalytics(true)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">📊</button>
            <button onClick={() => setShowCover(true)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">✉️</button>
            <button onClick={() => setShowExport(true)} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Export</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Preview */}
          <div className="lg:col-span-2">
            <Preview
              data={resumeData}
              template={selectedTemplate}
              colors={colors}
              font={font}
            />
          </div>

          {/* Editor */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tab bar */}
              <div className="flex border-b overflow-x-auto scrollbar-hide">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition ${activeTab === tab.key
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {tabRenderers[activeTab]?.()}
              </div>
            </div>

            {/* Customization */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-lg">🎨 Customization</h3>
              <ColorPicker colors={colors} onColorChange={setColors} />
              <FontSelector font={font} onFontChange={setFont} />
            </div>

            <ATSChecker data={resumeData} />

            {recentSaves.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm font-semibold mb-2">Recent saves:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSaves.map(s => (
                    <span key={s.id} className="text-xs px-2 py-1 rounded border">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showExport && (
        <ExportPanel
          data={resumeData}
          template={selectedTemplate}
          colors={colors}
          font={font}
          onClose={() => setShowExport(false)}
        />
      )}

      {showSaveLoad && (
        <SaveLoadPanel
          currentData={resumeData}
          onLoad={(data) => { setResumeData(data); setShowSaveLoad(false) }}
          onClose={() => setShowSaveLoad(false)}
        />
      )}

      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Analytics</h2>
              <button onClick={() => setShowAnalytics(false)} className="px-3 py-1 border rounded-lg">Close</button>
            </div>
            <AnalyticsDashboard data={resumeData} />
          </div>
        </div>
      )}

      {showCover && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Cover Letter</h2>
              <button onClick={() => setShowCover(false)} className="px-3 py-1 border rounded-lg">Close</button>
            </div>
            <CoverLetterBuilder data={resumeData} />
          </div>
        </div>
      )}
    </div>
  )
}
