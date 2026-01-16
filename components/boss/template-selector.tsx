"use client"

import { Check, Layout, Grid3X3, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WebsiteTemplate } from "@/lib/types"

interface TemplateSelectorProps {
  selectedTemplate: WebsiteTemplate
  onSelect: (template: WebsiteTemplate) => void
}

const templates: {
  id: WebsiteTemplate
  name: string
  description: string
  icon: React.ElementType
  preview: string
}[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, simple design with focus on content",
    icon: Layout,
    preview: "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine-style layout with bold typography",
    icon: FileText,
    preview: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20",
  },
  {
    id: "grid",
    name: "Grid",
    description: "Modern grid-based layout for visual impact",
    icon: Grid3X3,
    preview: "bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/20 dark:to-purple-900/20",
  },
]

export function TemplateSelector({
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {templates.map((template) => {
        const Icon = template.icon
        const isSelected = selectedTemplate === template.id

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-lg border-2 text-left transition-all hover:border-accent/50",
              isSelected ? "border-accent ring-2 ring-accent/20" : "border-border"
            )}
          >
            {/* Preview Area */}
            <div
              className={cn(
                "flex h-32 items-center justify-center",
                template.preview
              )}
            >
              <div className="rounded-lg bg-background/80 p-4 shadow-sm backdrop-blur">
                <Icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-semibold">{template.name}</h3>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute inset-0 pointer-events-none border-2 border-accent rounded-lg" />
            )}
          </button>
        )
      })}
    </div>
  )
}
