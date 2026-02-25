import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function ElegantSerif({ data, colors }) {
    return (
        <div className="text-[13px] leading-relaxed" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
            <div className="text-center mb-5">
                <h1 className="text-[24px] font-bold text-gray-900">{data.personalInfo?.fullName || 'Your Name'}</h1>
                {data.personalInfo?.jobTitle && <p className="text-[13px] text-gray-500 italic mt-0.5">{data.personalInfo.jobTitle}</p>}
                <ContactLine data={data} accent="#78350f" separator="•" />
            </div>
            <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-gray-300" />
                <div className="text-gray-400 text-xs">✦</div>
                <div className="flex-1 h-px bg-gray-300" />
            </div>
            <ResumeBody data={data} accent="#78350f" />
        </div>
    )
}
