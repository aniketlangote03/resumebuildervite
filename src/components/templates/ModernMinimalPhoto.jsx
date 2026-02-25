import React from 'react'
import ResumeBody from './ResumeBody'

export default function ModernMinimalPhoto({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block', border: '3px solid #e5e7eb' }} />
          : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#f3f4f6', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#9ca3af' }}>👤</div>
        }
        <h1>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{data.personalInfo.jobTitle}</p>}
        {contact.length > 0 && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{contact.join(' · ')}</div>}
      </div>
      <hr className="divider-line" />
      <ResumeBody data={data} accent="#2563eb" />
    </div>
  )
}
