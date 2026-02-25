import React from 'react'
import ResumeBody, { ContactLine } from './ResumeBody'

export default function CreativeSplit({ data, colors }) {
    return (
        <div className="text-sm leading-relaxed">
            <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2 bg-indigo-600 text-white -m-8 p-6 min-h-full">
                    <h1 className="text-xl font-bold mb-1">{data.personalInfo?.fullName || 'Your Name'}</h1>
                    {data.personalInfo?.jobTitle && <p className="text-xs opacity-90 mb-4">{data.personalInfo.jobTitle}</p>}
                    <div className="text-xs opacity-80 space-y-1">
                        {data.personalInfo?.email && <p>✉ {data.personalInfo.email}</p>}
                        {data.personalInfo?.phone && <p>☎ {data.personalInfo.phone}</p>}
                        {data.personalInfo?.location && <p>📍 {data.personalInfo.location}</p>}
                        {data.personalInfo?.linkedin && <p>🔗 {data.personalInfo.linkedin}</p>}
                        {data.personalInfo?.github && <p>💻 {data.personalInfo.github}</p>}
                    </div>
                    {data.skills?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-xs font-bold tracking-wider mb-1 opacity-80">SKILLS</h3>
                            <div className="flex flex-wrap gap-1">{data.skills.map((s, i) => <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded">{s}</span>)}</div>
                        </div>
                    )}
                    {data.languages?.length > 0 && (
                        <div className="mt-3">
                            <h3 className="text-xs font-bold tracking-wider mb-1 opacity-80">LANGUAGES</h3>
                            <div className="flex flex-wrap gap-1">{data.languages.map((l, i) => <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded">{l}</span>)}</div>
                        </div>
                    )}
                </div>
                <div className="col-span-3 pt-0">
                    <ResumeBody data={{ ...data, skills: [], languages: [] }} accent="#4f46e5" />
                </div>
            </div>
        </div>
    )
}
