import React from 'react'

/**
 * Shared resume body that renders all sections with professional styling.
 * Every template wraps this with its own header.
 */
export default function ResumeBody({ data, accent = '#2563eb', tagStyle = {}, darkMode = false }) {
    const textColor = darkMode ? 'text-gray-200' : 'text-gray-700'
    const mutedColor = darkMode ? 'text-gray-400' : 'text-gray-500'
    const subColor = darkMode ? 'text-gray-300' : 'text-gray-600'

    const Sec = ({ title, children }) => (
        <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
                <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: accent }}>{title}</h2>
                <div className="flex-1 h-px" style={{ backgroundColor: accent + '30' }} />
            </div>
            {children}
        </div>
    )

    const Tag = ({ children }) => (
        <span
            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
            style={{
                backgroundColor: accent + '12',
                color: accent,
                border: `1px solid ${accent}25`,
                ...tagStyle
            }}
        >
            {children}
        </span>
    )

    return (
        <>
            {data.summary && (
                <Sec title="Summary">
                    <p className={`text-[12.5px] leading-relaxed ${textColor}`}>{data.summary}</p>
                </Sec>
            )}

            {data.experience?.length > 0 && (
                <Sec title="Experience">
                    {data.experience.map((e, i) => (
                        <div key={i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}>
                            <div className="flex justify-between items-baseline gap-2">
                                <h3 className="font-semibold text-[13px] text-gray-900">{e.jobTitle}</h3>
                                <span className={`text-[11px] ${mutedColor} whitespace-nowrap`}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
                            </div>
                            <p className={`text-[11.5px] ${subColor} font-medium`}>{e.company}{e.location ? ` · ${e.location}` : ''}</p>
                            {e.description && <p className={`text-[12px] ${textColor} mt-1.5 leading-relaxed whitespace-pre-line`}>{e.description}</p>}
                        </div>
                    ))}
                </Sec>
            )}

            {data.education?.length > 0 && (
                <Sec title="Education">
                    {data.education.map((e, i) => (
                        <div key={i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}>
                            <div className="flex justify-between items-baseline gap-2">
                                <h3 className="font-semibold text-[13px] text-gray-900">{e.degree}</h3>
                                {e.year && <span className={`text-[11px] ${mutedColor} whitespace-nowrap`}>{e.year}</span>}
                            </div>
                            {e.institution && <p className={`text-[11.5px] ${subColor} font-medium`}>{e.institution}</p>}
                            {e.description && <p className={`text-[12px] ${textColor} mt-1.5 leading-relaxed whitespace-pre-line`}>{e.description}</p>}
                        </div>
                    ))}
                </Sec>
            )}

            {data.projects?.length > 0 && (
                <Sec title="Projects">
                    {data.projects.map((p, i) => (
                        <div key={i} className={`${i > 0 ? 'mt-3 pt-3 border-t border-gray-100' : ''}`}>
                            <div className="flex justify-between items-baseline gap-2">
                                <h3 className="font-semibold text-[13px] text-gray-900">{p.title}{p.role ? <span className={`font-normal ${subColor}`}> — {p.role}</span> : ''}</h3>
                            </div>
                            {p.technologies && (
                                <p className={`text-[11px] ${mutedColor} mt-0.5`}>
                                    <span className="font-semibold">Tech:</span> {p.technologies}
                                </p>
                            )}
                            {p.description && <p className={`text-[12px] ${textColor} mt-1.5 leading-relaxed whitespace-pre-line`}>{p.description}</p>}
                            {p.link && (
                                <a href={p.link} className="text-[11px] mt-1 inline-block hover:underline" style={{ color: accent }}>{p.link}</a>
                            )}
                        </div>
                    ))}
                </Sec>
            )}

            {data.skills?.length > 0 && (
                <Sec title="Skills">
                    <div className="flex flex-wrap gap-1.5">
                        {data.skills.map((s, i) => <Tag key={i}>{s}</Tag>)}
                    </div>
                </Sec>
            )}

            {data.certifications?.length > 0 && (
                <Sec title="Certifications">
                    <ul className="space-y-1">
                        {data.certifications.map((c, i) => (
                            <li key={i} className={`text-[12px] ${textColor} flex items-start gap-2`}>
                                <span style={{ color: accent }} className="mt-0.5">▸</span> {c}
                            </li>
                        ))}
                    </ul>
                </Sec>
            )}

            {data.achievements?.length > 0 && (
                <Sec title="Achievements">
                    <ul className="space-y-1">
                        {data.achievements.map((a, i) => (
                            <li key={i} className={`text-[12px] ${textColor} flex items-start gap-2`}>
                                <span style={{ color: accent }} className="mt-0.5">▸</span> {a}
                            </li>
                        ))}
                    </ul>
                </Sec>
            )}

            {data.languages?.length > 0 && (
                <Sec title="Languages">
                    <div className="flex flex-wrap gap-1.5">{data.languages.map((l, i) => <Tag key={i}>{l}</Tag>)}</div>
                </Sec>
            )}

            {data.interests?.length > 0 && (
                <Sec title="Interests">
                    <div className="flex flex-wrap gap-1.5">{data.interests.map((n, i) => <Tag key={i}>{n}</Tag>)}</div>
                </Sec>
            )}

            {data.references?.length > 0 && (
                <Sec title="References">
                    <ul className="space-y-1">
                        {data.references.map((r, i) => (
                            <li key={i} className={`text-[12px] ${textColor}`}>{r}</li>
                        ))}
                    </ul>
                </Sec>
            )}

            {data.customFields?.length > 0 && data.customFields.map((f, i) => f.title && (
                <Sec key={f.id || i} title={f.title}>
                    <p className={`text-[12px] ${textColor} leading-relaxed whitespace-pre-line`}>{f.content}</p>
                </Sec>
            ))}
        </>
    )
}

/** Contact info line shared by templates */
export function ContactLine({ data, accent = '#2563eb', separator = '·' }) {
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
        <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-1 gap-y-0.5 mt-1">
            {items.map((t, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <span className="text-gray-300 mx-0.5">{separator}</span>}
                    <span className="hover:text-gray-700 transition">{t}</span>
                </React.Fragment>
            ))}
        </div>
    )
}
