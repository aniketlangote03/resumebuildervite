import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function CorporateGray({ data, colors }) {
    return (
        <div className="text-[13px] leading-relaxed text-gray-800">
            <div className="text-center mb-5 pb-4 border-b-2 border-gray-300">
                <h1 className="text-[22px] font-bold text-gray-700 uppercase tracking-wider">{data.personalInfo?.fullName || 'Your Name'}</h1>
                {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 mt-0.5">{data.personalInfo.jobTitle}</p>}
                <ContactLine data={data} accent="#4b5563" separator="|" />
            </div>
            <ResumeBody data={data} accent="#4b5563" />
        </div>
    )
}
