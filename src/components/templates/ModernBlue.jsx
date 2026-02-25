import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ModernBlue({ data, colors }) {
  const blue = '#1d4ed8'
  return (
    <div className="text-sm leading-relaxed">
      <div className="border-l-4 pl-4 mb-4" style={{ borderColor: blue }}>
        <h1 className="text-2xl font-bold" style={{ color: blue }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-gray-600">{data.personalInfo.jobTitle}</p>}
        <ContactLine data={data} />
      </div>
      <ResumeBody data={data} accent={blue} tagBg="bg-blue-50 border border-blue-200" />
    </div>
  )
}
