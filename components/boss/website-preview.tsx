"use client"

import { Monitor, Smartphone, Tablet, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { WebsiteTemplate, BlockType, Service } from "@/lib/types"

interface WebsitePreviewProps {
  template: WebsiteTemplate
  sections: BlockType[]
  content: Record<string, object>
  services: Partial<Service>[]
  handle: string
}

type DeviceSize = "desktop" | "tablet" | "mobile"

const deviceSizes: { id: DeviceSize; icon: React.ElementType; width: string }[] = [
  { id: "desktop", icon: Monitor, width: "w-full" },
  { id: "tablet", icon: Tablet, width: "w-[768px]" },
  { id: "mobile", icon: Smartphone, width: "w-[375px]" },
]

export function WebsitePreview({
  template,
  sections,
  content,
  services,
  handle,
}: WebsitePreviewProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop")

  const heroContent = content.hero as Record<string, string> | undefined
  const aboutContent = content.about as Record<string, string> | undefined
  const servicesContent = content.services as Record<string, string> | undefined
  const contactContent = content.contact as Record<string, string> | undefined

  return (
    <div className="space-y-4">
      {/* Device Size Selector */}
      <div className="flex items-center justify-center gap-2">
        {deviceSizes.map(({ id, icon: Icon }) => (
          <Button
            key={id}
            variant={deviceSize === id ? "default" : "outline"}
            size="sm"
            onClick={() => setDeviceSize(id)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Preview Container */}
      <div className="flex justify-center overflow-hidden rounded-lg border bg-muted/30 p-4">
        <div
          className={cn(
            "overflow-hidden rounded-lg border bg-background shadow-lg transition-all",
            deviceSizes.find((d) => d.id === deviceSize)?.width,
            deviceSize === "mobile" && "max-h-[600px]",
            deviceSize === "tablet" && "max-h-[500px]"
          )}
        >
          {/* Preview Content */}
          <div className="h-[500px] overflow-auto">
            {/* Hero Section */}
            {sections.includes("hero") && (
              <div
                className={cn(
                  "flex min-h-[300px] flex-col items-center justify-center p-8 text-center",
                  template === "minimal" && "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
                  template === "editorial" && "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950",
                  template === "grid" && "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950"
                )}
              >
                <h1
                  className={cn(
                    "mb-4 font-bold",
                    template === "minimal" && "text-2xl",
                    template === "editorial" && "text-3xl font-serif",
                    template === "grid" && "text-2xl tracking-tight"
                  )}
                >
                  {heroContent?.title || "Welcome to my portfolio"}
                </h1>
                <p className="mb-6 text-muted-foreground">
                  {heroContent?.subtitle || "Professional services tailored to your needs"}
                </p>
                {heroContent?.cta_text && (
                  <div className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                    {heroContent.cta_text}
                  </div>
                )}
              </div>
            )}

            {/* About Section */}
            {sections.includes("about") && (
              <div className="p-8">
                <h2
                  className={cn(
                    "mb-4 font-semibold",
                    template === "editorial" && "font-serif"
                  )}
                >
                  {aboutContent?.heading || "About Me"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {aboutContent?.description || "Tell your story here..."}
                </p>
              </div>
            )}

            {/* Services Section */}
            {sections.includes("services") && (
              <div className="bg-muted/30 p-8">
                <h2
                  className={cn(
                    "mb-2 font-semibold",
                    template === "editorial" && "font-serif"
                  )}
                >
                  {servicesContent?.heading || "Services"}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {servicesContent?.description || "What I offer"}
                </p>
                <div
                  className={cn(
                    "grid gap-3",
                    template === "grid" ? "grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {services.length > 0 ? (
                    services.slice(0, 4).map((service, i) => (
                      <div
                        key={i}
                        className="rounded-lg border bg-background p-3"
                      >
                        <h3 className="text-sm font-medium">
                          {service.title || `Service ${i + 1}`}
                        </h3>
                        {service.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>
                        )}
                        <p className="mt-2 text-xs font-medium text-accent">
                          {service.price_type === "fixed" && service.price_amount
                            ? `${service.currency}${service.price_amount}`
                            : "Contact for quote"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No services added yet
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Contact Section */}
            {sections.includes("contact") && (
              <div className="p-8">
                <h2
                  className={cn(
                    "mb-4 font-semibold",
                    template === "editorial" && "font-serif"
                  )}
                >
                  {contactContent?.heading || "Get in Touch"}
                </h2>
                <div className="space-y-2 text-sm">
                  {contactContent?.email && (
                    <p className="text-muted-foreground">
                      Email: {contactContent.email}
                    </p>
                  )}
                  {contactContent?.phone && (
                    <p className="text-muted-foreground">
                      Phone: {contactContent.phone}
                    </p>
                  )}
                  {contactContent?.address && (
                    <p className="text-muted-foreground">
                      Address: {contactContent.address}
                    </p>
                  )}
                  {!contactContent?.email &&
                    !contactContent?.phone &&
                    !contactContent?.address && (
                      <p className="text-muted-foreground">
                        Contact information will appear here
                      </p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL Preview */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <ExternalLink className="h-4 w-4" />
        <span>Your website will be available at:</span>
        <span className="font-medium text-foreground">byour.app/{handle}</span>
      </div>
    </div>
  )
}
