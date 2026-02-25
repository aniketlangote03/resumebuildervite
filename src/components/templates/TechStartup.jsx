import React from 'react'
import ResumeBody from './ResumeBody'

export default function TechStartup({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <div className="-m-8 p-8 bg-black text-white mb-4">
        <div className="flex items-center gap-4">
          {data.personalInfo?.photoUrl && (
            <img src={data.personalInfo.photoUrl} alt="" className="w-14 h-14 rounded object-cover" />
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{data.personalInfo?.fullName || 'Your Name'}</h1>
            {data.personalInfo?.jobTitle && <p className="text-sm opacity-80">{data.personalInfo.jobTitle}</p>}
          </div>
        </div>
        <div className="text-xs opacity-60 flex flex-wrap gap-x-3 mt-2">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location, data.personalInfo?.github].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <ResumeBody data={data} accent="#10b981" tagBg="bg-emerald-50 border border-emerald-200" />
    </div>
  )
}
