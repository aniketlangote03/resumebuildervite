import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ModernBlue({ data, colors }) {
  const blue = '#1d4ed8'
  return (
    <div>
      <div style={{ borderLeft: `3px solid ${blue}`, paddingLeft: '16px', marginBottom: '20px' }}>
        <h1 style={{ color: blue }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && (
          <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>{data.personalInfo.jobTitle}</p>
        )}
        <ContactLine data={data} separator="|" />
      </div>
      <ResumeBody data={data} accent={blue} />
    </div>
  )
}
