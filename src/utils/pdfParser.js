// PDF parser - extracts text from PDF files
// Uses a fallback text extraction approach since pdfjs-dist is large
export async function parsePdfFile(file) {
  if (!file) return ''

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result)
      const text = extractTextFromPDF(data)
      resolve(text || 'Could not extract text from this PDF. Please try a DOCX file or manual entry.')
    }
    reader.onerror = () => resolve('')
    reader.readAsArrayBuffer(file)
  })
}

function extractTextFromPDF(data) {
  // Convert to string to find text streams
  const raw = new TextDecoder('latin1').decode(data)

  const textParts = []

  // Extract text between BT (Begin Text) and ET (End Text) operators
  const btRegex = /BT\s([\s\S]*?)ET/g
  let match
  while ((match = btRegex.exec(raw)) !== null) {
    const block = match[1]
    // Extract text within parentheses (Tj/TJ operators)
    const tjRegex = /\(([^)]*)\)/g
    let tm
    while ((tm = tjRegex.exec(block)) !== null) {
      const txt = tm[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
      if (txt.trim()) textParts.push(txt)
    }
  }

  if (textParts.length > 0) {
    return textParts.join(' ').replace(/\s{2,}/g, ' ').trim()
  }

  // Fallback: try to extract any readable ASCII sequences
  const readable = raw.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s{3,}/g, '\n').trim()
  const lines = readable.split('\n').filter(l => l.trim().length > 3)
  return lines.slice(0, 100).join('\n')
}
