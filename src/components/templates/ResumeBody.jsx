import React from 'react'

/**
 * Shared resume body – renders all sections using CSS classes from index.css
 * for guaranteed styling (no Tailwind arbitrary values).
 */
export default function ResumeBody({ data, accent = '#2563eb' }) {

    const Section = ({ title, children }) => (
        <div className="section">
            <h2 style={{ color: accent, borderColor: accent + '40' }}>{title}</h2>
            {children}
        </div>
    )

    return (
        <>
            {data.summary && (
                <Section title="Summary">
                    <p>{data.summary}</p>
                </Section>
            )}

            {data.experience?.length > 0 && (
                <Section title="Experience">
                    {data.experience.map((e, i) => (
                        <div key={i} className="entry" style={i < data.experience.length - 1 ? { borderBottom: '1px solid #f3f4f6' } : {}}>
                            <div className="entry-header">
                                <h3>{e.jobTitle}</h3>
                                <span className="date">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
                            </div>
                            <div className="entry-sub">{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                            {e.description && <div className="entry-desc">{e.description}</div>}
                        </div>
                    ))}
                </Section>
            )}

            {data.education?.length > 0 && (
                <Section title="Education">
                    {data.education.map((e, i) => (
                        <div key={i} className="entry" style={i < data.education.length - 1 ? { borderBottom: '1px solid #f3f4f6' } : {}}>
                            <div className="entry-header">
                                <h3>{e.degree}</h3>
                                {e.year && <span className="date">{e.year}</span>}
                            </div>
                            {e.institution && <div className="entry-sub">{e.institution}</div>}
                            {e.description && <div className="entry-desc">{e.description}</div>}
                        </div>
                    ))}
                </Section>
            )}

            {data.projects?.length > 0 && (
                <Section title="Projects">
                    {data.projects.map((p, i) => (
                        <div key={i} className="entry" style={i < data.projects.length - 1 ? { borderBottom: '1px solid #f3f4f6' } : {}}>
                            <div className="entry-header">
                                <h3>{p.title}{p.role ? <span style={{ fontWeight: 400, color: '#6b7280' }}> — {p.role}</span> : ''}</h3>
                            </div>
                            {p.technologies && (
                                <div className="entry-sub" style={{ fontSize: '11px', marginTop: '2px' }}>
                                    Tech: {p.technologies}
                                </div>
                            )}
                            {p.description && <div className="entry-desc">{p.description}</div>}
                            {p.link && (
                                <a href={p.link} className="link" style={{ color: accent }}>{p.link}</a>
                            )}
                        </div>
                    ))}
                </Section>
            )}

            {data.skills?.length > 0 && (
                <Section title="Skills">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {data.skills.map((s, i) => (
                            <span key={i} className="tag" style={{ background: accent + '10', color: accent, border: `1px solid ${accent}30` }}>{s}</span>
                        ))}
                    </div>
                </Section>
            )}

            {data.certifications?.length > 0 && (
                <Section title="Certifications">
                    {data.certifications.map((c, i) => (
                        <div key={i} className="bullet-item">
                            <span style={{ color: accent, fontWeight: 700 }}>▸</span> <span>{c}</span>
                        </div>
                    ))}
                </Section>
            )}

            {data.achievements?.length > 0 && (
                <Section title="Achievements">
                    {data.achievements.map((a, i) => (
                        <div key={i} className="bullet-item">
                            <span style={{ color: accent, fontWeight: 700 }}>▸</span> <span>{a}</span>
                        </div>
                    ))}
                </Section>
            )}

            {data.languages?.length > 0 && (
                <Section title="Languages">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {data.languages.map((l, i) => (
                            <span key={i} className="tag" style={{ background: accent + '10', color: accent, border: `1px solid ${accent}30` }}>{l}</span>
                        ))}
                    </div>
                </Section>
            )}

            {data.interests?.length > 0 && (
                <Section title="Interests">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {data.interests.map((n, i) => (
                            <span key={i} className="tag" style={{ background: accent + '10', color: accent, border: `1px solid ${accent}30` }}>{n}</span>
                        ))}
                    </div>
                </Section>
            )}

            {data.references?.length > 0 && (
                <Section title="References">
                    {data.references.map((r, i) => (
                        <div key={i} className="bullet-item"><span>{r}</span></div>
                    ))}
                </Section>
            )}

            {data.customFields?.length > 0 && data.customFields.map((f, i) => f.title && (
                <Section key={f.id || i} title={f.title}>
                    <p style={{ whiteSpace: 'pre-line' }}>{f.content}</p>
                </Section>
            ))}
        </>
    )
}

/** Contact info line */
export function ContactLine({ data, separator = '·' }) {
    const items = [
        data.personalInfo?.email,
        data.personalInfo?.phone,
        data.personalInfo?.location,
        data.personalInfo?.linkedin,
        data.personalInfo?.github,
        data.personalInfo?.website,
    ].filter(Boolean)
    if (!items.length) return null
    return (
        <div className="contact-line">
            {items.map((t, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span className="contact-sep">{separator}</span>}
                    <span>{t}</span>
                </React.Fragment>
            ))}
        </div>
    )
}
