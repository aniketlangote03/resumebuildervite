import React from 'react'
import ResumeBody from './ResumeBody'

export default function ExecutivePortrait({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="flex items-center gap-4 -m-8 p-8 bg-gray-50 mb-5 border-b border-gray-200">
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">👤</div>
        }
        <div>
          <h1 className="text-[22px] font-bold text-gray-900">{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500">{data.personalInfo.jobTitle}</p>}
          <div className="text-[11px] text-gray-400 flex flex-wrap gap-x-1 mt-0.5">
            {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => (
              <React.Fragment key={i}>{i > 0 && <span className="mx-0.5">·</span>}<span>{t}</span></React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <ResumeBody data={data} accent="#374151" />
    </div>
  )
}
