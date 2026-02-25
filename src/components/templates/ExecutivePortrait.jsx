import React from 'react'
import ResumeBody from './ResumeBody'

export default function ExecutivePortrait({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <div className="flex items-center gap-4 -m-8 p-8 bg-gray-100 mb-4">
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          : <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-2xl">👤</div>
        }
        <div>
          <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p className="text-sm text-gray-600">{data.personalInfo.jobTitle}</p>}
          <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 mt-0.5">
            {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>
      <ResumeBody data={data} accent="#374151" />
    </div>
  )
}
