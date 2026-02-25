import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ModernBlue({ data, colors }) {
  const blue = '#1d4ed8'
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="border-l-[3px] pl-4 mb-5" style={{ borderColor: blue }}>
        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: blue }}>{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 font-medium mt-0.5">{data.personalInfo.jobTitle}</p>}
        <ContactLine data={data} accent={blue} separator="|" />
      </div>
      <ResumeBody data={data} accent={blue} />
    </div>
  )
}
