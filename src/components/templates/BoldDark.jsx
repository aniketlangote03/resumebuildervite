import React from 'react'
import ResumeBody from './ResumeBody'

export default function BoldDark({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="bg-gray-900 text-white -m-8 p-8 mb-5 rounded-b-2xl">
        <h1 className="text-[22px] font-extrabold tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-[13px] opacity-70 mt-0.5">{data.personalInfo.jobTitle}</p>}
        <div className="text-[11px] opacity-50 flex flex-wrap items-center gap-x-1 mt-2">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location, data.personalInfo?.linkedin, data.personalInfo?.github, data.personalInfo?.website].filter(Boolean).map((t, i, arr) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="mx-0.5">·</span>}
              <span>{t}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
      <ResumeBody data={data} accent="#111827" tagStyle={{ backgroundColor: '#111827', color: '#fff', border: 'none' }} />
    </div>
  )
}
