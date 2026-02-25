import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function MonochromeZigzag({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <h1 className="text-3xl font-black tracking-wide">{data.personalInfo?.fullName || 'Your Name'}</h1>
      {data.personalInfo?.jobTitle && <p className="text-sm text-gray-500 font-medium mb-1">{data.personalInfo.jobTitle}</p>}
      <ContactLine data={data} />
      <div className="h-1 bg-gradient-to-r from-black via-gray-500 to-black my-3" />
      <ResumeBody data={data} accent="#000000" tagBg="bg-gray-900 text-white" />
    </div>
  )
}
