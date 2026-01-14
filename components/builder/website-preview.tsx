"use client"

import type {
  WebsiteBlock,
  Service,
  WebsiteTemplate,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
} from "@/lib/types"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react"

interface WebsitePreviewProps {
  blocks: WebsiteBlock[]
  services: Service[]
  template: WebsiteTemplate
  scale?: number
}

export function WebsitePreview({ blocks, services, template, scale = 1 }: WebsitePreviewProps) {
  const visibleBlocks = blocks.filter((b) => b.is_visible)

  const templateStyles = {
    minimal: {
      container: "font-sans",
      hero: "py-20 px-6 text-center bg-background",
      heroTitle: "text-4xl font-bold tracking-tight",
      heroSubtitle: "mt-4 text-lg text-muted-foreground max-w-2xl mx-auto",
      section: "py-16 px-6",
      sectionTitle: "text-2xl font-bold mb-6",
      serviceCard: "p-6 rounded-lg border border-border bg-card",
    },
    editorial: {
      container: "font-serif",
      hero: "py-24 px-8 bg-foreground text-background",
      heroTitle: "text-5xl font-bold tracking-tight",
      heroSubtitle: "mt-6 text-xl opacity-80 max-w-3xl",
      section: "py-20 px-8",
      sectionTitle: "text-3xl font-bold mb-8 border-b border-border pb-4",
      serviceCard: "p-8 border-l-4 border-accent bg-muted/30",
    },
    grid: {
      container: "font-sans",
      hero: "py-16 px-6 bg-accent text-accent-foreground",
      heroTitle: "text-3xl font-bold",
      heroSubtitle: "mt-3 text-base opacity-90",
      section: "py-12 px-6",
      sectionTitle: "text-xl font-bold mb-4 uppercase tracking-wider",
      serviceCard: "p-4 rounded-md bg-card border border-border",
    },
  }

  const styles = templateStyles[template]

  const formatPrice = (amount: number | null, type: string) => {
    if (type === "quote") return "Báo giá"
    if (!amount) return "Liên hệ"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className={styles.container} style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {visibleBlocks.map((block) => {
        switch (block.block_type) {
          case "hero": {
            const content = block.content as HeroContent
            return (
              <section key={block.id} className={styles.hero}>
                <h1 className={styles.heroTitle}>{content.title || "Tiêu đề"}</h1>
                <p className={styles.heroSubtitle}>{content.subtitle || "Phụ đề"}</p>
                {content.cta_text && (
                  <a
                    href={content.cta_link || "#"}
                    className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90 transition-opacity"
                  >
                    {content.cta_text}
                  </a>
                )}
              </section>
            )
          }

          case "about": {
            const content = block.content as AboutContent
            return (
              <section key={block.id} className={styles.section}>
                <h2 className={styles.sectionTitle}>{content.heading || "Về tôi"}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {content.description || "Nội dung giới thiệu"}
                </p>
              </section>
            )
          }

          case "services": {
            const content = block.content as ServicesContent
            return (
              <section key={block.id} className={`${styles.section} bg-muted/30`}>
                <h2 className={styles.sectionTitle}>{content.heading || "Dịch vụ"}</h2>
                {content.description && <p className="text-muted-foreground mb-6">{content.description}</p>}
                <div className={`grid gap-4 ${template === "grid" ? "grid-cols-2" : "grid-cols-1"}`}>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <div key={service.id} className={styles.serviceCard}>
                        <h3 className="font-semibold">{service.title}</h3>
                        {service.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                        )}
                        <p className="mt-3 text-sm font-medium text-accent">
                          {formatPrice(service.price_amount, service.price_type)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">Chưa có dịch vụ nào</p>
                  )}
                </div>
              </section>
            )
          }

          case "contact": {
            const content = block.content as ContactContent
            return (
              <section key={block.id} className={styles.section}>
                <h2 className={styles.sectionTitle}>{content.heading || "Liên hệ"}</h2>
                <div className="space-y-3">
                  {content.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${content.email}`} className="hover:text-accent">
                        {content.email}
                      </a>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${content.phone}`} className="hover:text-accent">
                        {content.phone}
                      </a>
                    </div>
                  )}
                  {content.address && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{content.address}</span>
                    </div>
                  )}
                  {content.social_links && Object.keys(content.social_links).length > 0 && (
                    <div className="flex gap-4 mt-4">
                      {content.social_links.facebook && (
                        <a
                          href={content.social_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {content.social_links.instagram && (
                        <a
                          href={content.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {content.social_links.linkedin && (
                        <a
                          href={content.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <Linkedin className="h-5 w-5" />
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
  )
}
