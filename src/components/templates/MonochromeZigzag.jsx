import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function MonochromeZigzag({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <h1 className="text-[24px] font-black tracking-wide uppercase">{data.personalInfo?.fullName || 'Your Name'}</h1>
      {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 font-medium mt-0.5">{data.personalInfo.jobTitle}</p>}
      <ContactLine data={data} accent="#000" separator="—" />
      <div className="h-1 bg-gradient-to-r from-black via-gray-400 to-black my-4 rounded-full" />
      <ResumeBody data={data} accent="#000000" tagStyle={{ backgroundColor: '#111', color: '#fff', border: 'none' }} />
    </div>
  )
}
