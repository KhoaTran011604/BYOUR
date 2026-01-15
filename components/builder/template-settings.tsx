"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { WebsiteTemplate, ColorScheme } from "@/lib/types"
import { colorSchemes } from "@/lib/colors"
import { X } from "lucide-react"

interface TemplateSettingsProps {
  template: WebsiteTemplate
  colorScheme: ColorScheme
  onTemplateChange: (template: WebsiteTemplate) => void
  onColorSchemeChange: (colorScheme: ColorScheme) => void
  onClose: () => void
}

const templates: { id: WebsiteTemplate; name: string; description: string }[] = [
  { id: "minimal", name: "Minimal", description: "Thiết kế tối giản, tập trung nội dung" },
  { id: "editorial", name: "Editorial", description: "Phong cách báo chí, chữ lớn nổi bật" },
  { id: "grid", name: "Grid", description: "Bố cục lưới hiện đại, rõ ràng" },
]

const colorSchemeOptions = Object.entries(colorSchemes).map(([id, palette]) => ({
  id: id as ColorScheme,
  ...palette,
}))

export function TemplateSettings({ template, colorScheme, onTemplateChange, onColorSchemeChange, onClose }: TemplateSettingsProps) {
  return (
    <div className="w-72 shrink-0 border-r border-border bg-background p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Cài đặt mẫu</h3>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm text-muted-foreground">Chọn mẫu thiết kế</Label>
          <RadioGroup value={template} onValueChange={(v) => onTemplateChange(v as WebsiteTemplate)} className="mt-3">
            {templates.map((t) => (
              <div
                key={t.id}
                className={`flex items-start space-x-3 rounded-lg border p-3 cursor-pointer transition-all ${
                  template === t.id ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                }`}
                onClick={() => onTemplateChange(t.id)}
              >
                <RadioGroupItem value={t.id} id={t.id} className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor={t.id} className="cursor-pointer font-medium">
                    {t.name}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm text-muted-foreground">Chọn bộ màu</Label>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {colorSchemeOptions.map((scheme) => (
              <div
                key={scheme.id}
                className={`relative p-3 rounded-lg border cursor-pointer transition-all ${
                  colorScheme === scheme.id ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-accent/50"
                }`}
                onClick={() => onColorSchemeChange(scheme.id)}
              >
                <div className="flex gap-1 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.secondary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: scheme.accent }}
                  />
                </div>
                <p className="text-xs font-medium">{scheme.name}</p>
                <p className="text-[10px] text-muted-foreground">{scheme.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
