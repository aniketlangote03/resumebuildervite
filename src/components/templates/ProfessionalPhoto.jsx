import React from 'react'
import ResumeBody from './ResumeBody'

export default function ProfessionalPhoto({ data, colors }) {
  return (
    <div className="text-[13px] leading-relaxed text-gray-800">
      <div className="flex items-center gap-5 mb-5 pb-4 border-b-2 border-blue-100">
        {data.personalInfo?.photoUrl
          ? <img src={data.personalInfo.photoUrl} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-200 ring-offset-2" />
          : <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-400 text-3xl ring-2 ring-blue-200 ring-offset-2">👤</div>
        }
        <div>
          <h1 className="text-[22px] font-bold text-blue-700">{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 font-medium">{data.personalInfo.jobTitle}</p>}
          <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
            {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo?.phone && <span className="ml-3">{data.personalInfo.phone}</span>}
          </div>
        </div>
      </div>
      <ResumeBody data={data} accent="#1d4ed8" />
    </div>
  )
}
