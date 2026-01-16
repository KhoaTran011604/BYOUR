"use client"

import type {
  WebsiteBlock,
  Service,
  WebsiteTemplate,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
  CreativeContent,
  CreativeItem,
} from "@/lib/types"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight, ExternalLink } from "lucide-react"

interface WebsitePreviewProps {
  blocks: WebsiteBlock[]
  services: Service[]
  template: WebsiteTemplate
  scale?: number
  profileName?: string | null
  profileAvatar?: string | null
}

export function WebsitePreview({
  blocks,
  services,
  template,
  scale = 1,
  profileName,
  profileAvatar,
}: WebsitePreviewProps) {
  const visibleBlocks = blocks.filter((b) => b.is_visible)

  const formatPrice = (amount: number | null, type: string) => {
    if (type === "quote") return "Quote"
    if (!amount) return "Contact"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const renderCreativeItem = (item: CreativeItem, variant: "minimal" | "editorial" | "grid") => {
    const spacerSizes = { small: "h-2", medium: "h-4", large: "h-8" }
    const headingSizes = {
      large: "text-lg font-bold",
      medium: "text-base font-bold",
      small: "text-sm font-semibold",
    }

    switch (item.type) {
      case "heading":
        return (
          <h2
            className={`${headingSizes[item.heading_size || "medium"]} mb-2 ${
              variant === "editorial" ? "text-white" : "text-stone-800"
            }`}
          >
            {item.heading_text || ""}
          </h2>
        )

      case "image":
        return item.image_url ? (
          <img
            src={item.image_url}
            alt={item.image_alt || ""}
            className="w-full rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-24 bg-stone-200 rounded-lg flex items-center justify-center">
            <span className="text-[10px] text-stone-400">No image</span>
          </div>
        )

      case "link":
        return (
          <a
            href={item.link_url || "#"}
            className={`flex items-center gap-1 text-xs ${
              variant === "editorial" ? "text-[#E6C068]" : variant === "grid" ? "text-[#2D5A4A]" : "text-stone-600"
            } hover:underline`}
          >
            <ExternalLink className="h-3 w-3" />
            {item.link_text || "Link"}
          </a>
        )

      case "button":
        const buttonStyles = {
          primary:
            variant === "editorial"
              ? "bg-[#E6C068] text-[#1A1A1A]"
              : variant === "grid"
                ? "bg-[#2D5A4A] text-white"
                : "bg-stone-800 text-white",
          secondary:
            variant === "editorial"
              ? "bg-white/10 text-white"
              : variant === "grid"
                ? "bg-[#E6A84D] text-white"
                : "bg-stone-100 text-stone-800",
          outline:
            variant === "editorial"
              ? "border border-[#E6C068] text-[#E6C068]"
              : variant === "grid"
                ? "border border-[#2D5A4A] text-[#2D5A4A]"
                : "border border-stone-300 text-stone-600",
        }
        return (
          <a
            href={item.button_url || "#"}
            className={`inline-block px-3 py-1.5 rounded text-[10px] font-medium ${buttonStyles[item.button_style || "primary"]}`}
          >
            {item.button_text || "Button"}
          </a>
        )

      case "text":
        return (
          <p className={`text-[10px] leading-relaxed ${variant === "editorial" ? "text-white/60" : "text-stone-600"}`}>
            {item.text_content || ""}
          </p>
        )

      case "divider":
        return (
          <hr
            className={`border-t ${
              variant === "editorial" ? "border-white/10" : variant === "grid" ? "border-stone-200" : "border-stone-100"
            }`}
          />
        )

      case "spacer":
        return <div className={spacerSizes[item.spacer_size || "medium"]} />

      default:
        return null
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MINIMAL TEMPLATE - Soft, Elegant, Humanized Design
  // ═══════════════════════════════════════════════════════════════════
  if (template === "minimal") {
    return (
      <div
        className="min-h-full bg-[#FFFBF7] text-stone-800"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {/* Decorative elements */}
        <svg
          className="absolute bottom-20 left-0 w-full h-20 opacity-10 pointer-events-none"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
        >
          <path d="M0,40 Q100,10 200,40 T400,30" fill="none" stroke="#E8B4A0" strokeWidth="1" />
        </svg>
        <div className="absolute top-10 right-4 w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 via-rose-50 to-transparent opacity-40 blur-2xl pointer-events-none" />

        {/* Navigation */}
        <nav className="sticky top-0 z-10 bg-[#FFFBF7]/80 backdrop-blur-sm border-b border-stone-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-stone-600">portfolio</span>
            <div className="flex gap-3">
              {["Home", "About", "Services"].map((item) => (
                <span key={item} className="text-[10px] text-stone-400">{item}</span>
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
                  <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mb-2">Portfolio</p>
                  <h1 className="text-2xl font-light tracking-tight leading-[0.95]">
                    {content.title?.split(" ")[0] || profileName?.split(" ")[0] || "Humanized"}
                  </h1>
                  <h2
                    className="text-2xl font-light tracking-tight leading-[0.95]"
                    style={{
                      background: "linear-gradient(135deg, #F59E0B 0%, #EC4899 50%, #8B5CF6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {content.title?.split(" ").slice(1).join(" ") || "Design."}
                  </h2>
                  <p className="mt-4 text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                    {content.subtitle || "I transform ideas into beautiful experiences."}
                  </p>
                  {content.cta_text && (
                    <a className="mt-4 inline-flex items-center gap-1 text-xs text-stone-700 font-medium">
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
                  <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mb-2">About</p>
                  <h2 className="text-lg font-light mb-3">{content.heading || "About me"}</h2>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {content.description || "Introduction information."}
                  </p>
                </section>
              )
            }

            case "services": {
              const content = block.content as ServicesContent
              return (
                <section key={block.id} className="py-10 px-4 bg-white/50">
                  <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mb-2">Services</p>
                  <h2 className="text-lg font-light mb-3">{content.heading || "Services"}</h2>
                  <div className="grid gap-3 grid-cols-2">
                    {services.length > 0 ? (
                      services.map((service, i) => (
                        <div key={service.id} className="p-3 rounded-lg border border-stone-100 bg-white">
                          <span className="text-[8px] text-stone-300">0{i + 1}</span>
                          <h3 className="text-xs font-medium mt-1">{service.title}</h3>
                          {service.description && (
                            <p className="mt-1 text-[10px] text-stone-500 line-clamp-2">{service.description}</p>
                          )}
                          <p
                            className="mt-2 text-[10px] font-medium"
                            style={{
                              background: "linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            {formatPrice(service.price_amount, service.price_type)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 col-span-2">No services yet</p>
                    )}
                  </div>
                </section>
              )
            }

            case "contact": {
              const content = block.content as ContactContent
              return (
                <section key={block.id} className="py-10 px-4 text-center">
                  <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mb-2">Contact</p>
                  <h2 className="text-lg font-light mb-4">{content.heading || "Contact"}</h2>
                  <div className="space-y-2 text-xs text-stone-600">
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

            case "creative": {
              const content = block.content as CreativeContent
              return (
                <section key={block.id} className="py-10 px-4">
                  {content.name && (
                    <p className="text-[10px] text-stone-400 tracking-[0.2em] uppercase mb-3">{content.name}</p>
                  )}
                  <div className="space-y-3">
                    {content.items?.map((item) => (
                      <div key={item.id}>{renderCreativeItem(item, "minimal")}</div>
                    ))}
                  </div>
                </section>
              )
            }

            default:
              return null
          }
        })}

        {/* Footer */}
        <footer className="py-4 px-4 border-t border-stone-100 text-center">
          <p className="text-[8px] text-stone-300">Stay Creative</p>
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
        {/* Gold accent sidebar */}
        <div className="absolute top-0 left-0 w-6 h-full bg-[#E6C068]" />

        {/* Background watermark */}
        <div className="absolute top-16 left-4 text-[60px] font-black text-white/[0.03] leading-[0.8] tracking-tighter pointer-events-none">
          {(profileName?.split(" ")[0] || "NAME").toUpperCase().slice(0, 4)}
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-10 bg-[#1A1A1A]/90 backdrop-blur-sm ml-6">
          <div className="px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[#E6C068]">port.</span>
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
                          <div key={i} className="w-1 h-1 rounded-full bg-[#E6C068]/50" />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="text-[8px] text-[#E6C068] uppercase tracking-[0.15em] mb-1">
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
                    <div className="w-6 h-px bg-[#E6C068]" />
                    <span className="text-[8px] text-[#E6C068] uppercase tracking-wider">About</span>
                  </div>
                  <h2 className="text-base font-bold mb-2">{content.heading || "About me"}</h2>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    {content.description || "Introduction information."}
                  </p>
                </section>
              )
            }

            case "services": {
              const content = block.content as ServicesContent
              return (
                <section key={block.id} className="ml-6 px-3 py-6 bg-[#141414]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-px bg-[#E6C068]" />
                    <span className="text-[8px] text-[#E6C068] uppercase tracking-wider">Services</span>
                  </div>
                  <h2 className="text-base font-bold mb-3">{content.heading || "Services"}</h2>
                  <div className="space-y-0">
                    {services.length > 0 ? (
                      services.map((service, i) => (
                        <div key={service.id} className="py-3 border-b border-white/10 flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-[8px] text-[#E6C068]/50">0{i + 1}</span>
                            <div>
                              <h3 className="text-xs font-bold">{service.title}</h3>
                              {service.description && (
                                <p className="mt-1 text-[9px] text-white/40 line-clamp-1">{service.description}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-[#E6C068] font-bold whitespace-nowrap">
                            {formatPrice(service.price_amount, service.price_type)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-white/40">No services yet</p>
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
                    <div className="w-6 h-px bg-[#E6C068]" />
                    <span className="text-[8px] text-[#E6C068] uppercase tracking-wider">Contact</span>
                  </div>
                  <h2 className="text-base font-bold mb-3">{content.heading || "Contact"}</h2>
                  <div className="space-y-2">
                    {content.email && (
                      <div className="flex items-center gap-2 text-[10px] text-white/60">
                        <Mail className="h-3 w-3 text-[#E6C068]" />
                        {content.email}
                      </div>
                    )}
                    {content.phone && (
                      <div className="flex items-center gap-2 text-[10px] text-white/60">
                        <Phone className="h-3 w-3 text-[#E6C068]" />
                        {content.phone}
                      </div>
                    )}
                  </div>
                </section>
              )
            }

            case "creative": {
              const content = block.content as CreativeContent
              return (
                <section key={block.id} className="ml-6 px-3 py-6 border-t border-white/10">
                  {content.name && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-px bg-[#E6C068]" />
                      <span className="text-[8px] text-[#E6C068] uppercase tracking-wider">{content.name}</span>
                    </div>
                  )}
                  <div className="space-y-3">
                    {content.items?.map((item) => (
                      <div key={item.id}>{renderCreativeItem(item, "editorial")}</div>
                    ))}
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
          <p className="text-[8px] text-white/30">Powered by TEST-002</p>
        </footer>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // GRID TEMPLATE - Playful, Modern, Creative (John Deo style)
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div
      className="min-h-full bg-[#FDFBF9] text-stone-800 relative"
      style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      {/* Decorative elements */}
      <div className="absolute top-8 left-4 w-16 h-16 border border-dashed border-stone-200/50 rounded-full pointer-events-none" />
      <div className="absolute top-32 right-2 w-2 h-2 bg-[#2D5A4A] rounded rotate-12 pointer-events-none" />
      <svg className="absolute top-20 left-2 w-12 h-20 opacity-20 pointer-events-none" viewBox="0 0 60 80">
        <path d="M5,70 Q30,20 55,40" fill="none" stroke="#2D5A4A" strokeWidth="1" strokeDasharray="3,3" />
      </svg>

      {/* Navigation */}
      <nav className="sticky top-0 z-10 bg-[#FDFBF9]/90 backdrop-blur-sm border-b border-stone-100">
        <div className="px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#2D5A4A] rounded" />
            <span className="text-xs font-semibold">Deo.</span>
          </div>
          <div className="flex items-center gap-2">
            {["Home", "Services"].map((item) => (
              <span key={item} className="text-[10px] text-stone-500">{item}</span>
            ))}
            <div className="px-2 py-1 bg-[#E6A84D] rounded">
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
                    <p className="text-[10px] text-stone-400 mb-1">Hello! I am</p>
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#F7D87A] to-[#E6A84D] overflow-hidden">
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-end justify-center pb-1">
                          <div className="w-8 h-8 rounded-full bg-[#D4956A]" />
                        </div>
                      )}
                    </div>
                    {/* Dots */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-dashed border-stone-300" />
                    <div className="absolute bottom-1 -left-1 grid grid-cols-3 gap-px">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-[#2D5A4A]" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right content */}
                <div className="mt-4">
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    {content.subtitle || "I design beautifully simple things."}
                  </p>

                  {/* Rating */}
                  <div className="mt-3 inline-block p-2 bg-white rounded border border-stone-100 shadow-sm">
                    <p className="text-[7px] text-stone-400">5k+ Reviews</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">4.9</span>
                      <div className="flex gap-px">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-[8px] text-yellow-500">★</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Script */}
                  <div className="mt-3 text-right">
                    <p className="text-lg text-[#2D5A4A] italic" style={{ fontFamily: "Georgia, serif" }}>
                      Creative
                    </p>
                    <p className="text-xs text-stone-400 -mt-1">Designer.</p>
                  </div>
                </div>
              </section>
            )
          }

          case "about": {
            const content = block.content as AboutContent
            return (
              <section key={block.id} className="px-3 py-6 bg-[#F5F0E8]/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#2D5A4A] rounded-full" />
                  <span className="text-[8px] text-[#2D5A4A] uppercase tracking-wider">About</span>
                </div>
                <h2 className="text-base font-bold mb-2">{content.heading || "About me"}</h2>
                <p className="text-[10px] text-stone-600 leading-relaxed">
                  {content.description || "Introduction information."}
                </p>
              </section>
            )
          }

          case "services": {
            const content = block.content as ServicesContent
            return (
              <section key={block.id} className="px-3 py-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#E6A84D] rounded-full" />
                  <span className="text-[8px] text-[#E6A84D] uppercase tracking-wider">Services</span>
                </div>
                <h2 className="text-base font-bold mb-3">{content.heading || "Services"}</h2>
                <div className="grid gap-2 grid-cols-2">
                  {services.length > 0 ? (
                    services.map((service, i) => (
                      <div key={service.id} className="relative p-3 rounded-lg border border-stone-100 bg-white overflow-hidden">
                        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#2D5A4A] to-[#E6A84D] opacity-0 hover:opacity-100 transition-opacity" />
                        <span className="text-[7px] text-stone-300">0{i + 1}</span>
                        <h3 className="mt-1 text-[11px] font-semibold">{service.title}</h3>
                        {service.description && (
                          <p className="mt-1 text-[9px] text-stone-500 line-clamp-2">{service.description}</p>
                        )}
                        <p className="mt-2 text-[10px] font-medium text-[#E6A84D]">
                          {formatPrice(service.price_amount, service.price_type)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-stone-400 col-span-2">No services yet</p>
                  )}
                </div>
              </section>
            )
          }

          case "contact": {
            const content = block.content as ContactContent
            return (
              <section key={block.id} className="px-3 py-6 bg-[#F5F0E8]/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-[#2D5A4A] rounded-full" />
                  <span className="text-[8px] text-[#2D5A4A] uppercase tracking-wider">Contact</span>
                </div>
                <h2 className="text-base font-bold mb-3">{content.heading || "Contact"}</h2>
                <div className="space-y-2">
                  {content.email && (
                    <div className="flex items-center gap-2 text-[10px] text-stone-600">
                      <div className="w-5 h-5 rounded-full bg-[#2D5A4A]/10 flex items-center justify-center">
                        <Mail className="h-2.5 w-2.5 text-[#2D5A4A]" />
                      </div>
                      {content.email}
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-center gap-2 text-[10px] text-stone-600">
                      <div className="w-5 h-5 rounded-full bg-[#2D5A4A]/10 flex items-center justify-center">
                        <Phone className="h-2.5 w-2.5 text-[#2D5A4A]" />
                      </div>
                      {content.phone}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4 px-3 py-2 bg-gradient-to-r from-[#2D5A4A] to-[#3d7a64] text-white rounded text-center">
                  <span className="text-[10px] font-medium">Let's Work Together →</span>
                </div>
              </section>
            )
          }

          case "creative": {
            const content = block.content as CreativeContent
            return (
              <section key={block.id} className="px-3 py-6">
                {content.name && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-[#E6A84D] rounded-full" />
                    <span className="text-[8px] text-[#E6A84D] uppercase tracking-wider">{content.name}</span>
                  </div>
                )}
                <div className="space-y-3">
                  {content.items?.map((item) => (
                    <div key={item.id}>{renderCreativeItem(item, "grid")}</div>
                  ))}
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
        <path d="M0,24 Q100,8 200,16 T400,10 L400,24 Z" fill="#F5F0E8" />
      </svg>

      {/* Footer */}
      <footer className="py-3 px-3 bg-[#F5F0E8] text-center">
        <p className="text-[8px] text-stone-400">Powered by TEST-002</p>
      </footer>
    </div>
  )
}
