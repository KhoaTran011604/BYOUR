"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { WebsiteTemplate } from "@/lib/types"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { TemplatePreview } from "./template-previews"

interface TemplateSelectorProps {
  userId: string
  userHandle: string | null
  userName: string | null
}

export function TemplateSelector({ userId, userHandle, userName }: TemplateSelectorProps) {
  const router = useRouter()
  const t = useTranslations("builder")
  const tCommon = useTranslations("common")
  const [step, setStep] = useState<"template" | "handle">("template")
  const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplate>("minimal")
  const [handle, setHandle] = useState(userHandle || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const templates: { id: WebsiteTemplate; nameKey: string; descKey: string }[] = [
    { id: "minimal", nameKey: "templates.minimal", descKey: "templates.minimalDesc" },
    { id: "editorial", nameKey: "templates.editorial", descKey: "templates.editorialDesc" },
    { id: "grid", nameKey: "templates.grid", descKey: "templates.gridDesc" },
  ]

  const handleCreateWebsite = async () => {
    if (!handle) {
      setError(t("templateSelector.handleRequired"))
      return
    }

    if (!/^[a-z0-9-]+$/.test(handle)) {
      setError(t("templateSelector.handleInvalid"))
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
            title: userName || t("defaults.welcome"),
            subtitle: t("defaults.iAmExpert"),
            image_url: null,
            cta_text: t("defaults.contactNow"),
            cta_link: "#contact",
          },
        },
        {
          website_id: website.id,
          block_type: "about",
          order_index: 1,
          content: {
            heading: t("defaults.aboutMe"),
            description: t("defaults.aboutDescription"),
            image_url: null,
          },
        },
        {
          website_id: website.id,
          block_type: "services",
          order_index: 2,
          content: {
            heading: t("defaults.servicesHeading"),
            description: t("defaults.servicesDescription"),
          },
        },
        {
          website_id: website.id,
          block_type: "contact",
          order_index: 3,
          content: {
            heading: t("defaults.contactHeading"),
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
          setError(t("templateSelector.handleTaken"))
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
              <h1 className="text-3xl font-bold">{t("templateSelector.chooseTemplate")}</h1>
              <p className="mt-2 text-muted-foreground">{t("templateSelector.selectPremium")}</p>
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
                      <CardTitle className="text-lg">{t(template.nameKey)}</CardTitle>
                      {selectedTemplate === template.id && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardDescription>{t(template.descKey)}</CardDescription>
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
                {t("templateSelector.continue")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">{t("templateSelector.nameWebsite")}</h1>
              <p className="mt-2 text-muted-foreground">{t("templateSelector.chooseHandle")}</p>
            </div>

            <Card className="mx-auto max-w-md">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="handle">{t("templateSelector.handle")}</Label>
                    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                      <span className="text-sm text-muted-foreground">byour.co/</span>
                      <Input
                        id="handle"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder={t("templateSelector.handlePlaceholder")}
                        className="border-0 p-0 focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{t("templateSelector.handleHelp")}</p>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("template")} className="flex-1 bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {tCommon("back")}
                    </Button>
                    <Button onClick={handleCreateWebsite} disabled={isLoading} className="flex-1">
                      {isLoading ? t("templateSelector.creating") : t("templateSelector.createWebsite")}
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
