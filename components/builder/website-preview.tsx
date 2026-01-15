"use client"

import type {
  WebsiteBlock,
  Service,
  WebsiteTemplate,
  ColorScheme,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
} from "@/lib/types"
import { colorSchemes, getGradient, getPriceGradient } from "@/lib/colors"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react"

interface WebsitePreviewProps {
  blocks: WebsiteBlock[]
  services: Service[]
  template: WebsiteTemplate
  colorScheme: ColorScheme
  scale?: number
  profileName?: string | null
  profileAvatar?: string | null
}

export function WebsitePreview({
  blocks,
  services,
  template,
  colorScheme,
  scale = 1,
  profileName,
  profileAvatar,
}: WebsitePreviewProps) {
  const visibleBlocks = blocks.filter((b) => b.is_visible)
  const colors = colorSchemes[colorScheme]

  const formatPrice = (amount: number | null, type: string) => {
    if (type === "quote") return "Báo giá"
    if (!amount) return "Liên hệ"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  // ═══════════════════════════════════════════════════════════════════
  // MINIMAL TEMPLATE - Soft, Elegant, Humanized Design
  // ═══════════════════════════════════════════════════════════════════
  if (template === "minimal") {
    return (
      <div
        className="min-h-full"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", backgroundColor: colors.background, color: colors.text }}
      >
        {/* Decorative elements */}
        <svg
          className="absolute bottom-20 left-0 w-full h-20 opacity-10 pointer-events-none"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
        >
          <path d="M0,40 Q100,10 200,40 T400,30" fill="none" stroke={colors.primary} strokeWidth="1" />
        </svg>
        <div className="absolute top-10 right-4 w-32 h-32 rounded-full opacity-40 blur-2xl pointer-events-none" style={{ background: `linear-gradient(to bottom right, ${colors.primary}30, ${colors.secondary}20, transparent)` }} />

        {/* Navigation */}
        <nav className="sticky top-0 z-10 backdrop-blur-sm" style={{ backgroundColor: `${colors.background}cc`, borderBottom: `1px solid ${colors.border}` }}>
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide" style={{ color: colors.textMuted }}>portfolio</span>
            <div className="flex gap-3">
              {["Home", "About", "Services"].map((item) => (
                <span key={item} className="text-[10px]" style={{ color: colors.textMuted }}>{item}</span>
              ))}
            </div>
          </div>
        </nav>

        {/* Render blocks in order */}
        {visibleBlocks.map((block) => {
          switch (block.block_type) {
            case "hero": {
              const content = block.content as HeroContent
              return (
                <section key={block.id} className="py-12 px-4 text-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: colors.textMuted }}>Portfolio</p>
                  <h1 className="text-2xl font-light tracking-tight leading-[0.95]">
                    {content.title?.split(" ")[0] || profileName?.split(" ")[0] || "Humanized"}
                  </h1>
                  <h2
                    className="text-2xl font-light tracking-tight leading-[0.95]"
                    style={{
                      backgroundImage: getGradient(colorScheme),
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    {content.title?.split(" ").slice(1).join(" ") || "Design."}
                  </h2>
                  <p className="mt-4 text-xs max-w-xs mx-auto leading-relaxed" style={{ color: colors.textMuted }}>
                    {content.subtitle || "I transform ideas into beautiful experiences."}
                  </p>
                  {content.cta_text && (
                    <a className="mt-4 inline-flex items-center gap-1 text-xs font-medium" style={{ color: colors.text }}>
                      {content.cta_text}
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </section>
              )
            }

            case "about": {
              const content = block.content as AboutContent
              return (
                <section key={block.id} className="py-10 px-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: colors.textMuted }}>About</p>
                  <h2 className="text-lg font-light mb-3">{content.heading || "Về tôi"}</h2>
                  <p className="text-xs leading-relaxed" style={{ color: colors.textMuted }}>
                    {content.description || "Thông tin giới thiệu."}
                  </p>
                </section>
              )
            }

            case "services": {
              const content = block.content as ServicesContent
              return (
                <section key={block.id} className="py-10 px-4" style={{ backgroundColor: colors.backgroundAlt }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: colors.textMuted }}>Services</p>
                  <h2 className="text-lg font-light mb-3">{content.heading || "Dịch vụ"}</h2>
                  <div className="grid gap-3 grid-cols-2">
                    {services.length > 0 ? (
                      services.map((service, i) => (
                        <div key={service.id} className="p-3 rounded-lg" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.background }}>
                          <span className="text-[8px]" style={{ color: colors.textMuted }}>0{i + 1}</span>
                          <h3 className="text-xs font-medium mt-1">{service.title}</h3>
                          {service.description && (
                            <p className="mt-1 text-[10px] line-clamp-2" style={{ color: colors.textMuted }}>{service.description}</p>
                          )}
                          <p
                            className="mt-2 text-[10px] font-medium"
                            style={{
                              backgroundImage: getPriceGradient(colorScheme),
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              color: "transparent",
                            }}
                          >
                            {formatPrice(service.price_amount, service.price_type)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs col-span-2" style={{ color: colors.textMuted }}>Chưa có dịch vụ</p>
                    )}
                  </div>
                </section>
              )
            }

            case "contact": {
              const content = block.content as ContactContent
              return (
                <section key={block.id} className="py-10 px-4 text-center">
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: colors.textMuted }}>Contact</p>
                  <h2 className="text-lg font-light mb-4">{content.heading || "Liên hệ"}</h2>
                  <div className="space-y-2 text-xs" style={{ color: colors.textMuted }}>
                    {content.email && (
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="h-3 w-3" />
                        {content.email}
                      </div>
                    )}
                    {content.phone && (
                      <div className="flex items-center justify-center gap-2">
                        <Phone className="h-3 w-3" />
                        {content.phone}
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            default:
              return null
          }
        })}

        {/* Footer */}
        <footer className="py-4 px-4 text-center" style={{ borderTop: `1px solid ${colors.border}` }}>
          <p className="text-[8px]" style={{ color: colors.textMuted }}>Stay Creative</p>
        </footer>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // EDITORIAL TEMPLATE - Bold, Dark, Professional (Sultan style)
  // ═══════════════════════════════════════════════════════════════════
  if (template === "editorial") {
    return (
      <div
        className="min-h-full bg-[#1A1A1A] text-white relative"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {/* Accent sidebar */}
        <div className="absolute top-0 left-0 w-6 h-full" style={{ backgroundColor: colors.primary }} />

        {/* Background watermark */}
        <div className="absolute top-16 left-4 text-[60px] font-black text-white/[0.03] leading-[0.8] tracking-tighter pointer-events-none">
          {(profileName?.split(" ")[0] || "NAME").toUpperCase().slice(0, 4)}
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-10 bg-[#1A1A1A]/90 backdrop-blur-sm ml-6">
          <div className="px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold" style={{ color: colors.primary }}>port.</span>
              <span className="text-[8px] text-white/40 uppercase">creative</span>
            </div>
            <div className="flex gap-2">
              {["About", "Work"].map((item) => (
                <span key={item} className="text-[10px] text-white/50">{item}</span>
              ))}
            </div>
          </div>
        </nav>

        {/* Render blocks in order */}
        {visibleBlocks.map((block) => {
          switch (block.block_type) {
            case "hero": {
              const content = block.content as HeroContent
              return (
                <section key={block.id} className="ml-6 px-3 py-8">
                  <div className="flex gap-3">
                    {/* Photo placeholder */}
                    <div className="relative w-20 h-24 bg-stone-800 overflow-hidden flex-shrink-0">
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-stone-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                      {/* Dots */}
                      <div className="absolute bottom-1 right-1 grid grid-cols-3 gap-px">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: `${colors.primary}80` }} />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-[8px] uppercase tracking-[0.15em] mb-1" style={{ color: colors.primary }}>
                        Breathing in the aroma
                      </p>
                      <h1 className="text-lg font-bold leading-tight">of creativity.</h1>
                      <p className="mt-2 text-[10px] text-white/50 leading-relaxed">
                        {content.subtitle || "With years of experience in design."}
                      </p>
                      {content.cta_text && (
                        <div className="mt-3 inline-flex items-center gap-1 border border-white/20 px-2 py-1">
                          <span className="text-[8px] text-white/60 uppercase tracking-wider">{content.cta_text}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-6 pt-4 border-t border-white/10">
                    {[
                      { value: "10+", label: "Years" },
                      { value: String(services.length || 0), label: "Services" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <span className="text-lg font-bold block">{stat.value}</span>
                        <span className="text-[8px] text-white/40 uppercase">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )
            }

            case "about": {
              const content = block.content as AboutContent
              return (
                <section key={block.id} className="ml-6 px-3 py-6 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px" style={{ backgroundColor: colors.primary }} />
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>About</span>
                  </div>
                  <h2 className="text-base font-bold mb-2">{content.heading || "Về tôi"}</h2>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    {content.description || "Thông tin giới thiệu."}
                  </p>
                </section>
              )
            }

            case "services": {
              const content = block.content as ServicesContent
              return (
                <section key={block.id} className="ml-6 px-3 py-6 bg-[#141414]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px" style={{ backgroundColor: colors.primary }} />
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>Services</span>
                  </div>
                  <h2 className="text-base font-bold mb-3">{content.heading || "Dịch vụ"}</h2>
                  <div className="space-y-0">
                    {services.length > 0 ? (
                      services.map((service, i) => (
                        <div key={service.id} className="py-3 border-b border-white/10 flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-[8px]" style={{ color: `${colors.primary}80` }}>0{i + 1}</span>
                            <div>
                              <h3 className="text-xs font-bold">{service.title}</h3>
                              {service.description && (
                                <p className="mt-1 text-[9px] text-white/40 line-clamp-1">{service.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] font-bold whitespace-nowrap" style={{ color: colors.primary }}>
                            {formatPrice(service.price_amount, service.price_type)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-white/40">Chưa có dịch vụ</p>
                    )}
                  </div>
                </section>
              )
            }

            case "contact": {
              const content = block.content as ContactContent
              return (
                <section key={block.id} className="ml-6 px-3 py-6 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px" style={{ backgroundColor: colors.primary }} />
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>Contact</span>
                  </div>
                  <h2 className="text-base font-bold mb-3">{content.heading || "Liên hệ"}</h2>
                  <div className="space-y-2">
                    {content.email && (
                      <div className="flex items-center gap-2 text-[10px] text-white/60">
                        <Mail className="h-3 w-3" style={{ color: colors.primary }} />
                        {content.email}
                      </div>
                    )}
                    {content.phone && (
                      <div className="flex items-center gap-2 text-[10px] text-white/60">
                        <Phone className="h-3 w-3" style={{ color: colors.primary }} />
                        {content.phone}
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            default:
              return null
          }
        })}

        {/* Footer */}
        <footer className="ml-6 py-3 px-3 border-t border-white/10">
          <p className="text-[8px] text-white/30">Powered by BYOUR</p>
        </footer>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // GRID TEMPLATE - Playful, Modern, Creative (John Deo style)
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div
      className="min-h-full relative"
      style={{ transform: `scale(${scale})`, transformOrigin: "top left", backgroundColor: colors.background, color: colors.text }}
    >
      {/* Decorative elements */}
      <div className="absolute top-8 left-4 w-16 h-16 border border-dashed rounded-full pointer-events-none" style={{ borderColor: `${colors.border}80` }} />
      <div className="absolute top-32 right-2 w-2 h-2 rounded rotate-12 pointer-events-none" style={{ backgroundColor: colors.primary }} />
      <svg className="absolute top-20 left-2 w-12 h-20 opacity-20 pointer-events-none" viewBox="0 0 60 80">
        <path d="M5,70 Q30,20 55,40" fill="none" stroke={colors.primary} strokeWidth="1" strokeDasharray="3,3" />
      </svg>

      {/* Navigation */}
      <nav className="sticky top-0 z-10 backdrop-blur-sm" style={{ backgroundColor: `${colors.background}e6`, borderBottom: `1px solid ${colors.border}` }}>
        <div className="px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded" style={{ backgroundColor: colors.primary }} />
            <span className="text-xs font-semibold">Deo.</span>
          </div>
          <div className="flex items-center gap-2">
            {["Home", "Services"].map((item) => (
              <span key={item} className="text-[10px]" style={{ color: colors.textMuted }}>{item}</span>
            ))}
            <div className="px-2 py-1 rounded" style={{ backgroundColor: colors.secondary }}>
              <span className="text-[8px] text-white font-medium">Hire Me</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Render blocks in order */}
      {visibleBlocks.map((block) => {
        switch (block.block_type) {
          case "hero": {
            const content = block.content as HeroContent
            return (
              <section key={block.id} className="px-3 py-8">
                <div className="flex items-start gap-3">
                  {/* Left */}
                  <div className="flex-1">
                    <p className="text-[10px] text-stone-400 mb-1">Xin chào! Tôi là</p>
                    <h1 className="text-xl font-bold tracking-tight leading-[1.1]">
                      {content.title || profileName || "John Deo"}.
                    </h1>

                    {/* Badge */}
                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-stone-100 rounded-full">
                      <span className="text-sm font-bold">08</span>
                      <div className="text-[7px] text-stone-500 leading-tight">
                        <div>Years</div>
                        <div>Exp</div>
                      </div>
                    </div>

                    {/* Social icons */}
                    <div className="mt-3 flex gap-1">
                      {["in", "ig", "fb"].map((icon) => (
                        <div key={icon} className="w-5 h-5 rounded border border-stone-200 flex items-center justify-center">
                          <span className="text-[7px] text-stone-400">{icon}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden" style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.secondary})` }}>
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-end justify-center pb-1">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: colors.primary }} />
                        </div>
                      )}
                    </div>
                    {/* Dots */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-dashed" style={{ borderColor: colors.border }} />
                    <div className="absolute bottom-1 -left-1 grid grid-cols-3 gap-px">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.primary }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right content */}
                <div className="mt-4">
                  <p className="text-[10px] leading-relaxed" style={{ color: colors.textMuted }}>
                    {content.subtitle || "I design beautifully simple things."}
                  </p>

                  {/* Rating */}
                  <div className="mt-3 inline-block p-2 rounded shadow-sm" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                    <p className="text-[7px]" style={{ color: colors.textMuted }}>5k+ Reviews</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">4.9</span>
                      <div className="flex gap-px">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-[8px]" style={{ color: colors.secondary }}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Script */}
                  <div className="mt-3 text-right">
                    <p className="text-lg italic" style={{ fontFamily: "Georgia, serif", color: colors.primary }}>
                      Creative
                    </p>
                    <p className="text-xs -mt-1" style={{ color: colors.textMuted }}>Designer.</p>
                  </div>
                </div>
              </section>
            )
          }

          case "about": {
            const content = block.content as AboutContent
            return (
              <section key={block.id} className="px-3 py-6" style={{ backgroundColor: colors.backgroundAlt }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>About</span>
                </div>
                <h2 className="text-base font-bold mb-2">{content.heading || "Về tôi"}</h2>
                <p className="text-[10px] leading-relaxed" style={{ color: colors.textMuted }}>
                  {content.description || "Thông tin giới thiệu."}
                </p>
              </section>
            )
          }

          case "services": {
            const content = block.content as ServicesContent
            return (
              <section key={block.id} className="px-3 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.secondary }}>Services</span>
                </div>
                <h2 className="text-base font-bold mb-3">{content.heading || "Dịch vụ"}</h2>
                <div className="grid gap-2 grid-cols-2">
                  {services.length > 0 ? (
                    services.map((service, i) => (
                      <div key={service.id} className="relative p-3 rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.background }}>
                        <div className="absolute top-0 left-0 w-0.5 h-full opacity-0 hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})` }} />
                        <span className="text-[7px]" style={{ color: colors.textMuted }}>0{i + 1}</span>
                        <h3 className="mt-1 text-[11px] font-semibold">{service.title}</h3>
                        {service.description && (
                          <p className="mt-1 text-[9px] line-clamp-2" style={{ color: colors.textMuted }}>{service.description}</p>
                        )}
                        <p className="mt-2 text-[10px] font-medium" style={{ color: colors.secondary }}>
                          {formatPrice(service.price_amount, service.price_type)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] col-span-2" style={{ color: colors.textMuted }}>Chưa có dịch vụ</p>
                  )}
                </div>
              </section>
            )
          }

          case "contact": {
            const content = block.content as ContactContent
            return (
              <section key={block.id} className="px-3 py-6" style={{ backgroundColor: colors.backgroundAlt }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.primary }}>Contact</span>
                </div>
                <h2 className="text-base font-bold mb-3">{content.heading || "Liên hệ"}</h2>
                <div className="space-y-2">
                  {content.email && (
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: colors.textMuted }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                        <Mail className="h-2.5 w-2.5" style={{ color: colors.primary }} />
                      </div>
                      {content.email}
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-center gap-2 text-[10px]" style={{ color: colors.textMuted }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                        <Phone className="h-2.5 w-2.5" style={{ color: colors.primary }} />
                      </div>
                      {content.phone}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 px-3 py-2 text-white rounded text-center" style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}>
                  <span className="text-[10px] font-medium">Let's Work Together →</span>
                </div>
              </section>
            )
          }

          default:
            return null
        }
      })}

      {/* Wave */}
      <svg className="w-full h-6" viewBox="0 0 400 24" preserveAspectRatio="none">
        <path d="M0,24 Q100,8 200,16 T400,10 L400,24 Z" fill={colors.backgroundAlt} />
      </svg>

      {/* Footer */}
      <footer className="py-3 px-3 text-center" style={{ backgroundColor: colors.backgroundAlt }}>
        <p className="text-[8px]" style={{ color: colors.textMuted }}>Powered by BYOUR</p>
      </footer>
    </div>
  )
}
