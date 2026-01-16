"use client"

import { useState } from "react"
import {
  Image,
  User,
  Briefcase,
  Mail,
  Sparkles,
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { BlockType } from "@/lib/types"

interface SectionsCustomizerProps {
  enabledSections: BlockType[]
  onSectionsChange: (sections: BlockType[]) => void
  sectionContent: Record<string, object>
  onContentChange: (content: Record<string, object>) => void
}

const sectionConfig: {
  id: BlockType
  name: string
  description: string
  icon: React.ElementType
  required?: boolean
}[] = [
  {
    id: "hero",
    name: "Hero Section",
    description: "Main banner with headline and call-to-action",
    icon: Image,
    required: true,
  },
  {
    id: "about",
    name: "About",
    description: "Tell your story and background",
    icon: User,
  },
  {
    id: "services",
    name: "Services",
    description: "Showcase what you offer",
    icon: Briefcase,
  },
  {
    id: "creative",
    name: "Creative Block",
    description: "Flexible content block for custom layouts",
    icon: Sparkles,
  },
  {
    id: "contact",
    name: "Contact",
    description: "Let visitors reach out to you",
    icon: Mail,
  },
]

export function SectionsCustomizer({
  enabledSections,
  onSectionsChange,
  sectionContent,
  onContentChange,
}: SectionsCustomizerProps) {
  const [expandedSection, setExpandedSection] = useState<BlockType | null>("hero")

  const toggleSection = (sectionId: BlockType) => {
    const section = sectionConfig.find((s) => s.id === sectionId)
    if (section?.required) return

    if (enabledSections.includes(sectionId)) {
      onSectionsChange(enabledSections.filter((id) => id !== sectionId))
    } else {
      onSectionsChange([...enabledSections, sectionId])
    }
  }

  const updateContent = (sectionId: string, field: string, value: string) => {
    const currentContent = (sectionContent[sectionId] as Record<string, unknown>) || {}
    onContentChange({
      ...sectionContent,
      [sectionId]: {
        ...currentContent,
        [field]: value,
      },
    })
  }

  const getContentValue = (sectionId: string, field: string): string => {
    const content = sectionContent[sectionId] as Record<string, unknown>
    return (content?.[field] as string) || ""
  }

  return (
    <div className="space-y-3">
      {sectionConfig.map((section) => {
        const Icon = section.icon
        const isEnabled = enabledSections.includes(section.id)
        const isExpanded = expandedSection === section.id

        return (
          <Collapsible
            key={section.id}
            open={isExpanded && isEnabled}
            onOpenChange={() =>
              setExpandedSection(isExpanded ? null : section.id)
            }
          >
            <div
              className={cn(
                "rounded-lg border transition-colors",
                isEnabled ? "border-border" : "border-dashed border-muted"
              )}
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 p-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isEnabled ? "bg-accent/10" : "bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isEnabled ? "text-accent" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={cn(
                        "font-medium",
                        !isEnabled && "text-muted-foreground"
                      )}
                    >
                      {section.name}
                    </h3>
                    {section.required && (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {!section.required && (
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  )}
                  {isEnabled && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>
              </div>

              {/* Section Content Editor */}
              <CollapsibleContent>
                <div className="border-t px-4 py-4">
                  {section.id === "hero" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Headline</Label>
                        <Input
                          placeholder="Welcome to my portfolio"
                          value={getContentValue("hero", "title")}
                          onChange={(e) =>
                            updateContent("hero", "title", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          placeholder="Professional services tailored to your needs"
                          value={getContentValue("hero", "subtitle")}
                          onChange={(e) =>
                            updateContent("hero", "subtitle", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>CTA Button Text</Label>
                          <Input
                            placeholder="Get in touch"
                            value={getContentValue("hero", "cta_text")}
                            onChange={(e) =>
                              updateContent("hero", "cta_text", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Link</Label>
                          <Input
                            placeholder="#contact"
                            value={getContentValue("hero", "cta_link")}
                            onChange={(e) =>
                              updateContent("hero", "cta_link", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.id === "about" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input
                          placeholder="About Me"
                          value={getContentValue("about", "heading")}
                          onChange={(e) =>
                            updateContent("about", "heading", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Tell your story..."
                          rows={4}
                          value={getContentValue("about", "description")}
                          onChange={(e) =>
                            updateContent("about", "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {section.id === "services" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Section Heading</Label>
                        <Input
                          placeholder="My Services"
                          value={getContentValue("services", "heading")}
                          onChange={(e) =>
                            updateContent("services", "heading", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Description</Label>
                        <Input
                          placeholder="What I offer"
                          value={getContentValue("services", "description")}
                          onChange={(e) =>
                            updateContent("services", "description", e.target.value)
                          }
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Individual services will be configured in the next step
                      </p>
                    </div>
                  )}

                  {section.id === "contact" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input
                          placeholder="Get in Touch"
                          value={getContentValue("contact", "heading")}
                          onChange={(e) =>
                            updateContent("contact", "heading", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            placeholder="hello@example.com"
                            value={getContentValue("contact", "email")}
                            onChange={(e) =>
                              updateContent("contact", "email", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            type="tel"
                            placeholder="+353 1 234 5678"
                            value={getContentValue("contact", "phone")}
                            onChange={(e) =>
                              updateContent("contact", "phone", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                          placeholder="Dublin, Ireland"
                          value={getContentValue("contact", "address")}
                          onChange={(e) =>
                            updateContent("contact", "address", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}

                  {section.id === "creative" && (
                    <div className="rounded-lg bg-muted/50 p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Creative blocks can be customized in the website builder
                        after publishing
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )
      })}
    </div>
  )
}
