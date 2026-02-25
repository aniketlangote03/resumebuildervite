import React from 'react'
import ResumeBody from './ResumeBody'

export default function CreativeProfile({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 -m-8 p-8 mb-4 text-white">
        {data.personalInfo?.photoUrl && (
          <img src={data.personalInfo.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white mb-2" />
        )}
        <h1 className="text-2xl font-extrabold">{data.personalInfo?.fullName || 'Your Name'}</h1>
        {data.personalInfo?.jobTitle && <p className="opacity-90">{data.personalInfo.jobTitle}</p>}
        <div className="text-xs opacity-70 flex flex-wrap gap-x-3 mt-1">
          {[data.personalInfo?.email, data.personalInfo?.phone, data.personalInfo?.location].filter(Boolean).map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>
      <ResumeBody data={data} accent="#6d28d9" tagBg="bg-purple-50 border border-purple-200" />
    </div>
  )
}
