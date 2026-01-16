"use client"

import { useState } from "react"
import {
  CheckCircle2,
  Circle,
  Clock,
  FileCheck,
  Loader2,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { BossProject } from "@/lib/types"

interface Milestone {
  id: string
  title: string
  description?: string
  is_completed: boolean
  completed_at?: string
}

interface WorkTrackerProps {
  project: BossProject
  milestones: Milestone[]
  onAddMilestone: (title: string, description?: string) => Promise<void>
  onToggleMilestone: (milestoneId: string, completed: boolean) => Promise<void>
  onDeleteMilestone: (milestoneId: string) => Promise<void>
  onSubmitForReview: () => Promise<void>
  onMarkComplete: () => Promise<void>
}

export function WorkTracker({
  project,
  milestones,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onSubmitForReview,
  onMarkComplete,
}: WorkTrackerProps) {
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("")
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMilestoneId, setLoadingMilestoneId] = useState<string | null>(null)

  const completedCount = milestones.filter((m) => m.is_completed).length
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

  const handleAddMilestone = async () => {
    if (!newMilestoneTitle.trim()) return

    setIsSubmitting(true)
    try {
      await onAddMilestone(newMilestoneTitle, newMilestoneDescription || undefined)
      setNewMilestoneTitle("")
      setNewMilestoneDescription("")
      setIsAddingMilestone(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleMilestone = async (id: string, completed: boolean) => {
    setLoadingMilestoneId(id)
    try {
      await onToggleMilestone(id, completed)
    } finally {
      setLoadingMilestoneId(null)
    }
  }

  const handleSubmitForReview = async () => {
    setIsSubmitting(true)
    try {
      await onSubmitForReview()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkComplete = async () => {
    setIsSubmitting(true)
    try {
      await onMarkComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmitForReview = project.status === "in_progress" && completedCount > 0
  const isInReview = project.status === "review"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-accent" />
              Work Progress
            </CardTitle>
            <CardDescription>
              Track milestones and deliverables for this project
            </CardDescription>
          </div>
          <Badge
            variant={
              project.status === "completed"
                ? "default"
                : project.status === "review"
                ? "secondary"
                : "outline"
            }
          >
            {project.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {completedCount} of {milestones.length} milestones completed
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Deadline Alert */}
        {project.deadline && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg p-3",
              new Date(project.deadline) < new Date()
                ? "bg-destructive/10 text-destructive"
                : new Date(project.deadline) <
                  new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500"
                : "bg-muted"
            )}
          >
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {new Date(project.deadline) < new Date()
                ? "Overdue: "
                : "Deadline: "}
              {new Date(project.deadline).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Milestones List */}
        <div className="space-y-2">
          {milestones.length === 0 && !isAddingMilestone ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
              <Circle className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-1 font-medium">No milestones yet</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Add milestones to track your progress
              </p>
              <Button size="sm" onClick={() => setIsAddingMilestone(true)}>
                <Plus className="h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          ) : (
            <>
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                    milestone.is_completed && "bg-muted/50"
                  )}
                >
                  <button
                    onClick={() =>
                      handleToggleMilestone(milestone.id, !milestone.is_completed)
                    }
                    disabled={loadingMilestoneId === milestone.id}
                    className="mt-0.5 shrink-0"
                  >
                    {loadingMilestoneId === milestone.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : milestone.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "font-medium",
                        milestone.is_completed &&
                          "text-muted-foreground line-through"
                      )}
                    >
                      {milestone.title}
                    </p>
                    {milestone.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    )}
                    {milestone.completed_at && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Completed{" "}
                        {new Date(milestone.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onDeleteMilestone(milestone.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {/* Add Milestone Form */}
              {isAddingMilestone ? (
                <div className="space-y-3 rounded-lg border p-3">
                  <Input
                    placeholder="Milestone title"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    autoFocus
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newMilestoneDescription}
                    onChange={(e) => setNewMilestoneDescription(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingMilestone(false)
                        setNewMilestoneTitle("")
                        setNewMilestoneDescription("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddMilestone}
                      disabled={!newMilestoneTitle.trim() || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsAddingMilestone(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-3">
        {isInReview ? (
          <div className="flex w-full items-center gap-2 rounded-lg bg-yellow-500/10 p-3 text-yellow-700 dark:text-yellow-500">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm">
              Waiting for client review. They will approve or request changes.
            </span>
          </div>
        ) : canSubmitForReview ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Send className="h-4 w-4" />
                Submit for Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit for Review</DialogTitle>
                <DialogDescription>
                  This will notify the client that the work is ready for their review.
                  Make sure all deliverables are complete before submitting.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSubmitForReview} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Complete at least one milestone to submit for review
          </p>
        )}
      </CardFooter>
    </Card>
  )
}
