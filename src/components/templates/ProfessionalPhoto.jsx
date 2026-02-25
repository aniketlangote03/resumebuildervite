import React from 'react'
import ResumeBody from './ResumeBody'

export default function ProfessionalPhoto({ data, colors }) {
  const contact = [data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #dbeafe' }}>
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #dbeafe' }} />
          : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '3px solid #dbeafe' }}>👤</div>
        }
        <div>
          <h1 style={{ color: '#1d4ed8' }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{data.personalInfo.jobTitle}</p>}
          {contact.length > 0 && <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{contact.join(' · ')}</div>}
        </div>
      </div>
      <ResumeBody data={data} accent="#1d4ed8" />
    </div>
  )
}
