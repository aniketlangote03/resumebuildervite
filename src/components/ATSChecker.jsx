import React from 'react'
import { scoreATS } from '../utils/atsChecker'

export default function ATSChecker({ data }) {
  const { score, feedback } = scoreATS(data)

  const barColor = score > 75 ? '#16a34a' : score > 50 ? '#ca8a04' : '#dc2626'
  const label = score > 75 ? 'Great' : score > 50 ? 'Fair' : 'Needs Work'

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-bold text-lg mb-4">ATS Score</h3>
      <div className="text-center mb-3">
        <span className="text-4xl font-bold" style={{ color: barColor }}>{score}</span>
        <span className="text-sm text-gray-500 ml-1">/ 100</span>
        <p className="text-sm font-medium mt-1" style={{ color: barColor }}>{label}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: barColor }}
        />
      </div>

      {feedback.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700">Suggestions to improve:</p>
          {feedback.map((item, i) => (
            <p key={i} className="text-sm text-gray-600">• {item}</p>
          ))}
        </div>
      )}

      {score === 100 && (
        <p className="text-sm text-green-600 font-semibold mt-3">🎉 Your resume looks great for ATS systems!</p>
      )}
    </div>
  )
}
