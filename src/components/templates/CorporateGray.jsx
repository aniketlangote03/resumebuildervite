import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function CorporateGray({ data, colors }) {
    return (
        <div className="text-sm leading-relaxed">
            <div className="border-b-2 border-gray-400 pb-3 mb-3">
                <h1 className="text-2xl font-bold text-gray-700 uppercase tracking-wide">{data.personalInfo?.fullName || 'Your Name'}</h1>
                {data.personalInfo?.jobTitle && <p className="text-gray-500 text-sm">{data.personalInfo.jobTitle}</p>}
                <ContactLine data={data} />
            </div>
            <ResumeBody data={data} accent="#4b5563" />
        </div>
    )
}
