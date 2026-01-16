"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  DollarSign,
  Tag,
  Eye,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { ProjectDetailsStep } from "./wizard-steps/project-details-step"
import { BudgetTimelineStep } from "./wizard-steps/budget-timeline-step"
import { TagsSkillsStep } from "./wizard-steps/tags-skills-step"
import { ProjectPreviewStep } from "./wizard-steps/project-preview-step"
import type { HQProjectWizardStep, HQProjectDraft } from "@/lib/types"

interface ProjectWizardProps {
  hqId: string
  businessProfileId: string | null
}

const steps: { id: HQProjectWizardStep; label: string; icon: typeof FileText }[] = [
  { id: "details", label: "Project Details", icon: FileText },
  { id: "budget", label: "Budget & Timeline", icon: DollarSign },
  { id: "tags", label: "Tags & Skills", icon: Tag },
  { id: "preview", label: "Preview", icon: Eye },
]

const initialDraft: HQProjectDraft = {
  title: "",
  description: "",
  requirements: "",
  deliverables: [],
  budget_min: 0,
  budget_max: 0,
  currency: "EUR",
  timeline_start: null,
  timeline_end: null,
  deadline: null,
  tags: [],
  skills_required: [],
}

export function ProjectWizard({ hqId, businessProfileId }: ProjectWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<HQProjectWizardStep>("details")
  const [draft, setDraft] = useState<HQProjectDraft>(initialDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case "details":
        return draft.title.trim().length > 0 && draft.description.trim().length > 0
      case "budget":
        return draft.budget_min > 0 && draft.budget_max >= draft.budget_min
      case "tags":
        return draft.skills_required.length > 0
      case "preview":
        return true
      default:
        return false
    }
  }

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data: project, error: insertError } = await supabase
        .from("hq_projects")
        .insert({
          hq_id: hqId,
          business_profile_id: businessProfileId,
          title: draft.title.trim(),
          description: draft.description.trim(),
          requirements: draft.requirements.trim() || null,
          deliverables: draft.deliverables,
          budget_min: draft.budget_min,
          budget_max: draft.budget_max,
          currency: draft.currency,
          timeline_start: draft.timeline_start,
          timeline_end: draft.timeline_end,
          deadline: draft.deadline,
          tags: draft.tags,
          skills_required: draft.skills_required,
          status: "open",
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Redirect to the new project page
      router.push(`/hq/projects/${project.id}`)
    } catch (err) {
      console.error("Create project error:", err)
      setError("Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground">
            Fill in the details to post your project
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex
            const isCurrent = step.id === currentStep
            const Icon = step.icon
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (index <= currentStepIndex) {
                    setCurrentStep(step.id)
                  }
                }}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  isCurrent
                    ? "text-primary font-medium"
                    : isCompleted
                    ? "text-green-600 cursor-pointer"
                    : "text-muted-foreground"
                }`}
                disabled={index > currentStepIndex}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].label}</CardTitle>
          <CardDescription>
            {currentStep === "details" && "Describe your project in detail"}
            {currentStep === "budget" && "Set your budget and timeline"}
            {currentStep === "tags" && "Add tags and required skills"}
            {currentStep === "preview" && "Review your project before posting"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === "details" && (
            <ProjectDetailsStep draft={draft} onChange={setDraft} />
          )}
          {currentStep === "budget" && (
            <BudgetTimelineStep draft={draft} onChange={setDraft} />
          )}
          {currentStep === "tags" && (
            <TagsSkillsStep draft={draft} onChange={setDraft} />
          )}
          {currentStep === "preview" && (
            <ProjectPreviewStep draft={draft} />
          )}
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep === "preview" ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Create Project
              </>
            )}
          </Button>
        ) : (
          <Button onClick={goToNextStep} disabled={!canProceed()}>
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
