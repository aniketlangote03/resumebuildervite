import React from 'react'
import ResumeBody from './ResumeBody'

export default function CreativeProfile({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 -m-8 p-8 mb-5 text-white">
        {data.personalInfo?.photoUrl && (
          <img src={data.personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white/50 mb-3" />
        )}
        <h1 className="text-[22px] font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-[13px] opacity-80 mt-0.5">{data.personalInfo.jobTitle}</p>}
        <div className="text-[11px] opacity-60 flex flex-wrap items-center gap-x-1 mt-2">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => (
            <React.Fragment key={i}>{i > 0 && <span className="mx-0.5">·</span>}<span>{t}</span></React.Fragment>
          ))}
        </div>
      </div>
      <ResumeBody data={data} accent="#6d28d9" />
    </div>
  )
}
