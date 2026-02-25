import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ElegantSerif({ data, colors }) {
    return (
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {data.personalInfo?.fullName || 'Your Name'}
                </h1>
                {data.personalInfo?.jobTitle && (
                    <p style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', marginTop: '4px' }}>{data.personalInfo.jobTitle}</p>
                )}
                <ContactLine data={data} separator="•" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0 20px' }}>
                <div style={{ flex: 1, height: '1px', background: '#d1d5db' }} />
                <span style={{ color: '#9ca3af', fontSize: '12px' }}>✦</span>
                <div style={{ flex: 1, height: '1px', background: '#d1d5db' }} />
            </div>
            <ResumeBody data={data} accent="#78350f" />
        </div>
    )
}
