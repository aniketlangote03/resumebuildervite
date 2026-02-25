import React from 'react'
import ResumeBody from './ResumeBody'

export default function GradientNeon({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="bg-gradient-to-r from-fuchsia-600 to-cyan-500 -m-8 p-8 mb-5 text-white">
        <h1 className="text-[22px] font-extrabold tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-[13px] opacity-80 mt-0.5">{data.personalInfo.jobTitle}</p>}
        <div className="text-[11px] opacity-60 flex flex-wrap items-center gap-x-1 mt-2">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => (
            <React.Fragment key={i}>{i > 0 && <span className="mx-0.5">·</span>}<span>{t}</span></React.Fragment>
          ))}
        </div>
      </div>
      <ResumeBody data={data} accent="#d946ef" />
    </div>
  )
}
