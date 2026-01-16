"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Layout,
  Palette,
  Settings2,
  Briefcase,
  Eye,
  Globe,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { TemplateSelector } from "./template-selector"
import { SectionsCustomizer } from "./sections-customizer"
import { ServicesManager } from "./services-manager"
import { WebsitePreview } from "./website-preview"
import type { WebsiteTemplate, BlockType, Service } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

type WizardStep = "template" | "sections" | "services" | "preview" | "publish"

interface WebsiteWizardProps {
  userId: string
  userHandle: string
}

const steps: { id: WizardStep; label: string; icon: React.ElementType }[] = [
  { id: "template", label: "Choose Template", icon: Layout },
  { id: "sections", label: "Customize Sections", icon: Palette },
  { id: "services", label: "Add Services", icon: Briefcase },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "publish", label: "Publish", icon: Globe },
]

export function WebsiteWizard({ userId, userHandle }: WebsiteWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<WizardStep>("template")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Wizard state
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate>("minimal")
  const [enabledSections, setEnabledSections] = useState<BlockType[]>([
    "hero",
    "about",
    "services",
    "contact",
  ])
  const [sectionContent, setSectionContent] = useState<Record<string, object>>({})
  const [services, setServices] = useState<Partial<Service>[]>([])

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

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

  const handlePublish = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create website
      const { data: website, error: websiteError } = await supabase
        .from("websites")
        .insert({
          user_id: userId,
          handle: userHandle,
          template: selectedTemplate,
          is_published: true,
        })
        .select()
        .single()

      if (websiteError) throw websiteError

      // Create website blocks for enabled sections
      const blocks = enabledSections.map((blockType, index) => ({
        website_id: website.id,
        block_type: blockType,
        order_index: index,
        content: sectionContent[blockType] || getDefaultContent(blockType),
        is_visible: true,
      }))

      const { error: blocksError } = await supabase
        .from("website_blocks")
        .insert(blocks)

      if (blocksError) throw blocksError

      // Create services
      if (services.length > 0) {
        const servicesData = services.map((service, index) => ({
          website_id: website.id,
          title: service.title || "",
          description: service.description || null,
          price_type: service.price_type || "quote",
          price_amount: service.price_amount || null,
          currency: service.currency || "EUR",
          order_index: index,
          is_active: true,
        }))

        const { error: servicesError } = await supabase
          .from("services")
          .insert(servicesData)

        if (servicesError) throw servicesError
      }

      // Redirect to dashboard
      router.push("/boss/dashboard?published=true")
    } catch (err) {
      console.error("Publish error:", err)
      setError("Failed to publish website. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Your HQ Website</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Step Indicators */}
        <div className="mt-4 hidden gap-2 sm:flex">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = index < currentStepIndex

            return (
              <div
                key={step.id}
                className={cn(
                  "flex flex-1 items-center gap-2 rounded-lg border p-2 transition-colors",
                  isActive && "border-accent bg-accent/5",
                  isCompleted && "border-green-500/50 bg-green-500/5"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    isActive && "bg-accent text-accent-foreground",
                    isCompleted && "bg-green-500 text-white",
                    !isActive && !isCompleted && "bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {steps.find((s) => s.id === currentStep)?.label}
          </CardTitle>
          <CardDescription>
            {currentStep === "template" &&
              "Choose a template that best represents your professional style"}
            {currentStep === "sections" &&
              "Enable and customize the sections for your website"}
            {currentStep === "services" &&
              "Add the services you offer to potential clients"}
            {currentStep === "preview" &&
              "Review how your website will look to visitors"}
            {currentStep === "publish" &&
              "Your website is ready! Publish it to make it live"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {currentStep === "template" && (
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          )}

          {currentStep === "sections" && (
            <SectionsCustomizer
              enabledSections={enabledSections}
              onSectionsChange={setEnabledSections}
              sectionContent={sectionContent}
              onContentChange={setSectionContent}
            />
          )}

          {currentStep === "services" && (
            <ServicesManager
              services={services}
              onServicesChange={setServices}
            />
          )}

          {currentStep === "preview" && (
            <WebsitePreview
              template={selectedTemplate}
              sections={enabledSections}
              content={sectionContent}
              services={services}
              handle={userHandle}
            />
          )}

          {currentStep === "publish" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-6 rounded-full bg-green-500/10 p-6">
                <Globe className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Ready to Go Live!</h3>
              <p className="mb-4 max-w-md text-muted-foreground">
                Your website will be published at{" "}
                <span className="font-medium text-foreground">
                  byour.app/{userHandle}
                </span>
              </p>
              <ul className="mb-6 space-y-2 text-left text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Template: <span className="font-medium capitalize">{selectedTemplate}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Sections: {enabledSections.length} enabled
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Services: {services.length} added
                </li>
              </ul>
              {error && (
                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0 || isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === "publish" ? (
            <Button onClick={handlePublish} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish Website
                </>
              )}
            </Button>
          ) : (
            <Button onClick={goToNextStep}>
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

function getDefaultContent(blockType: BlockType): object {
  switch (blockType) {
    case "hero":
      return {
        title: "Welcome to my portfolio",
        subtitle: "Professional services tailored to your needs",
        image_url: null,
        cta_text: "Get in touch",
        cta_link: "#contact",
      }
    case "about":
      return {
        heading: "About Me",
        description: "Tell your story here...",
        image_url: null,
      }
    case "services":
      return {
        heading: "Services",
        description: "What I offer",
      }
    case "contact":
      return {
        heading: "Get in Touch",
        email: "",
        phone: null,
        address: null,
        social_links: {},
      }
    default:
      return {}
  }
}
