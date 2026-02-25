import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function Minimalist({ data, colors }) {
  const accent = colors?.accent || '#2563eb'
  return (
    <div>
      <h1 style={{ color: accent }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
      {data.personalInfo?.jobTitle && (
        <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>{data.personalInfo.jobTitle}</p>
      )}
      <ContactLine data={data} />
      <hr className="divider-gradient" style={{ background: `linear-gradient(to right, ${accent}, ${accent}22)` }} />
      <ResumeBody data={data} accent={accent} />
    </div>
  )
}
