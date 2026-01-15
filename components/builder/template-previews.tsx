"use client"

import type { WebsiteTemplate } from "@/lib/types"

interface TemplatePreviewProps {
  template: WebsiteTemplate
  isSelected?: boolean
}

// ═══════════════════════════════════════════════════════════════════
// MINIMAL TEMPLATE - Soft, Elegant, Humanized Design
// Inspired by: Manish Kansara style - lots of whitespace, gradient text
// ═══════════════════════════════════════════════════════════════════
function MinimalPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FFFBF7]">
      {/* Subtle decorative curve */}
      <svg
        className="absolute bottom-12 left-0 w-full h-16 opacity-20"
        viewBox="0 0 200 50"
        preserveAspectRatio="none"
      >
        <path
          d="M0,25 Q50,0 100,25 T200,25"
          fill="none"
          stroke="#E8B4A0"
          strokeWidth="0.5"
        />
      </svg>

      {/* Soft gradient blob */}
      <div className="absolute top-8 right-2 w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 via-rose-50 to-transparent opacity-60 blur-xl" />

      {/* Navigation */}
      <div className="relative flex items-center justify-between px-3 py-2">
        <span className="text-[5px] font-medium tracking-wide text-stone-800">minhanh.co</span>
        <div className="flex gap-2">
          {['Home', 'About', 'Work', 'Contact'].map((item) => (
            <span key={item} className="text-[4px] text-stone-400">{item}</span>
          ))}
        </div>
      </div>

      {/* Hero - Centered elegant typography */}
      <div className="relative px-4 pt-8 pb-4 text-center">
        <p className="text-[4px] text-stone-400 tracking-[0.2em] uppercase mb-1">Portfolio</p>
        <h1 className="text-[20px] font-light tracking-tight text-stone-800 leading-[0.9]">
          Humanized
        </h1>
        <h2
          className="text-[20px] font-light tracking-tight leading-[0.9]"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Design.
        </h2>
      </div>

      {/* Minimal description */}
      <div className="px-4 mt-2">
        <p className="text-[4px] text-stone-500 leading-relaxed max-w-[60%]">
          I transform ideas into beautiful, meaningful digital experiences that connect with people.
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-[4px] text-stone-800 font-medium">View Work</span>
          <span className="text-[5px] text-stone-400">→</span>
        </div>
      </div>

      {/* Play button accent */}
      <div className="absolute bottom-8 right-4 flex items-center gap-1">
        <div className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[3px] border-l-stone-400 border-y-[2px] border-y-transparent ml-0.5" />
        </div>
        <span className="text-[3px] text-stone-400">Play Intro</span>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center justify-between">
        <span className="text-[3px] text-stone-300">www.minhanh.co</span>
        <span className="text-[3px] text-stone-300">Stay Creative</span>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// EDITORIAL TEMPLATE - Bold, Dark, Professional
// Inspired by: Sultan style - dark theme, large typography, warm accents
// ═══════════════════════════════════════════════════════════════════
function EditorialPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1A1A1A]">
      {/* Warm accent block */}
      <div className="absolute top-0 left-0 w-8 h-full bg-[#E6C068]" />

      {/* Background name watermark */}
      <div className="absolute top-12 left-6 text-[28px] font-black text-white/[0.03] leading-[0.8] tracking-tighter">
        MIN<br/>ANH
      </div>

      {/* Navigation */}
      <div className="relative flex items-center justify-between px-3 py-2 ml-8">
        <div className="flex items-center gap-1">
          <span className="text-[6px] font-bold text-[#E6C068]">minh.</span>
          <span className="text-[4px] text-white/40 uppercase tracking-wider">creative</span>
        </div>
        <div className="flex gap-2">
          {['About', 'Work', 'Contact'].map((item) => (
            <span key={item} className="text-[4px] text-white/50">{item}</span>
          ))}
        </div>
      </div>

      {/* Hero section with photo placeholder */}
      <div className="relative ml-8 px-3 pt-4">
        <div className="flex gap-3">
          {/* Photo area */}
          <div className="relative w-14 h-18 bg-stone-800 overflow-hidden">
            {/* Silhouette placeholder */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-700" />
            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-full bg-stone-700" />
            {/* Decorative dots */}
            <div className="absolute bottom-1 right-1 grid grid-cols-3 gap-px">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 rounded-full bg-[#E6C068]/60" />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pt-2">
            <p className="text-[4px] text-[#E6C068] uppercase tracking-[0.2em] mb-1">
              Breathing in the aroma
            </p>
            <h2 className="text-[8px] font-bold text-white leading-tight">
              of creativity.
            </h2>
            <p className="text-[3px] text-white/40 mt-1.5 leading-relaxed">
              With over 10 years experience in brand design, I help businesses stand out and connect.
            </p>
            <div className="mt-2 inline-flex items-center gap-1 border border-white/20 px-1.5 py-0.5">
              <span className="text-[3px] text-white/60 uppercase tracking-wider">Learn More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="absolute bottom-8 left-8 right-0 px-3">
        <div className="flex gap-4">
          {[
            { value: '10+', label: 'Years Exp.' },
            { value: '150+', label: 'Projects' },
            { value: '50+', label: 'Clients' },
          ].map((stat) => (
            <div key={stat.label}>
              <span className="text-[8px] font-bold text-white block">{stat.value}</span>
              <span className="text-[3px] text-white/40 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-8 right-0 h-px bg-gradient-to-r from-[#E6C068]/50 via-white/10 to-transparent" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// GRID TEMPLATE - Playful, Modern, Creative
// Inspired by: John Deo style - light bg, shapes, script fonts, dots
// ═══════════════════════════════════════════════════════════════════
function GridPreview() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#FDFBF9]">
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-12 h-12 border-2 border-dashed border-stone-200 rounded-full" />
      <div className="absolute top-20 right-2 w-3 h-3 bg-[#2D5A4A] rounded-sm rotate-12" />

      {/* Dotted curved line */}
      <svg className="absolute top-16 left-2 w-16 h-20 opacity-40" viewBox="0 0 60 80">
        <path
          d="M5,70 Q30,20 55,40"
          fill="none"
          stroke="#2D5A4A"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      </svg>

      {/* Navigation */}
      <div className="relative flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#2D5A4A] rounded-sm" />
          <span className="text-[5px] font-semibold text-stone-800">Deo.</span>
        </div>
        <div className="flex items-center gap-2">
          {['Home', 'Services', 'Projects', 'Contact'].map((item) => (
            <span key={item} className="text-[4px] text-stone-500">{item}</span>
          ))}
          <div className="px-1.5 py-0.5 bg-[#E6A84D] rounded-sm">
            <span className="text-[4px] text-white font-medium">Download CV</span>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative px-3 pt-4">
        <div className="flex items-start gap-3">
          {/* Left text */}
          <div className="flex-1 pt-4">
            <p className="text-[5px] text-stone-400 mb-0.5">Hy! I Am</p>
            <h1 className="text-[14px] font-bold text-stone-800 leading-[0.95] tracking-tight">
              John Deo.
            </h1>

            {/* Stats badge */}
            <div className="mt-3 flex items-center gap-1">
              <div className="flex items-center gap-0.5 px-1 py-0.5 bg-stone-100 rounded-full">
                <span className="text-[8px] font-bold text-stone-800">08</span>
                <div className="flex flex-col">
                  <span className="text-[3px] text-stone-500 leading-tight">Years</span>
                  <span className="text-[3px] text-stone-500 leading-tight">Experience</span>
                </div>
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-2 flex gap-1">
              {['in', 'be', 'dr', 'tw'].map((icon) => (
                <div key={icon} className="w-3 h-3 rounded-sm border border-stone-200 flex items-center justify-center">
                  <span className="text-[4px] text-stone-400">{icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Center photo */}
          <div className="relative">
            {/* Yellow circle bg */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#F7D87A] to-[#E6A84D] overflow-hidden">
              {/* Person silhouette */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4956A]" />
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-14 h-10 rounded-t-full bg-[#E6A84D]" />
            </div>
            {/* Decorative dots around */}
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full border border-dashed border-stone-300" />
            <div className="absolute bottom-2 -left-2">
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-0.5 h-0.5 rounded-full bg-[#2D5A4A]" />
                ))}
              </div>
            </div>
          </div>

          {/* Right info cards */}
          <div className="flex-1 pt-2 space-y-1.5">
            <p className="text-[3px] text-stone-500 leading-relaxed">
              I design beautifully simple things and I love what I do.
            </p>

            {/* Rating card */}
            <div className="p-1 bg-white rounded border border-stone-100 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="text-[3px] text-stone-400">5k Reviews on</span>
              </div>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-[7px] font-bold text-stone-800">0910</span>
                <div className="flex gap-px">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[4px] text-yellow-500">★</span>
                  ))}
                </div>
                <span className="text-[4px] text-stone-600 font-medium">4.9</span>
              </div>
            </div>

            {/* Script text */}
            <div className="text-right">
              <p
                className="text-[10px] text-[#2D5A4A] italic"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Creative
              </p>
              <p className="text-[6px] text-stone-400 -mt-0.5">Designer.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <svg className="absolute bottom-0 left-0 w-full h-8" viewBox="0 0 200 30" preserveAspectRatio="none">
        <path
          d="M0,30 Q50,10 100,20 T200,15 L200,30 Z"
          fill="#F5F0E8"
        />
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// MAIN EXPORT - Template Preview Component
// ═══════════════════════════════════════════════════════════════════
export function TemplatePreview({ template, isSelected }: TemplatePreviewProps) {
  return (
    <div
      className={`
        relative aspect-[9/16] w-full rounded-lg overflow-hidden shadow-lg
        transition-all duration-300 transform
        ${isSelected
          ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-[1.02]'
          : 'ring-1 ring-border hover:shadow-xl hover:scale-[1.01]'
        }
      `}
    >
      {template === 'minimal' && <MinimalPreview />}
      {template === 'editorial' && <EditorialPreview />}
      {template === 'grid' && <GridPreview />}
    </div>
  )
}

// Export individual previews for flexibility
export { MinimalPreview, EditorialPreview, GridPreview }
