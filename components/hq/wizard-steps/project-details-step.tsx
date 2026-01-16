"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { HQProjectDraft } from "@/lib/types"

interface ProjectDetailsStepProps {
  draft: HQProjectDraft
  onChange: (draft: HQProjectDraft) => void
}

export function ProjectDetailsStep({ draft, onChange }: ProjectDetailsStepProps) {
  const [newDeliverable, setNewDeliverable] = useState("")

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      onChange({
        ...draft,
        deliverables: [...draft.deliverables, newDeliverable.trim()],
      })
      setNewDeliverable("")
    }
  }

  const removeDeliverable = (index: number) => {
    onChange({
      ...draft,
      deliverables: draft.deliverables.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          Project Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Mobile App Development for E-commerce"
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Choose a clear, descriptive title for your project
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Project Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe what you need, the goals of the project, and any important context..."
          rows={5}
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Provide enough detail for professionals to understand your needs
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements (Optional)</Label>
        <Textarea
          id="requirements"
          placeholder="List any specific requirements, technical specifications, or preferences..."
          rows={3}
          value={draft.requirements}
          onChange={(e) => onChange({ ...draft, requirements: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Deliverables</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Mobile app for iOS and Android"
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addDeliverable()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addDeliverable}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {draft.deliverables.length > 0 && (
          <div className="mt-3 space-y-2">
            {draft.deliverables.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm">{item}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDeliverable(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Add specific deliverables you expect from this project
        </p>
      </div>
    </div>
  )
}
