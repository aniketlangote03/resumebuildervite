import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function Minimalist({ data, colors }) {
  const accent = colors?.accent || '#2563eb'
  return (
    <div className="text-sm leading-relaxed">
      <h1 className="text-2xl font-bold" style={{ color: accent }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
      {data.personalInfo?.jobTitle && <p className="text-gray-600 text-base mb-1">{data.personalInfo.jobTitle}</p>}
      <ContactLine data={data} />
      <div className="border-b-2 my-3" style={{ borderColor: accent }} />
      <ResumeBody data={data} accent={accent} />
    </div>
  )
}
