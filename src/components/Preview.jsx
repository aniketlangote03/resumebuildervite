import React from 'react'
import Minimalist from './templates/Minimalist'
import ModernBlue from './templates/ModernBlue'
import BoldDark from './templates/BoldDark'
import CreativeSplit from './templates/CreativeSplit'
import CorporateGray from './templates/CorporateGray'
import ElegantSerif from './templates/ElegantSerif'
import GradientNeon from './templates/GradientNeon'
import MonochromeZigzag from './templates/MonochromeZigzag'
import ProfessionalPhoto from './templates/ProfessionalPhoto'
import ExecutivePortrait from './templates/ExecutivePortrait'
import CreativeProfile from './templates/CreativeProfile'
import ModernMinimalPhoto from './templates/ModernMinimalPhoto'
import TechStartup from './templates/TechStartup'

const TEMPLATE_MAP = {
  'Minimalist': Minimalist,
  'Modern Blue': ModernBlue,
  'Bold Dark': BoldDark,
  'Creative Split': CreativeSplit,
  'Corporate Gray': CorporateGray,
  'Elegant Serif': ElegantSerif,
  'Gradient Neon': GradientNeon,
  'Monochrome Zigzag': MonochromeZigzag,
  'Professional Photo': ProfessionalPhoto,
  'Executive Portrait': ExecutivePortrait,
  'Creative Profile': CreativeProfile,
  'Modern Minimal Photo': ModernMinimalPhoto,
  'Tech Startup': TechStartup,
}

export default function Preview({ data, template, colors, font }) {
  const TemplateComponent = TEMPLATE_MAP[template] || Minimalist

  return (
    <div className="sticky top-20 h-fit">
      {/* A4-like container with shadow */}
      <div
        id="resume-preview"
        className="bg-white rounded-lg shadow-xl p-8 overflow-auto max-h-[85vh] border border-gray-100"
        style={{
          fontFamily: font || 'Inter, sans-serif',
          aspectRatio: '210 / 297',
          minHeight: '400px',
        }}
      >
        <TemplateComponent data={data} colors={colors} />
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-2">Live Preview · {template || 'Minimalist'}</p>
    </div>
  )
}
