import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function CorporateGray({ data, colors }) {
    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #d1d5db' }}>
                <h1 style={{ color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {data.personalInfo?.fullName || 'Your Name'}
                </h1>
                {data.personalInfo?.jobTitle && (
                    <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{data.personalInfo.jobTitle}</p>
                )}
                <ContactLine data={data} separator="|" />
            </div>
            <ResumeBody data={data} accent="#4b5563" />
        </div>
    )
}
