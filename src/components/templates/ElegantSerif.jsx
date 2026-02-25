import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ElegantSerif({ data, colors }) {
    return (
        <div className="text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="text-center mb-3">
                <h1 className="text-2xl font-bold">{data.personalInfo?.fullName || 'Your Name'}</h1>
                {data.personalInfo?.jobTitle && <p className="text-gray-500 italic">{data.personalInfo.jobTitle}</p>}
                <ContactLine data={data} />
            </div>
            <div className="border-t border-gray-300 mb-3" />
            <ResumeBody data={data} accent="#78350f" />
        </div>
    )
}
