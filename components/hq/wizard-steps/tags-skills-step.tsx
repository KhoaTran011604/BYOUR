"use client"

import { useState } from "react"
import { Plus, X, Tag, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { HQProjectDraft } from "@/lib/types"

interface TagsSkillsStepProps {
  draft: HQProjectDraft
  onChange: (draft: HQProjectDraft) => void
}

const suggestedSkills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "UI/UX Design",
  "Mobile Development",
  "AWS",
  "Docker",
  "GraphQL",
  "PostgreSQL",
  "Machine Learning",
  "Data Analysis",
  "Figma",
  "Next.js",
  "DevOps",
]

const suggestedTags = [
  "Web Development",
  "Mobile App",
  "E-commerce",
  "SaaS",
  "Startup",
  "Enterprise",
  "MVP",
  "Redesign",
  "Integration",
  "API Development",
  "Full Stack",
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
]

export function TagsSkillsStep({ draft, onChange }: TagsSkillsStepProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newTag, setNewTag] = useState("")

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !draft.skills_required.includes(trimmedSkill)) {
      onChange({
        ...draft,
        skills_required: [...draft.skills_required, trimmedSkill],
      })
    }
    setNewSkill("")
  }

  const removeSkill = (skill: string) => {
    onChange({
      ...draft,
      skills_required: draft.skills_required.filter((s) => s !== skill),
    })
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !draft.tags.includes(trimmedTag)) {
      onChange({
        ...draft,
        tags: [...draft.tags, trimmedTag],
      })
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    onChange({
      ...draft,
      tags: draft.tags.filter((t) => t !== tag),
    })
  }

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">
            Required Skills <span className="text-destructive">*</span>
          </h3>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a required skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill(newSkill)
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addSkill(newSkill)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Skills */}
        {draft.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.skills_required.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="flex items-center gap-1 py-1.5"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Suggested Skills */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Suggested skills (click to add):
          </Label>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills
              .filter((skill) => !draft.skills_required.includes(skill))
              .slice(0, 10)
              .map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => addSkill(skill)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {skill}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Project Tags</h3>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add a tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addTag(newTag)
              }
            }}
          />
          <Button type="button" variant="outline" onClick={() => addTag(newTag)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Selected Tags */}
        {draft.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.tags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="flex items-center gap-1 py-1.5"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 rounded-full hover:bg-primary/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Suggested Tags */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Suggested tags (click to add):
          </Label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter((tag) => !draft.tags.includes(tag))
              .slice(0, 8)
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => addTag(tag)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Skills:</strong>{" "}
          {draft.skills_required.length > 0
            ? draft.skills_required.join(", ")
            : "No skills added yet"}
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Tags:</strong>{" "}
          {draft.tags.length > 0 ? draft.tags.join(", ") : "No tags added yet"}
        </p>
      </div>
    </div>
  )
}
