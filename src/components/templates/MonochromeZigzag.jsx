import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function MonochromeZigzag({ data, colors }) {
  return (
    <div>
      <h1 style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 900 }}>
        {data.personalInfo?.fullName || 'Your Name'}
      </h1>
      {data.personalInfo?.jobTitle && (
        <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, marginTop: '2px' }}>{data.personalInfo.jobTitle}</p>
      )}
      <ContactLine data={data} separator="—" />
      <hr className="divider-gradient" style={{ background: 'linear-gradient(to right, #000, #9ca3af, #000)', height: '3px' }} />
      <ResumeBody data={data} accent="#000000" />
    </div>
  )
}
