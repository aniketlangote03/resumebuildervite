import React from 'react'
import ResumeBody from './ResumeBody'

export default function TechStartup({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location, data.personalInfo?.github].filter(Boolean)
  return (
    <div>
      <div style={{
        background: '#000', color: '#fff',
        margin: '-40px -40px 20px', padding: '28px 40px',
        borderRadius: '4px 4px 0 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {data.personalInfo?.photoUrl && (
            <img src={data.personalInfo.photoUrl} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
          )}
          <div>
            <h1 style={{ color: '#fff', fontWeight: 800 }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
            {data.personalInfo?.jobTitle && <p style={{ fontSize: '12px', opacity: 0.7 }}>{data.personalInfo.jobTitle}</p>}
          </div>
        </div>
        {contact.length > 0 && (
          <div style={{ fontSize: '11px', opacity: 0.5, marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {contact.map((t, i) => <React.Fragment key={i}>{i > 0 && <span style={{ margin: '0 2px' }}>·</span>}<span>{t}</span></React.Fragment>)}
          </div>
        )}
      </div>
      <ResumeBody data={data} accent="#10b981" />
    </div>
  )
}
