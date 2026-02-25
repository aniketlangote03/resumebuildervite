import React, { useState, useMemo } from 'react'

export default function AnalyticsDashboard({ data }) {
  const stats = useMemo(() => {
    const d = data || {}
    const wordCount = [
      d.summary || '',
      ...(d.experience || []).map(e => `${e.jobTitle} ${e.description || ''}`),
      ...(d.projects || []).map(p => `${p.title} ${p.description || ''}`),
    ].join(' ').split(/\s+/).filter(Boolean).length

    const sections = [
      { name: 'Personal Info', filled: !!(d.personalInfo?.fullName && d.personalInfo?.email) },
      { name: 'Summary', filled: !!(d.summary && d.summary.length > 20) },
      { name: 'Experience', filled: (d.experience?.length || 0) > 0 },
      { name: 'Education', filled: (d.education?.length || 0) > 0 },
      { name: 'Projects', filled: (d.projects?.length || 0) > 0 },
      { name: 'Skills', filled: (d.skills?.length || 0) >= 3 },
      { name: 'Certifications', filled: (d.certifications?.length || 0) > 0 },
    ]
    const completeness = Math.round((sections.filter(s => s.filled).length / sections.length) * 100)

    return { wordCount, sections, completeness }
  }, [data])

  const barColor = stats.completeness > 75 ? '#16a34a' : stats.completeness > 40 ? '#ca8a04' : '#dc2626'

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Resume Analytics</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.wordCount}</p>
          <p className="text-xs text-gray-500">Total Words</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: barColor }}>{stats.completeness}%</p>
          <p className="text-xs text-gray-500">Completeness</p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${stats.completeness}%`, backgroundColor: barColor }} />
      </div>

      <h3 className="font-semibold text-sm mb-2">Section Checklist</h3>
      <div className="space-y-1.5">
        {stats.sections.map(s => (
          <div key={s.name} className="flex items-center gap-2 text-sm">
            <span className={s.filled ? 'text-green-600' : 'text-gray-400'}>{s.filled ? '✅' : '⬜'}</span>
            <span className={s.filled ? 'text-gray-700' : 'text-gray-400'}>{s.name}</span>
          </div>
        ))}
      </div>

      {stats.wordCount < 150 && (
        <p className="text-xs text-amber-600 mt-3">💡 Tip: Most effective resumes have 300-600 words. Consider adding more detail.</p>
      )}
    </div>
  )
}
