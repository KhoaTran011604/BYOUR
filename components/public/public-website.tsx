import type {
  Website,
  WebsiteBlock,
  Service,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
} from "@/lib/types"
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PublicWebsiteProps {
  website: Website
  blocks: WebsiteBlock[]
  services: Service[]
  profileName: string | null
  profileAvatar: string | null
}

export function PublicWebsite({ website, blocks, services, profileName }: PublicWebsiteProps) {
  const { template } = website

  const formatPrice = (amount: number | null, type: string) => {
    if (type === "quote") return "Báo giá"
    if (!amount) return "Liên hệ"
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  // Template-specific styles
  const getTemplateStyles = () => {
    switch (template) {
      case "editorial":
        return {
          wrapper: "font-serif",
          hero: "min-h-[70vh] flex items-center bg-foreground text-background px-8 py-24",
          heroInner: "max-w-4xl",
          heroTitle: "text-5xl md:text-7xl font-bold tracking-tight leading-tight",
          heroSubtitle: "mt-8 text-xl md:text-2xl opacity-80 max-w-2xl leading-relaxed",
          heroCta:
            "mt-10 inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 text-lg font-medium hover:opacity-90 transition-opacity",
          section: "py-24 px-8",
          sectionAlt: "py-24 px-8 bg-muted/30",
          sectionTitle: "text-4xl font-bold mb-8 pb-4 border-b-2 border-foreground",
          sectionContent: "text-lg leading-relaxed text-muted-foreground",
          serviceGrid: "grid gap-8 md:grid-cols-1",
          serviceCard: "p-8 border-l-4 border-accent bg-background",
          serviceTitle: "text-xl font-bold",
          serviceDesc: "mt-3 text-muted-foreground",
          servicePrice: "mt-4 text-lg font-semibold text-accent",
          contactItem: "flex items-center gap-4 text-lg",
          socialLinks: "flex gap-6 mt-8",
        }
      case "grid":
        return {
          wrapper: "font-sans",
          hero: "bg-accent text-accent-foreground px-6 py-16 md:py-24",
          heroInner: "max-w-6xl mx-auto",
          heroTitle: "text-3xl md:text-4xl font-bold",
          heroSubtitle: "mt-4 text-lg opacity-90 max-w-xl",
          heroCta:
            "mt-8 inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity",
          section: "py-16 px-6",
          sectionAlt: "py-16 px-6 bg-muted/30",
          sectionTitle: "text-xl font-bold uppercase tracking-wider mb-6",
          sectionContent: "text-base text-muted-foreground",
          serviceGrid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          serviceCard: "p-5 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors",
          serviceTitle: "font-semibold",
          serviceDesc: "mt-2 text-sm text-muted-foreground line-clamp-2",
          servicePrice: "mt-3 text-sm font-medium text-accent",
          contactItem: "flex items-center gap-3 text-sm",
          socialLinks: "flex gap-4 mt-6",
        }
      default: // minimal
        return {
          wrapper: "font-sans",
          hero: "min-h-[60vh] flex items-center justify-center text-center px-6 py-20 bg-background",
          heroInner: "max-w-3xl mx-auto",
          heroTitle: "text-4xl md:text-5xl font-bold tracking-tight",
          heroSubtitle: "mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed",
          heroCta:
            "mt-10 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity",
          section: "py-20 px-6 max-w-4xl mx-auto",
          sectionAlt: "py-20 px-6 bg-muted/30",
          sectionTitle: "text-2xl md:text-3xl font-bold mb-6 text-center",
          sectionContent: "text-muted-foreground leading-relaxed text-center",
          serviceGrid: "grid gap-6 md:grid-cols-2 max-w-4xl mx-auto",
          serviceCard: "p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow",
          serviceTitle: "text-lg font-semibold",
          serviceDesc: "mt-2 text-sm text-muted-foreground",
          servicePrice: "mt-4 font-medium text-accent",
          contactItem: "flex items-center gap-3",
          socialLinks: "flex justify-center gap-5 mt-8",
        }
    }
  }

  const styles = getTemplateStyles()

  return (
    <div className={`min-h-screen bg-background ${styles.wrapper}`}>
      {blocks.map((block) => {
        switch (block.block_type) {
          case "hero": {
            const content = block.content as HeroContent
            return (
              <section key={block.id} id="hero" className={styles.hero}>
                <div className={styles.heroInner}>
                  <h1 className={styles.heroTitle}>{content.title || profileName || "Chào mừng"}</h1>
                  <p className={styles.heroSubtitle}>{content.subtitle || "Chào mừng đến với trang web của tôi"}</p>
                  {content.cta_text && (
                    <a href={content.cta_link || "#contact"} className={styles.heroCta}>
                      {content.cta_text}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </section>
            )
          }

          case "about": {
            const content = block.content as AboutContent
            return (
              <section key={block.id} id="about" className={styles.section}>
                <h2 className={styles.sectionTitle}>{content.heading || "Về tôi"}</h2>
                <p className={`${styles.sectionContent} whitespace-pre-line`}>
                  {content.description || "Thông tin giới thiệu"}
                </p>
              </section>
            )
          }

          case "services": {
            const content = block.content as ServicesContent
            return (
              <section key={block.id} id="services" className={styles.sectionAlt}>
                <div className={template === "minimal" ? "max-w-4xl mx-auto" : ""}>
                  <h2 className={styles.sectionTitle}>{content.heading || "Dịch vụ"}</h2>
                  {content.description && <p className={`${styles.sectionContent} mb-8`}>{content.description}</p>}
                  {services.length > 0 ? (
                    <div className={styles.serviceGrid}>
                      {services.map((service) => (
                        <div key={service.id} className={styles.serviceCard}>
                          <h3 className={styles.serviceTitle}>{service.title}</h3>
                          {service.description && <p className={styles.serviceDesc}>{service.description}</p>}
                          <p className={styles.servicePrice}>{formatPrice(service.price_amount, service.price_type)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">Chưa có dịch vụ nào</p>
                  )}
                </div>
              </section>
            )
          }

          case "contact": {
            const content = block.content as ContactContent
            return (
              <section key={block.id} id="contact" className={styles.section}>
                <div className={template === "minimal" ? "text-center" : ""}>
                  <h2 className={styles.sectionTitle}>{content.heading || "Liên hệ"}</h2>
                  <div className={`space-y-4 ${template === "minimal" ? "inline-flex flex-col items-center" : ""}`}>
                    {content.email && (
                      <div className={styles.contactItem}>
                        <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                        <a href={`mailto:${content.email}`} className="hover:text-accent transition-colors">
                          {content.email}
                        </a>
                      </div>
                    )}
                    {content.phone && (
                      <div className={styles.contactItem}>
                        <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                        <a href={`tel:${content.phone}`} className="hover:text-accent transition-colors">
                          {content.phone}
                        </a>
                      </div>
                    )}
                    {content.address && (
                      <div className={styles.contactItem}>
                        <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                        <span>{content.address}</span>
                      </div>
                    )}
                  </div>

                  {content.social_links && Object.values(content.social_links).some((v) => v) && (
                    <div className={styles.socialLinks}>
                      {content.social_links.facebook && (
                        <a
                          href={content.social_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent transition-colors"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                      {content.social_links.instagram && (
                        <a
                          href={content.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent transition-colors"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {content.social_links.linkedin && (
                        <a
                          href={content.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-6 w-6" />
                        </a>
                      )}
                      {content.social_links.twitter && (
                        <a
                          href={content.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent transition-colors"
                          aria-label="Twitter"
                        >
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

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Tạo bởi{" "}
            <Link href="/" className="text-accent hover:underline">
              BYOUR
            </Link>
          </p>
          <p>
            © {new Date().getFullYear()} {profileName || website.handle}
          </p>
        </div>
      </footer>
    </div>
  )
}
