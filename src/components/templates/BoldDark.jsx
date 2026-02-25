import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function BoldDark({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed text-gray-900">
      <div className="bg-gray-900 text-white -m-8 p-8 mb-4">
        <h1 className="text-2xl font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="opacity-80">{data.personalInfo.jobTitle}</p>}
        <div className="text-xs opacity-60 flex flex-wrap gap-x-3 mt-1">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location, data.personalInfo?.linkedin, data.personalInfo?.github, data.personalInfo?.website].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <ResumeBody data={data} accent="#111827" tagBg="bg-gray-800 text-white" />
    </div>
  )
}
