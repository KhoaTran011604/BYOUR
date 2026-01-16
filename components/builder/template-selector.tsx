"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { WebsiteTemplate } from "@/lib/types"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { TemplatePreview } from "./template-previews"

const templates: { id: WebsiteTemplate; name: string; description: string }[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design, content-focused. Perfect for freelancers and individuals.",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Editorial style, bold typography and striking images. Perfect for content creators.",
  },
  {
    id: "grid",
    name: "Grid",
    description: "Modern grid layout, clear service presentation. Perfect for agencies and studios.",
  },
]

interface TemplateSelectorProps {
  userId: string
  userHandle: string | null
  userName: string | null
}

export function TemplateSelector({ userId, userHandle, userName }: TemplateSelectorProps) {
  const router = useRouter()
  const [step, setStep] = useState<"template" | "handle">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate>("minimal")
  const [handle, setHandle] = useState(userHandle || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateWebsite = async () => {
    if (!handle) {
      setError("Please enter a handle for your website")
      return
    }

    if (!/^[a-z0-9-]+$/.test(handle)) {
      setError("Handle can only contain lowercase letters, numbers and hyphens")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Create website
      const { data: website, error: websiteError } = await supabase
        .from("websites")
        .insert({
          user_id: userId,
          handle,
          template: selectedTemplate,
        })
        .select()
        .single()

      if (websiteError) throw websiteError

      // Create default blocks
      const defaultBlocks = [
        {
          website_id: website.id,
          block_type: "hero",
          order_index: 0,
          content: {
            title: userName || "Welcome",
            subtitle: "I am an expert in my field",
            image_url: null,
            cta_text: "Contact now",
            cta_link: "#contact",
          },
        },
        {
          website_id: website.id,
          block_type: "about",
          order_index: 1,
          content: {
            heading: "About me",
            description:
              "Introduce yourself and your experience. Share your story and the value you bring to customers.",
            image_url: null,
          },
        },
        {
          website_id: website.id,
          block_type: "services",
          order_index: 2,
          content: {
            heading: "Services",
            description: "What I can help you with",
          },
        },
        {
          website_id: website.id,
          block_type: "contact",
          order_index: 3,
          content: {
            heading: "Contact",
            email: null,
            phone: null,
            address: null,
            social_links: {},
          },
        },
      ]

      const { error: blocksError } = await supabase.from("website_blocks").insert(defaultBlocks)

      if (blocksError) throw blocksError

      // Update user profile handle if not set
      if (!userHandle) {
        await supabase.from("profiles").update({ handle }).eq("id", userId)
      }

      router.push(`/builder/${website.id}`)
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("duplicate") || err.message.includes("unique")) {
          setError("This handle is already taken. Please choose another one.")
        } else {
          setError(err.message)
        }
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/boss" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xl font-bold tracking-tight">TEST-002</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {step === "template" ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Choose a template</h1>
              <p className="mt-2 text-muted-foreground">Select one of three premium templates for your website</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:border-accent/50 ${
                    selectedTemplate === template.id ? "border-accent ring-2 ring-accent/20" : ""
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {selectedTemplate === template.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TemplatePreview
                      template={template.id}
                      isSelected={selectedTemplate === template.id}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={() => setStep("handle")}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Name your website</h1>
              <p className="mt-2 text-muted-foreground">Choose a handle to create URL for your website</p>
            </div>

            <Card className="mx-auto max-w-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="handle">Handle</Label>
                    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                      <span className="text-sm text-muted-foreground">byour.co/</span>
                      <Input
                        id="handle"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="your-handle"
                        className="border-0 p-0 focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Only use lowercase letters, numbers and hyphens</p>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("template")} className="flex-1 bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleCreateWebsite} disabled={isLoading} className="flex-1">
                      {isLoading ? "Creating..." : "Create website"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
