import React from 'react'
import ResumeBody from './ResumeBody'

export default function ExecutivePortrait({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        margin: '-40px -40px 20px', padding: '24px 40px',
        background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
        borderRadius: '4px 4px 0 0'
      }}>
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
          : <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: '#9ca3af' }}>👤</div>
        }
        <div>
          <h1>{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p style={{ fontSize: '13px', color: '#6b7280' }}>{data.personalInfo.jobTitle}</p>}
          {contact.length > 0 && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{contact.join(' · ')}</div>}
        </div>
      </div>
      <ResumeBody data={data} accent="#374151" />
    </div>
  )
}
