"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { WebsiteTemplate } from "@/lib/types"
import { X } from "lucide-react"

interface TemplateSettingsProps {
  template: WebsiteTemplate
  onTemplateChange: (template: WebsiteTemplate) => void
  onClose: () => void
}

export function TemplateSettings({ template, onTemplateChange, onClose }: TemplateSettingsProps) {
  const t = useTranslations("builder")

  const templates: { id: WebsiteTemplate; nameKey: string; descKey: string }[] = [
    { id: "minimal", nameKey: "templates.minimal", descKey: "templates.minimalDesc" },
    { id: "editorial", nameKey: "templates.editorial", descKey: "templates.editorialDesc" },
    { id: "grid", nameKey: "templates.grid", descKey: "templates.gridDesc" },
  ]

  return (
    <div className="w-72 flex-shrink-0 border-r border-border bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("settings.templateSettings")}</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-sm text-muted-foreground">{t("settings.selectTemplate")}</Label>
          <RadioGroup value={template} onValueChange={(v) => onTemplateChange(v as WebsiteTemplate)} className="mt-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className={`flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  template === tpl.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
                onClick={() => onTemplateChange(tpl.id)}
              >
                <RadioGroupItem value={tpl.id} id={tpl.id} className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor={tpl.id} className="cursor-pointer font-medium">
                    {t(tpl.nameKey)}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{t(tpl.descKey)}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
