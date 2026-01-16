"use client"

import {
  Calendar,
  DollarSign,
  FileText,
  Tag,
  Sparkles,
  CheckCircle2,
  Package,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { HQProjectDraft } from "@/lib/types"

interface ProjectPreviewStepProps {
  draft: HQProjectDraft
}

const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
}

export function ProjectPreviewStep({ draft }: ProjectPreviewStepProps) {
  const symbol = currencySymbols[draft.currency] || draft.currency

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-6">
        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">{draft.title || "Untitled Project"}</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {draft.description || "No description provided"}
          </p>
        </div>

        <Separator />

        {/* Budget */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Budget
          </div>
          <p className="text-lg font-semibold">
            {symbol}
            {draft.budget_min.toLocaleString()} - {symbol}
            {draft.budget_max.toLocaleString()} {draft.currency}
          </p>
        </div>

        {/* Timeline */}
        {(draft.timeline_start || draft.timeline_end || draft.deadline) && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Timeline
              </div>
              <div className="space-y-1 text-sm">
                {draft.timeline_start && (
                  <p suppressHydrationWarning>
                    <span className="text-muted-foreground">Start:</span>{" "}
                    {new Date(draft.timeline_start).toLocaleDateString()}
                  </p>
                )}
                {draft.timeline_end && (
                  <p suppressHydrationWarning>
                    <span className="text-muted-foreground">End:</span>{" "}
                    {new Date(draft.timeline_end).toLocaleDateString()}
                  </p>
                )}
                {draft.deadline && (
                  <p suppressHydrationWarning>
                    <span className="text-muted-foreground">Deadline:</span>{" "}
                    {new Date(draft.deadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Requirements */}
        {draft.requirements && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Requirements
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {draft.requirements}
              </p>
            </div>
          </>
        )}

        {/* Deliverables */}
        {draft.deliverables.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Package className="h-4 w-4 text-muted-foreground" />
                Deliverables
              </div>
              <ul className="space-y-1">
                {draft.deliverables.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Separator />

        {/* Skills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            Required Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {draft.skills_required.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        {draft.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {draft.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-green-500/10 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-400">
              Ready to Post
            </p>
            <p className="text-sm text-green-600 dark:text-green-500">
              Your project looks good! Click &quot;Create Project&quot; to post it and
              start finding professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
