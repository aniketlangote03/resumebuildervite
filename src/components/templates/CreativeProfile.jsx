import React from 'react'
import ResumeBody from './ResumeBody'

export default function CreativeProfile({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
        margin: '-40px -40px 20px', padding: '32px 40px', color: '#fff',
        borderRadius: '4px 4px 0 0'
      }}>
        {data.personalInfo?.photoUrl && (
          <img src={data.personalInfo.photoUrl} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)', marginBottom: '12px' }} />
        )}
        <h1 style={{ color: '#fff', fontWeight: 800 }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '2px' }}>{data.personalInfo.jobTitle}</p>}
        {contact.length > 0 && (
          <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {contact.map((t, i) => <React.Fragment key={i}>{i > 0 && <span style={{ margin: '0 2px' }}>·</span>}<span>{t}</span></React.Fragment>)}
          </div>
        )}
      </div>
      <ResumeBody data={data} accent="#6d28d9" />
    </div>
  )
}
