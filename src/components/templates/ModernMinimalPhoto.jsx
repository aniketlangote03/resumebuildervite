import React from 'react'
import ResumeBody from './ResumeBody'

export default function ModernMinimalPhoto({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <div className="text-center mb-3">
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover mx-auto mb-2" />
          : <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-2 flex items-center justify-center text-gray-500 text-3xl">👤</div>
        }
        <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="text-gray-500">{data.personalInfo.jobTitle}</p>}
        <div className="text-xs text-gray-400 flex flex-wrap justify-center gap-x-3 mt-1">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <div className="border-t border-gray-200 mb-3" />
      <ResumeBody data={data} accent="#2563eb" />
    </div>
  )
}
