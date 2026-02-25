import React from 'react'
import ResumeBody from './ResumeBody'

export default function GradientNeon({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #d946ef, #06b6d4)',
        margin: '-40px -40px 20px', padding: '32px 40px', color: '#fff',
        borderRadius: '4px 4px 0 0'
      }}>
        <h1 style={{ color: '#fff', fontWeight: 800 }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>{data.personalInfo.jobTitle}</p>}
        {contact.length > 0 && (
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {contact.map((t, i) => <React.Fragment key={i}>{i > 0 && <span style={{ margin: '0 2px' }}>·</span>}<span>{t}</span></React.Fragment>)}
          </div>
        )}
      </div>
      <ResumeBody data={data} accent="#d946ef" />
    </div>
  )
}
