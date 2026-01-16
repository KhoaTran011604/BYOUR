"use client"

import { Calendar, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { HQProjectDraft } from "@/lib/types"

interface BudgetTimelineStepProps {
  draft: HQProjectDraft
  onChange: (draft: HQProjectDraft) => void
}

const currencies = [
  { value: "EUR", label: "Euro (€)", symbol: "€" },
  { value: "USD", label: "US Dollar ($)", symbol: "$" },
  { value: "GBP", label: "British Pound (£)", symbol: "£" },
]

export function BudgetTimelineStep({ draft, onChange }: BudgetTimelineStepProps) {
  const selectedCurrency = currencies.find((c) => c.value === draft.currency)

  return (
    <div className="space-y-6">
      {/* Budget Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Budget Range</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={draft.currency}
              onValueChange={(value) => onChange({ ...draft, currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetMin">
              Minimum Budget <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {selectedCurrency?.symbol}
              </span>
              <Input
                id="budgetMin"
                type="number"
                min={0}
                placeholder="1,000"
                className="pl-8"
                value={draft.budget_min || ""}
                onChange={(e) =>
                  onChange({ ...draft, budget_min: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetMax">
              Maximum Budget <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {selectedCurrency?.symbol}
              </span>
              <Input
                id="budgetMax"
                type="number"
                min={0}
                placeholder="5,000"
                className="pl-8"
                value={draft.budget_max || ""}
                onChange={(e) =>
                  onChange({ ...draft, budget_max: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        {draft.budget_max > 0 && draft.budget_min > draft.budget_max && (
          <p className="text-sm text-destructive">
            Maximum budget must be greater than or equal to minimum budget
          </p>
        )}
      </div>

      {/* Timeline Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium">Timeline</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="timelineStart">Preferred Start Date</Label>
            <Input
              id="timelineStart"
              type="date"
              value={draft.timeline_start || ""}
              onChange={(e) =>
                onChange({ ...draft, timeline_start: e.target.value || null })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timelineEnd">Preferred End Date</Label>
            <Input
              id="timelineEnd"
              type="date"
              value={draft.timeline_end || ""}
              min={draft.timeline_start || undefined}
              onChange={(e) =>
                onChange({ ...draft, timeline_end: e.target.value || null })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">Hard Deadline (if any)</Label>
          <Input
            id="deadline"
            type="date"
            value={draft.deadline || ""}
            onChange={(e) =>
              onChange({ ...draft, deadline: e.target.value || null })
            }
          />
          <p className="text-xs text-muted-foreground">
            Set a hard deadline if the project must be completed by a specific date
          </p>
        </div>
      </div>

      {/* Budget Preview */}
      {draft.budget_min > 0 && draft.budget_max >= draft.budget_min && (
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">Budget Range:</p>
          <p className="text-lg font-medium">
            {selectedCurrency?.symbol}
            {draft.budget_min.toLocaleString()} -{" "}
            {selectedCurrency?.symbol}
            {draft.budget_max.toLocaleString()} {draft.currency}
          </p>
        </div>
      )}
    </div>
  )
}
