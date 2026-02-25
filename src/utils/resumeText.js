/** Build full text representation of resume data for TXT/DOCX export */
export function buildResumeText(data) {
    const lines = []
    const p = data.personalInfo || {}

    if (p.fullName) lines.push(p.fullName)
    if (p.jobTitle) lines.push(p.jobTitle)
    const contact = [p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean)
    if (contact.length) lines.push(contact.join(' | '))
    lines.push('')

    if (data.summary) { lines.push('SUMMARY', data.summary, '') }

    if (data.experience?.length) {
        lines.push('EXPERIENCE')
        data.experience.forEach(e => {
            lines.push(`${e.jobTitle || ''} — ${e.company || ''}`)
            const period = [e.startDate, e.endDate].filter(Boolean).join(' – ')
            if (period || e.location) lines.push([period, e.location].filter(Boolean).join(' | '))
            if (e.description) lines.push(e.description)
            lines.push('')
        })
    }

    if (data.education?.length) {
        lines.push('EDUCATION')
        data.education.forEach(e => {
            lines.push(`${e.degree || ''} — ${e.institution || ''}`)
            if (e.year) lines.push(e.year)
            if (e.description) lines.push(e.description)
            lines.push('')
        })
    }

    if (data.projects?.length) {
        lines.push('PROJECTS')
        data.projects.forEach(p => {
            lines.push(p.title || '')
            if (p.role) lines.push(`Role: ${p.role}`)
            if (p.technologies) lines.push(`Tech: ${p.technologies}`)
            if (p.description) lines.push(p.description)
            if (p.link) lines.push(p.link)
            lines.push('')
        })
    }

    if (data.skills?.length) lines.push('SKILLS', data.skills.join(', '), '')
    if (data.certifications?.length) { lines.push('CERTIFICATIONS'); data.certifications.forEach(c => lines.push(`• ${c}`)); lines.push('') }
    if (data.achievements?.length) { lines.push('ACHIEVEMENTS'); data.achievements.forEach(a => lines.push(`• ${a}`)); lines.push('') }
    if (data.languages?.length) lines.push('LANGUAGES', data.languages.join(', '), '')
    if (data.interests?.length) lines.push('INTERESTS', data.interests.join(', '), '')
    if (data.references?.length) { lines.push('REFERENCES'); data.references.forEach(r => lines.push(r)); lines.push('') }
    if (data.customFields?.length) {
        data.customFields.forEach(f => { if (f.title) lines.push(f.title.toUpperCase(), f.content || '', '') })
    }

    return lines.join('\n')
}
