import mammoth from 'mammoth'

export async function parseDocxFile(file) {
  if (!file) return ''
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value || ''
  } catch (err) {
    console.error('DOCX parse error:', err)
    return ''
  }
}
