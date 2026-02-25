import React from 'react'
import ResumeBody from './ResumeBody'

export default function ProfessionalPhoto({ data, colors }) {
  return (
    <div className="text-sm leading-relaxed">
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="col-span-1 flex justify-center">
          {data.personalInfo?.photoUrl
            ? <img src={data.personalInfo.photoUrl} alt="" className="w-24 h-24 rounded-full object-cover" />
            : <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-3xl">👤</div>
          }
        </div>
        <div className="col-span-2">
          <h1 className="text-2xl font-bold text-blue-700">{data.personalInfo?.fullName || 'Your Name'}</h1>
          {data.personalInfo?.jobTitle && <p className="text-gray-600">{data.personalInfo.jobTitle}</p>}
          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
            {data.personalInfo?.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo?.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo?.location && <p>{data.personalInfo.location}</p>}
          </div>
        </div>
      </div>
      <div className="border-b border-blue-200 mb-3" />
      <ResumeBody data={data} accent="#1d4ed8" />
    </div>
  )
}
