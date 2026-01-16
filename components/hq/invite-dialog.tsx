"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  hqId: string
  bossId: string | null
  projectBudget: {
    min: number
    max: number
    currency: string
  }
  projectDeadline: string | null
}

const currencySymbols: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
}

export function InviteDialog({
  open,
  onOpenChange,
  projectId,
  hqId,
  bossId,
  projectBudget,
  projectDeadline,
}: InviteDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const symbol = currencySymbols[projectBudget.currency] || projectBudget.currency

  const [formData, setFormData] = useState({
    message: "",
    proposedBudget: "",
    proposedDeadline: projectDeadline || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!bossId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from("hq_invites").insert({
        hq_id: hqId,
        project_id: projectId,
        boss_id: bossId,
        message: formData.message.trim() || null,
        proposed_budget: formData.proposedBudget
          ? Number(formData.proposedBudget)
          : null,
        proposed_deadline: formData.proposedDeadline || null,
        status: "pending",
      })

      if (insertError) throw insertError

      // Reset form and close dialog
      setFormData({
        message: "",
        proposedBudget: "",
        proposedDeadline: projectDeadline || "",
      })
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error("Invite error:", err)
      setError("Failed to send invite. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        message: "",
        proposedBudget: "",
        proposedDeadline: projectDeadline || "",
      })
      setError(null)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Invite</DialogTitle>
          <DialogDescription>
            Invite this professional to work on your project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Project Budget Reference */}
            <div className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-muted-foreground">Project Budget Range:</p>
              <p className="font-medium">
                {symbol}
                {projectBudget.min.toLocaleString()} - {symbol}
                {projectBudget.max.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedBudget">Proposed Budget (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {symbol}
                </span>
                <Input
                  id="proposedBudget"
                  type="number"
                  placeholder="Enter a specific budget"
                  className="pl-8"
                  value={formData.proposedBudget}
                  onChange={(e) =>
                    setFormData({ ...formData, proposedBudget: e.target.value })
                  }
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to use the project&apos;s budget range
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposedDeadline">Proposed Deadline (Optional)</Label>
              <Input
                id="proposedDeadline"
                type="date"
                value={formData.proposedDeadline}
                onChange={(e) =>
                  setFormData({ ...formData, proposedDeadline: e.target.value })
                }
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to the professional..."
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Introduce yourself and explain why you think they&apos;d be a great fit
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Invite
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
