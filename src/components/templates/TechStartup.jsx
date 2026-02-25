import React from 'react'
import ResumeBody from './ResumeBody'

export default function TechStartup({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="-m-8 p-8 bg-black text-white mb-5">
        <div className="flex items-center gap-4">
          {data.personalInfo?.photoUrl && (
            <img src={data.personalInfo.photoUrl} alt="" className="w-14 h-14 rounded-lg object-cover" />
          )}
          <div>
            <h1 className="text-[22px] font-extrabold tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
            {data.personalInfo?.jobTitle && <p className="text-[12px] opacity-70">{data.personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="text-[11px] opacity-50 flex flex-wrap items-center gap-x-1 mt-2">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location, data.personalInfo?.github].filter(Boolean).map((t, i) => (
            <React.Fragment key={i}>{i > 0 && <span className="mx-0.5">·</span>}<span>{t}</span></React.Fragment>
          ))}
        </div>
      </div>
      <ResumeBody data={data} accent="#10b981" />
    </div>
  )
}
