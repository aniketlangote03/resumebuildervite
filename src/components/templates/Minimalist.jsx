import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function Minimalist({ data, colors }) {
  const accent = colors?.accent || '#2563eb'
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-[22px] font-bold tracking-tight text-gray-900" style={{ color: accent }}>
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        {data.personalInfo?.jobTitle && (
          <p className="text-[13px] text-gray-500 font-medium mt-0.5">{data.personalInfo.jobTitle}</p>
        )}
        <ContactLine data={data} accent={accent} />
      </div>
      <div className="h-0.5 mb-5" style={{ background: `linear-gradient(to right, ${accent}, ${accent}40, transparent)` }} />
      <ResumeBody data={data} accent={accent} />
    </div>
  )
}
