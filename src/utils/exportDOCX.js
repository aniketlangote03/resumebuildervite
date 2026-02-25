import { buildResumeText } from './resumeText'

export async function exportDOCX(data, template, colors, font) {
  const content = buildResumeText(data)
  // Create a simple HTML document for the docx MIME type so Word can open it with formatting
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:${font || 'Calibri'},sans-serif;font-size:11pt;line-height:1.5}</style></head><body><pre style="white-space:pre-wrap">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre></body></html>`
  const blob = new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.personalInfo?.fullName || 'Resume'}.docx`
  a.click()
  URL.revokeObjectURL(url)
}
