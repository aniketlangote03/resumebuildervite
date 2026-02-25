import { buildResumeText } from './resumeText'

export async function exportTXT(data) {
  const content = buildResumeText(data)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.personalInfo?.fullName || 'Resume'}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
