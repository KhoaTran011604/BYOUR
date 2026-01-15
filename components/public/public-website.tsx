import type {
  Website,
  WebsiteBlock,
  Service,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
} from "@/lib/types"
import { colorSchemes, getGradient, getPriceGradient } from "@/lib/colors"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

interface PublicWebsiteProps {
  website: Website
  blocks: WebsiteBlock[]
  services: Service[]
  profileName: string | null
  profileAvatar: string | null
}

export function PublicWebsite({ website, blocks, services, profileName, profileAvatar }: PublicWebsiteProps) {
  const { template } = website
  const colors = colorSchemes[website.color_scheme || "warm"]

  const formatPrice = (amount: number | null, type: string) => {
    if (type === "quote") return "Báo giá"
    if (!amount) return "Liên hệ"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  // Filter visible blocks
  const visibleBlocks = blocks.filter((b) => b.is_visible !== false)

  // Get contact block for social links in hero (Grid template)
  const contactBlock = blocks.find((b) => b.block_type === "contact")?.content as ContactContent | undefined

  // ═══════════════════════════════════════════════════════════════════
  // MINIMAL TEMPLATE - Soft, Elegant, Humanized Design
  // ═══════════════════════════════════════════════════════════════════
  if (template === "minimal") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
        {/* Decorative elements */}
        <svg
          className="fixed bottom-20 left-0 w-full h-40 opacity-10 pointer-events-none"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path d="M0,100 Q300,20 600,100 T1200,80" fill="none" stroke={colors.primary} strokeWidth="2" />
        </svg>
        <div className="fixed top-20 right-10 w-96 h-96 rounded-full opacity-40 blur-3xl pointer-events-none" style={{ background: `linear-gradient(to bottom right, ${colors.primary}30, ${colors.secondary}20, transparent)` }} />

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${colors.background}cc`, borderBottom: `1px solid ${colors.border}` }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-medium tracking-wide">{website.handle}.byour.co</span>
            <div className="hidden md:flex gap-8">
              {["Home", "About", "Services", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm transition-colors"
                  style={{ color: colors.textMuted }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Render blocks in order */}
        <div className="pt-20">
          {visibleBlocks.map((block) => {
            switch (block.block_type) {
              case "hero": {
                const content = block.content as HeroContent
                return (
                  <section key={block.id} id="home" className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-20">
                    <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>Portfolio</p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9]">
                      {content.title?.split(" ")[0] || profileName?.split(" ")[0] || "Humanized"}
                    </h1>
                    <h2
                      className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.9]"
                      style={{
                        backgroundImage: getGradient(website.color_scheme || "warm"),
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      {content.title?.split(" ").slice(1).join(" ") || "Design."}
                    </h2>
                    <p className="mt-8 text-lg max-w-xl leading-relaxed" style={{ color: colors.textMuted }}>
                      {content.subtitle || "I transform ideas into beautiful, meaningful digital experiences."}
                    </p>
                    {content.cta_text && (
                      <a
                        href={content.cta_link || "#contact"}
                        className="mt-10 inline-flex items-center gap-2 font-medium hover:gap-4 transition-all"
                        style={{ color: colors.text }}
                      >
                        {content.cta_text}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )}
                  </section>
                )
              }

              case "about": {
                const content = block.content as AboutContent
                return (
                  <section key={block.id} id="about" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto">
                      <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>About</p>
                      <h2 className="text-3xl md:text-4xl font-light mb-8">{content.heading || "Về tôi"}</h2>
                      <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: colors.textMuted }}>
                        {content.description || "Thông tin giới thiệu về bản thân và công việc của bạn."}
                      </p>
                    </div>
                  </section>
                )
              }

              case "services": {
                const content = block.content as ServicesContent
                return (
                  <section key={block.id} id="services" className="py-32 px-6" style={{ backgroundColor: colors.backgroundAlt }}>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>Services</p>
                      <h2 className="text-3xl md:text-4xl font-light mb-4">{content.heading || "Dịch vụ"}</h2>
                      {content.description && (
                        <p className="mb-12" style={{ color: colors.textMuted }}>{content.description}</p>
                      )}
                      <div className="grid gap-6 md:grid-cols-2">
                        {services.map((service, i) => (
                          <div
                            key={service.id}
                            className="group p-8 rounded-2xl hover:shadow-lg transition-all"
                            style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.background }}
                          >
                            <span className="text-xs tracking-wider" style={{ color: colors.textMuted }}>0{i + 1}</span>
                            <h3 className="mt-2 text-xl font-medium">{service.title}</h3>
                            {service.description && (
                              <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.textMuted }}>{service.description}</p>
                            )}
                            <p
                              className="mt-4 font-medium"
                              style={{
                                backgroundImage: getPriceGradient(website.color_scheme || "warm"),
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                color: "transparent",
                              }}
                            >
                              {formatPrice(service.price_amount, service.price_type)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )
              }

              case "contact": {
                const content = block.content as ContactContent
                return (
                  <section key={block.id} id="contact" className="py-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                      <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: colors.textMuted }}>Contact</p>
                      <h2 className="text-3xl md:text-4xl font-light mb-12">{content.heading || "Liên hệ"}</h2>
                      <div className="inline-flex flex-col items-center gap-4">
                        {content.email && (
                          <a
                            href={`mailto:${content.email}`}
                            className="flex items-center gap-3 transition-colors"
                            style={{ color: colors.textMuted }}
                          >
                            <Mail className="h-5 w-5" />
                            {content.email}
                          </a>
                        )}
                        {content.phone && (
                          <a
                            href={`tel:${content.phone}`}
                            className="flex items-center gap-3 transition-colors"
                            style={{ color: colors.textMuted }}
                          >
                            <Phone className="h-5 w-5" />
                            {content.phone}
                          </a>
                        )}
                        {content.address && (
                          <div className="flex items-center gap-3" style={{ color: colors.textMuted }}>
                            <MapPin className="h-5 w-5" />
                            {content.address}
                          </div>
                        )}
                      </div>

                      {content.social_links && Object.values(content.social_links).some((v) => v) && (
                        <div className="flex justify-center gap-6 mt-10">
                          {content.social_links.facebook && (
                            <a href={content.social_links.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.textMuted }}>
                              <Facebook className="h-5 w-5" />
                            </a>
                          )}
                          {content.social_links.instagram && (
                            <a href={content.social_links.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.textMuted }}>
                              <Instagram className="h-5 w-5" />
                            </a>
                          )}
                          {content.social_links.linkedin && (
                            <a href={content.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.textMuted }}>
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                          {content.social_links.twitter && (
                            <a href={content.social_links.twitter} target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.textMuted }}>
                              <Twitter className="h-5 w-5" />
                            </a>
                          )}
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
        </div>

        {/* Footer */}
        <footer className="py-8 px-6" style={{ borderTop: `1px solid ${colors.border}` }}>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: colors.textMuted }}>
            <p>www.{website.handle}.byour.co</p>
            <p>
              © {new Date().getFullYear()} {profileName || website.handle} · Powered by{" "}
              <Link href="/" style={{ color: colors.primary }}>BYOUR</Link>
            </p>
            <p>Stay Creative</p>
          </div>
        </footer>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // EDITORIAL TEMPLATE - Bold, Dark, Professional (Sultan style)
  // ═══════════════════════════════════════════════════════════════════
  if (template === "editorial") {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white">
        {/* Accent sidebar */}
        <div className="fixed top-0 left-0 w-16 md:w-24 h-full z-40" style={{ backgroundColor: colors.primary }} />

        {/* Background watermark */}
        <div className="fixed top-1/4 left-20 md:left-32 text-[20vw] font-black text-white/[0.02] leading-[0.8] tracking-tighter pointer-events-none select-none">
          {(profileName?.split(" ")[0] || website.handle).toUpperCase().slice(0, 4)}
        </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-16 md:left-24 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: colors.primary }}>{website.handle.slice(0, 4)}.</span>
              <span className="text-xs text-white/40 uppercase tracking-wider">creative</span>
            </div>
            <div className="hidden md:flex gap-8">
              {["About", "Work", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* Render blocks in order */}
        <div className="pl-16 md:pl-24 pt-20">
          {visibleBlocks.map((block, blockIndex) => {
            switch (block.block_type) {
              case "hero": {
                const content = block.content as HeroContent
                return (
                  <section key={block.id} id="home" className="min-h-screen pt-20">
                    <div className="min-h-[70vh] flex items-center px-8 md:px-16">
                      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl">
                        {/* Photo placeholder */}
                        <div className="relative aspect-[3/4] bg-stone-800 overflow-hidden">
                          {profileAvatar ? (
                            <img src={profileAvatar} alt={profileName || ""} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-32 h-32 rounded-full bg-stone-700" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
                          {/* Decorative dots */}
                          <div className="absolute bottom-6 right-6 grid grid-cols-4 gap-1">
                            {[...Array(16)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${colors.primary}99` }} />
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <p className="uppercase tracking-[0.3em] text-sm mb-4" style={{ color: colors.primary }}>
                            Breathing in the aroma
                          </p>
                          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            of creativity.
                          </h1>
                          <p className="mt-6 text-white/50 leading-relaxed max-w-md">
                            {content.subtitle || "With years of experience in design, I help businesses stand out and connect with their audience."}
                          </p>
                          {content.cta_text && (
                            <a
                              href={content.cta_link || "#contact"}
                              className="mt-8 inline-flex items-center gap-3 border border-white/20 px-6 py-3 text-sm uppercase tracking-wider hover:bg-white hover:text-[#1A1A1A] transition-all"
                            >
                              {content.cta_text}
                              <ArrowRight className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="px-8 md:px-16 py-12 border-t border-white/10">
                      <div className="flex gap-16">
                        {[
                          { value: "10+", label: "Years Exp." },
                          { value: services.length.toString(), label: "Services" },
                          { value: "50+", label: "Clients" },
                        ].map((stat) => (
                          <div key={stat.label}>
                            <span className="text-4xl font-bold block">{stat.value}</span>
                            <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )
              }

              case "about": {
                const content = block.content as AboutContent
                return (
                  <section key={block.id} id="about" className="py-32 px-8 md:px-16 border-t border-white/10">
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px" style={{ backgroundColor: colors.primary }} />
                        <span className="text-sm uppercase tracking-wider" style={{ color: colors.primary }}>About</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-8">{content.heading || "Về tôi"}</h2>
                      <p className="text-white/60 text-lg leading-relaxed whitespace-pre-line">
                        {content.description || "Thông tin giới thiệu về bản thân và công việc của bạn."}
                      </p>
                    </div>
                  </section>
                )
              }

              case "services": {
                const content = block.content as ServicesContent
                return (
                  <section key={block.id} id="work" className="py-32 px-8 md:px-16 bg-[#141414]">
                    <div className="max-w-6xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px" style={{ backgroundColor: colors.primary }} />
                        <span className="text-sm uppercase tracking-wider" style={{ color: colors.primary }}>Services</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">{content.heading || "Dịch vụ"}</h2>
                      {content.description && (
                        <p className="text-white/50 mb-12 max-w-2xl">{content.description}</p>
                      )}
                      <div className="space-y-0">
                        {services.map((service, i) => (
                          <div
                            key={service.id}
                            className="group py-8 border-b border-white/10 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-8">
                              <div className="flex items-start gap-6">
                                <span className="text-sm" style={{ color: `${colors.primary}80` }}>0{i + 1}</span>
                                <div>
                                  <h3 className="text-xl font-bold transition-colors">
                                    {service.title}
                                  </h3>
                                  {service.description && (
                                    <p className="mt-2 text-white/40 max-w-md">{service.description}</p>
                                  )}
                                </div>
                              </div>
                              <span className="font-bold" style={{ color: colors.primary }}>
                                {formatPrice(service.price_amount, service.price_type)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )
              }

              case "contact": {
                const content = block.content as ContactContent
                return (
                  <section key={block.id} id="contact" className="py-32 px-8 md:px-16 border-t border-white/10">
                    <div className="max-w-4xl">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-px" style={{ backgroundColor: colors.primary }} />
                        <span className="text-sm uppercase tracking-wider" style={{ color: colors.primary }}>Contact</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-12">{content.heading || "Let's work together"}</h2>
                      <div className="space-y-6">
                        {content.email && (
                          <a href={`mailto:${content.email}`} className="flex items-center gap-4 text-lg text-white/60 transition-colors">
                            <Mail className="h-5 w-5" style={{ color: colors.primary }} />
                            {content.email}
                          </a>
                        )}
                        {content.phone && (
                          <a href={`tel:${content.phone}`} className="flex items-center gap-4 text-lg text-white/60 transition-colors">
                            <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                            {content.phone}
                          </a>
                        )}
                        {content.address && (
                          <div className="flex items-center gap-4 text-lg text-white/60">
                            <MapPin className="h-5 w-5" style={{ color: colors.primary }} />
                            {content.address}
                          </div>
                        )}
                      </div>

                      {content.social_links && Object.values(content.social_links).some((v) => v) && (
                        <div className="flex gap-6 mt-12">
                          {content.social_links.facebook && (
                            <a href={content.social_links.facebook} target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors">
                              <Facebook className="h-6 w-6" />
                            </a>
                          )}
                          {content.social_links.instagram && (
                            <a href={content.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors">
                              <Instagram className="h-6 w-6" />
                            </a>
                          )}
                          {content.social_links.linkedin && (
                            <a href={content.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors">
                              <Linkedin className="h-6 w-6" />
                            </a>
                          )}
                          {content.social_links.twitter && (
                            <a href={content.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 transition-colors">
                              <Twitter className="h-6 w-6" />
                            </a>
                          )}
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
        </div>

        {/* Footer */}
        <footer className="pl-16 md:pl-24 py-8 px-8 md:px-16 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/40">
            <p>© {new Date().getFullYear()} {profileName || website.handle}</p>
            <p>
              Powered by{" "}
              <Link href="/" style={{ color: colors.primary }}>BYOUR</Link>
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // GRID TEMPLATE - Playful, Modern, Creative (John Deo style)
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background, color: colors.text }}>
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 border-2 border-dashed rounded-full pointer-events-none" style={{ borderColor: `${colors.border}80` }} />
      <div className="fixed bottom-40 right-20 w-8 h-8 rounded rotate-12 pointer-events-none" style={{ backgroundColor: colors.primary }} />
      <svg className="fixed top-1/3 left-10 w-40 h-60 opacity-20 pointer-events-none" viewBox="0 0 60 80">
        <path d="M5,70 Q30,20 55,40" fill="none" stroke={colors.primary} strokeWidth="1" strokeDasharray="4,4" />
      </svg>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${colors.background}e6`, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors.primary }} />
            <span className="font-semibold">{website.handle}.</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {["Home", "Services", "Projects", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm transition-colors"
                style={{ color: colors.textMuted }}
              >
                {item}
              </a>
            ))}
            <a
              href="#contact"
              className="px-4 py-2 text-white rounded text-sm font-medium transition-colors"
              style={{ backgroundColor: colors.secondary }}
            >
              Hire Me
            </a>
          </div>
        </div>
      </nav>

      {/* Render blocks in order */}
      <div className="pt-20">
        {visibleBlocks.map((block) => {
          switch (block.block_type) {
            case "hero": {
              const content = block.content as HeroContent
              return (
                <section key={block.id} id="home" className="min-h-screen px-6">
                  <div className="max-w-6xl mx-auto py-20">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      {/* Left content */}
                      <div className="md:col-span-1">
                        <p className="text-stone-400 mb-2">Xin chào! Tôi là</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                          {content.title || profileName || "John Deo"}.
                        </h1>

                        {/* Experience badge */}
                        <div className="mt-6 inline-flex items-center gap-2 px-3 py-2 bg-stone-100 rounded-full">
                          <span className="text-2xl font-bold">08</span>
                          <div className="text-xs text-stone-500 leading-tight">
                            <div>Years</div>
                            <div>Experience</div>
                          </div>
                        </div>

                        {/* Social icons */}
                        <div className="mt-6 flex gap-2">
                          {contactBlock?.social_links?.linkedin && (
                            <a href={contactBlock.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center transition-colors" style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                              <Linkedin className="h-4 w-4" />
                            </a>
                          )}
                          {contactBlock?.social_links?.instagram && (
                            <a href={contactBlock.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center transition-colors" style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                              <Instagram className="h-4 w-4" />
                            </a>
                          )}
                          {contactBlock?.social_links?.facebook && (
                            <a href={contactBlock.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center transition-colors" style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                              <Facebook className="h-4 w-4" />
                            </a>
                          )}
                          {contactBlock?.social_links?.twitter && (
                            <a href={contactBlock.social_links.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded flex items-center justify-center transition-colors" style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}>
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Center - Avatar */}
                      <div className="md:col-span-1 flex justify-center">
                        <div className="relative">
                          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden" style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.secondary})` }}>
                            {profileAvatar ? (
                              <img src={profileAvatar} alt={profileName || ""} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-end justify-center pb-4">
                                <div className="w-32 h-32 rounded-full" style={{ backgroundColor: colors.primary }} />
                              </div>
                            )}
                          </div>
                          {/* Decorative dots */}
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-dashed" style={{ borderColor: colors.border }} />
                          <div className="absolute bottom-4 -left-4 grid grid-cols-3 gap-1">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right content */}
                      <div className="md:col-span-1 space-y-4">
                        <p className="leading-relaxed" style={{ color: colors.textMuted }}>
                          {content.subtitle || "I design beautifully simple things and I love what I do."}
                        </p>

                        {/* Rating card */}
                        <div className="p-4 rounded-lg shadow-sm inline-block" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                          <p className="text-xs mb-1" style={{ color: colors.textMuted }}>5k+ Reviews</p>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">4.9</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ color: colors.secondary }}>★</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Script text */}
                        <div className="text-right pt-4">
                          <p className="text-3xl italic" style={{ fontFamily: "Georgia, serif", color: colors.primary }}>
                            Creative
                          </p>
                          <p className="text-lg" style={{ color: colors.textMuted }}>Designer.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )
            }

            case "about": {
              const content = block.content as AboutContent
              return (
                <section key={block.id} id="about" className="py-24 px-6" style={{ backgroundColor: colors.backgroundAlt }}>
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                      <span className="text-sm uppercase tracking-wider" style={{ color: colors.primary }}>About Me</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-6">{content.heading || "Về tôi"}</h2>
                    <p className="text-lg leading-relaxed whitespace-pre-line" style={{ color: colors.textMuted }}>
                      {content.description || "Thông tin giới thiệu về bản thân và công việc của bạn."}
                    </p>
                  </div>
                </section>
              )
            }

            case "services": {
              const content = block.content as ServicesContent
              return (
                <section key={block.id} id="services" className="py-24 px-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary }} />
                      <span className="text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>Services</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{content.heading || "Dịch vụ"}</h2>
                    {content.description && (
                      <p className="mb-12" style={{ color: colors.textMuted }}>{content.description}</p>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {services.map((service, i) => (
                        <div
                          key={service.id}
                          className="group relative p-6 rounded-xl hover:shadow-lg transition-all overflow-hidden"
                          style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.background }}
                        >
                          <div className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to bottom, ${colors.primary}, ${colors.secondary})` }} />
                          <span className="text-xs" style={{ color: colors.textMuted }}>0{i + 1}</span>
                          <h3 className="mt-2 text-lg font-semibold transition-colors">
                            {service.title}
                          </h3>
                          {service.description && (
                            <p className="mt-2 text-sm line-clamp-2" style={{ color: colors.textMuted }}>{service.description}</p>
                          )}
                          <p className="mt-4 font-medium" style={{ color: colors.secondary }}>
                            {formatPrice(service.price_amount, service.price_type)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )
            }

            case "contact": {
              const content = block.content as ContactContent
              return (
                <section key={block.id} id="contact" className="py-24 px-6" style={{ backgroundColor: colors.backgroundAlt }}>
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
                      <span className="text-sm uppercase tracking-wider" style={{ color: colors.primary }}>Contact</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-12">{content.heading || "Liên hệ với tôi"}</h2>
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        {content.email && (
                          <a href={`mailto:${content.email}`} className="flex items-center gap-3 transition-colors" style={{ color: colors.textMuted }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                              <Mail className="h-4 w-4" style={{ color: colors.primary }} />
                            </div>
                            {content.email}
                          </a>
                        )}
                        {content.phone && (
                          <a href={`tel:${content.phone}`} className="flex items-center gap-3 transition-colors" style={{ color: colors.textMuted }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                              <Phone className="h-4 w-4" style={{ color: colors.primary }} />
                            </div>
                            {content.phone}
                          </a>
                        )}
                        {content.address && (
                          <div className="flex items-center gap-3" style={{ color: colors.textMuted }}>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}20` }}>
                              <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                            </div>
                            {content.address}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center">
                        <a
                          href={`mailto:${content.email || ""}`}
                          className="px-8 py-4 text-white rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
                          style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
                        >
                          Let's Work Together
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              )
            }

            default:
              return null
          }
        })}
      </div>

      {/* Wave decoration */}
      <svg className="w-full h-20" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path d="M0,80 Q300,20 600,50 T1200,30 L1200,80 Z" fill={colors.backgroundAlt} />
      </svg>

      {/* Footer */}
      <footer className="py-8 px-6" style={{ backgroundColor: colors.backgroundAlt }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: colors.textMuted }}>
          <p>© {new Date().getFullYear()} {profileName || website.handle}</p>
          <p>
            Powered by{" "}
            <Link href="/" style={{ color: colors.primary }}>BYOUR</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
