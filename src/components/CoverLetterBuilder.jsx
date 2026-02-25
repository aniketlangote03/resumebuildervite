import React, { useState, useMemo } from 'react'

export default function CoverLetterBuilder({ data }) {
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [content, setContent] = useState('')

  const generateTemplate = () => {
    const name = data?.personalInfo?.fullName || 'Your Name'
    const title = data?.personalInfo?.jobTitle || jobTitle || 'the position'
    const skills = (data?.skills || []).slice(0, 5).join(', ')
    const experience = data?.experience?.[0]

    const letter = `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle || title} position${companyName ? ` at ${companyName}` : ''}. With my background${experience ? ` as a ${experience.jobTitle} at ${experience.company}` : ''} and expertise in ${skills || 'relevant technologies'}, I am confident I would be a strong addition to your team.

${data?.summary || 'I bring a combination of technical skills and professional experience that align well with this role.'}

${experience?.description ? `In my most recent role, ${experience.description.split('.')[0]}.` : 'I have consistently delivered results in my previous positions.'}

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.

Sincerely,
${name}
${data?.personalInfo?.email || ''}
${data?.personalInfo?.phone || ''}`

    setContent(letter)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Cover Letter Builder</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={generateTemplate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold mb-4 transition w-full"
      >
        ✨ Generate Cover Letter from Resume Data
      </button>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Click Generate above, or write your cover letter here..."
      />

      {content && (
        <button
          onClick={copyToClipboard}
          className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition w-full"
        >
          📋 Copy to Clipboard
        </button>
      )}
    </div>
  )
}
