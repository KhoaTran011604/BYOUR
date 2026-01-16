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
    description: "Thiết kế tối giản, tập trung vào nội dung. Phù hợp với freelancer và cá nhân.",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Phong cách báo chí, chữ lớn và hình ảnh nổi bật. Phù hợp với sáng tạo nội dung.",
  },
  {
    id: "grid",
    name: "Grid",
    description: "Bố cục lưới hiện đại, trình bày dịch vụ rõ ràng. Phù hợp với agency và studio.",
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
      setError("Vui lòng nhập handle cho website")
      return
    }

    if (!/^[a-z0-9-]+$/.test(handle)) {
      setError("Handle chỉ được chứa chữ thường, số và dấu gạch ngang")
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
            title: userName || "Chào mừng",
            subtitle: "Tôi là một chuyên gia trong lĩnh vực của mình",
            image_url: null,
            cta_text: "Liên hệ ngay",
            cta_link: "#contact",
          },
        },
        {
          website_id: website.id,
          block_type: "about",
          order_index: 1,
          content: {
            heading: "Về tôi",
            description:
              "Giới thiệu về bản thân và kinh nghiệm của bạn. Chia sẻ câu chuyện và giá trị mà bạn mang lại cho khách hàng.",
            image_url: null,
          },
        },
        {
          website_id: website.id,
          block_type: "services",
          order_index: 2,
          content: {
            heading: "Dịch vụ",
            description: "Những gì tôi có thể giúp bạn",
          },
        },
        {
          website_id: website.id,
          block_type: "contact",
          order_index: 3,
          content: {
            heading: "Liên hệ",
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
          setError("Handle này đã được sử dụng. Vui lòng chọn handle khác.")
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
              <h1 className="text-3xl font-bold">Chọn mẫu thiết kế</h1>
              <p className="mt-2 text-muted-foreground">Chọn một trong ba mẫu cao cấp cho website của bạn</p>
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
                Tiếp tục
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Đặt tên cho website</h1>
              <p className="mt-2 text-muted-foreground">Chọn handle để tạo URL cho website của bạn</p>
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
                    <p className="text-xs text-muted-foreground">Chỉ sử dụng chữ thường, số và dấu gạch ngang</p>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("template")} className="flex-1 bg-transparent">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại
                    </Button>
                    <Button onClick={handleCreateWebsite} disabled={isLoading} className="flex-1">
                      {isLoading ? "Đang tạo..." : "Tạo website"}
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
