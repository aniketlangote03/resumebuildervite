import React from 'react'
import ResumeBody from './ResumeBody'

export default function CreativeSplit({ data, colors }) {
    const accent = '#4f46e5'
    return (
        <div className="text-[13px] leading-relaxed">
            <div className="grid grid-cols-5 gap-0">
                {/* Sidebar */}
                <div className="col-span-2 bg-indigo-600 text-white -m-8 p-6" style={{ minHeight: 'calc(100% + 4rem)' }}>
                    <h1 className="text-[18px] font-bold mb-0.5">{data.personalInfo?.fullName || 'Your Name'}</h1>
                    {data.personalInfo?.jobTitle && <p className="text-[11px] opacity-80 mb-4">{data.personalInfo.jobTitle}</p>}
                    <div className="text-[11px] opacity-70 space-y-1.5">
                        {data.personalInfo?.email && <p>✉ {data.personalInfo.email}</p>}
                        {data.personalInfo?.phone && <p>☎ {data.personalInfo.phone}</p>}
                        {data.personalInfo?.location && <p>📍 {data.personalInfo.location}</p>}
                        {data.personalInfo?.linkedin && <p>🔗 {data.personalInfo.linkedin}</p>}
                        {data.personalInfo?.github && <p>💻 {data.personalInfo.github}</p>}
                    </div>
                    {data.skills?.length > 0 && (
                        <div className="mt-5">
                            <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70 mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-1.5">{data.skills.map((s, i) => <span key={i} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{s}</span>)}</div>
                        </div>
                    )}
                    {data.languages?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-70 mb-2">Languages</h3>
                            <div className="flex flex-wrap gap-1.5">{data.languages.map((l, i) => <span key={i} className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{l}</span>)}</div>
                        </div>
                    )}
                </div>
                {/* Main content */}
                <div className="col-span-3 pl-6 pt-0">
                    <ResumeBody data={{ ...data, skills: [], languages: [] }} accent={accent} />
                </div>
            </div>
        </div>
    )
}
