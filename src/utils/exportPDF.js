import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportPDF() {
  const element = document.getElementById('resume-preview')
  if (!element) {
    throw new Error('Resume preview not found. Please make sure the preview is visible.')
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = 210
  const pdfHeight = 297
  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * pdfWidth) / canvas.width

  // Handle multi-page if content is longer than one page
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position -= pdfHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save('Resume.pdf')
}
