import React from 'react'
import ResumeBody from './ResumeBody'

export default function CreativeSplit({ data, colors }) {
    const accent = '#4f46e5'
    const contact = [
        { icon: '✉', val: data.personalInfo?.email },
        { icon: '☎', val: data.personalInfo?.phone },
        { icon: '📍', val: data.personalInfo?.location },
        { icon: '🔗', val: data.personalInfo?.linkedin },
        { icon: '💻', val: data.personalInfo?.github },
    ].filter(x => x.val)

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '38% 1fr', gap: 0 }}>
            {/* Sidebar */}
            <div style={{
                background: accent, color: '#fff',
                margin: '-40px 0 -40px -40px', padding: '32px 20px',
                borderRadius: '4px 0 0 4px',
            }}>
                <h1 style={{ color: '#fff', fontSize: '20px' }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
                {data.personalInfo?.jobTitle && <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px', marginBottom: '16px' }}>{data.personalInfo.jobTitle}</p>}

                <div style={{ fontSize: '11px', opacity: 0.7 }}>
                    {contact.map((c, i) => <div key={i} style={{ marginBottom: '6px' }}>{c.icon} {c.val}</div>)}
                </div>

                {data.skills?.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>Skills</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {data.skills.map((s, i) => <span key={i} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>{s}</span>)}
                        </div>
                    </div>
                )}

                {data.languages?.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.6, marginBottom: '8px' }}>Languages</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {data.languages.map((l, i) => <span key={i} style={{ fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>{l}</span>)}
                        </div>
                    </div>
                )}
            </div>

            {/* Main */}
            <div style={{ paddingLeft: '24px' }}>
                <ResumeBody data={{ ...data, skills: [], languages: [] }} accent={accent} />
            </div>
        </div>
    )
}
