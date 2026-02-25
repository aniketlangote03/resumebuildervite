import React from 'react'
import ResumeBody from './ResumeBody'

export default function ModernMinimalPhoto({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="text-center mb-5">
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-2 ring-gray-200 ring-offset-2" />
          : <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center text-gray-400 text-3xl">👤</div>
        }
        <h1 className="text-[22px] font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 mt-0.5">{data.personalInfo.jobTitle}</p>}
        <div className="text-[11px] text-gray-400 flex flex-wrap justify-center items-center gap-x-1 mt-1">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => (
            <React.Fragment key={i}>{i > 0 && <span className="mx-0.5">·</span>}<span>{t}</span></React.Fragment>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 mb-5" />
      <ResumeBody data={data} accent="#2563eb" />
    </div>
  )
}
