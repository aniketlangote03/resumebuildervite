import React from 'react'

/**
 * Shared resume body that renders all sections.
 * Every template wraps this with its own header/styling.
 * Props: data, accent (color string), sectionClass (optional extra class for section headings)
 */
export default function ResumeBody({ data, accent = '#2563eb', tagBg = 'bg-gray-200', tagClass = '' }) {
    const Sec = ({ title, children }) => (
        <div className="mb-3">
            <h2 className="font-bold text-xs tracking-wider mb-1" style={{ color: accent }}>{title}</h2>
            {children}
        </div>
    )

    return (
        <>
            {data.summary && <Sec title="SUMMARY"><p className="text-xs text-gray-700 whitespace-pre-line">{data.summary}</p></Sec>}

            {data.experience?.length > 0 && (
                <Sec title="EXPERIENCE">
                    {data.experience.map((e, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between">
                                <p className="font-semibold text-sm">{e.jobTitle}</p>
                                <p className="text-xs text-gray-500">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</p>
                            </div>
                            <p className="text-xs text-gray-600">{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                            {e.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{e.description}</p>}
                        </div>
                    ))}
                </Sec>
            )}

            {data.education?.length > 0 && (
                <Sec title="EDUCATION">
                    {data.education.map((e, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between">
                                <p className="font-semibold text-sm">{e.degree}</p>
                                {e.year && <p className="text-xs text-gray-500">{e.year}</p>}
                            </div>
                            {e.institution && <p className="text-xs text-gray-600">{e.institution}</p>}
                            {e.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{e.description}</p>}
                        </div>
                    ))}
                </Sec>
            )}

            {data.projects?.length > 0 && (
                <Sec title="PROJECTS">
                    {data.projects.map((p, i) => (
                        <div key={i} className="mb-2">
                            <p className="font-semibold text-sm">{p.title}{p.role ? ` — ${p.role}` : ''}</p>
                            {p.technologies && <p className="text-xs text-gray-500">Tech: {p.technologies}</p>}
                            {p.description && <p className="text-xs text-gray-600 whitespace-pre-line">{p.description}</p>}
                            {p.link && <p className="text-xs text-blue-500">{p.link}</p>}
                        </div>
                    ))}
                </Sec>
            )}

            {data.skills?.length > 0 && (
                <Sec title="SKILLS">
                    <div className="flex flex-wrap gap-1">
                        {data.skills.map((s, i) => <span key={i} className={`text-xs px-2 py-0.5 rounded ${tagBg} ${tagClass}`}>{s}</span>)}
                    </div>
                </Sec>
            )}

            {data.certifications?.length > 0 && <Sec title="CERTIFICATIONS"><ul className="list-disc list-inside text-xs text-gray-700">{data.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul></Sec>}
            {data.achievements?.length > 0 && <Sec title="ACHIEVEMENTS"><ul className="list-disc list-inside text-xs text-gray-700">{data.achievements.map((a, i) => <li key={i}>{a}</li>)}</ul></Sec>}

            {data.languages?.length > 0 && (
                <Sec title="LANGUAGES">
                    <div className="flex flex-wrap gap-1">{data.languages.map((l, i) => <span key={i} className={`text-xs px-2 py-0.5 rounded ${tagBg} ${tagClass}`}>{l}</span>)}</div>
                </Sec>
            )}

            {data.interests?.length > 0 && (
                <Sec title="INTERESTS">
                    <div className="flex flex-wrap gap-1">{data.interests.map((n, i) => <span key={i} className={`text-xs px-2 py-0.5 rounded ${tagBg} ${tagClass}`}>{n}</span>)}</div>
                </Sec>
            )}

            {data.references?.length > 0 && <Sec title="REFERENCES"><ul className="text-xs text-gray-700 space-y-1">{data.references.map((r, i) => <li key={i}>{r}</li>)}</ul></Sec>}

            {data.customFields?.length > 0 && data.customFields.map((f, i) => f.title && (
                <Sec key={f.id || i} title={f.title.toUpperCase()}><p className="text-xs text-gray-700 whitespace-pre-line">{f.content}</p></Sec>
            ))}
        </>
    )
}

/** Contact info line shared by templates */
export function ContactLine({ data }) {
    const items = [
        data.personalInfo?.email,
        data.personalInfo?.phone,
        data.personalInfo?.location,
        data.personalInfo?.linkedin,
        data.personalInfo?.github,
        data.personalInfo?.website,
    ].filter(Boolean)
    if (!items.length) return null
    return <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">{items.map((t, i) => <span key={i}>{t}</span>)}</div>
}
