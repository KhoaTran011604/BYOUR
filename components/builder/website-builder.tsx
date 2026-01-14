"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { Website, WebsiteBlock, Service, WebsiteTemplate } from "@/lib/types"
import { ArrowLeft, Eye, Globe, Settings2, Smartphone, Monitor } from "lucide-react"
import { BlockEditor } from "@/components/builder/block-editor"
import { BlockList } from "@/components/builder/block-list"
import { WebsitePreview } from "@/components/builder/website-preview"
import { TemplateSettings } from "@/components/builder/template-settings"

interface WebsiteBuilderProps {
  website: Website
  initialBlocks: WebsiteBlock[]
  initialServices: Service[]
}

type ViewMode = "edit" | "preview"
type DeviceView = "desktop" | "mobile"

export function WebsiteBuilder({ website, initialBlocks, initialServices }: WebsiteBuilderProps) {
  const router = useRouter()
  const [blocks, setBlocks] = useState<WebsiteBlock[]>(initialBlocks)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(blocks[0]?.id || null)
  const [viewMode, setViewMode] = useState<ViewMode>("edit")
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop")
  const [template, setTemplate] = useState<WebsiteTemplate>(website.template)
  const [isPublished, setIsPublished] = useState(website.is_published)
  const [isSaving, setIsSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId)

  const handleBlockUpdate = useCallback(async (blockId: string, content: WebsiteBlock["content"]) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)))

    const supabase = createClient()
    await supabase.from("website_blocks").update({ content }).eq("id", blockId)
  }, [])

  const handleBlockReorder = useCallback(
    async (newBlocks: WebsiteBlock[]) => {
      setBlocks(newBlocks)

      const supabase = createClient()
      const updates = newBlocks.map((block, index) => ({
        id: block.id,
        website_id: website.id,
        block_type: block.block_type,
        order_index: index,
        content: block.content,
        is_visible: block.is_visible,
      }))

      for (const update of updates) {
        await supabase.from("website_blocks").update({ order_index: update.order_index }).eq("id", update.id)
      }
    },
    [website.id],
  )

  const handleBlockVisibilityToggle = useCallback(
    async (blockId: string) => {
      setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, is_visible: !b.is_visible } : b)))

      const supabase = createClient()
      const block = blocks.find((b) => b.id === blockId)
      if (block) {
        await supabase.from("website_blocks").update({ is_visible: !block.is_visible }).eq("id", blockId)
      }
    },
    [blocks],
  )

  const handleServiceAdd = useCallback(async () => {
    const supabase = createClient()
    const newService = {
      website_id: website.id,
      title: "Dịch vụ mới",
      description: "Mô tả dịch vụ của bạn",
      price_type: "fixed" as const,
      price_amount: null,
      order_index: services.length,
    }

    const { data, error } = await supabase.from("services").insert(newService).select().single()

    if (!error && data) {
      setServices((prev) => [...prev, data])
    }
  }, [website.id, services.length])

  const handleServiceUpdate = useCallback(async (serviceId: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === serviceId ? { ...s, ...updates } : s)))

    const supabase = createClient()
    await supabase.from("services").update(updates).eq("id", serviceId)
  }, [])

  const handleServiceDelete = useCallback(async (serviceId: string) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId))

    const supabase = createClient()
    await supabase.from("services").delete().eq("id", serviceId)
  }, [])

  const handleTemplateChange = useCallback(
    async (newTemplate: WebsiteTemplate) => {
      setTemplate(newTemplate)

      const supabase = createClient()
      await supabase.from("websites").update({ template: newTemplate }).eq("id", website.id)
    },
    [website.id],
  )

  const handlePublish = async () => {
    setIsSaving(true)
    const supabase = createClient()

    await supabase.from("websites").update({ is_published: !isPublished }).eq("id", website.id)

    setIsPublished(!isPublished)
    setIsSaving(false)
  }

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm font-medium">byour.co/{website.handle}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device View Toggle */}
          <div className="hidden items-center gap-1 rounded-md border border-border p-1 sm:flex">
            <Button
              variant={deviceView === "desktop" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setDeviceView("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={deviceView === "mobile" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setDeviceView("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-md border border-border p-1">
            <Button
              variant={viewMode === "edit" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3"
              onClick={() => setViewMode("edit")}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3"
              onClick={() => setViewMode("preview")}
            >
              <Eye className="mr-1 h-4 w-4" />
              Xem trước
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 className="h-4 w-4" />
          </Button>

          <Button variant={isPublished ? "outline" : "default"} size="sm" onClick={handlePublish} disabled={isSaving}>
            <Globe className="mr-2 h-4 w-4" />
            {isSaving ? "Đang lưu..." : isPublished ? "Gỡ xuất bản" : "Xuất bản"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        {showSettings && (
          <TemplateSettings
            template={template}
            onTemplateChange={handleTemplateChange}
            onClose={() => setShowSettings(false)}
          />
        )}

        {viewMode === "edit" ? (
          <>
            {/* Block List Sidebar */}
            <div className="w-64 flex-shrink-0 border-r border-border bg-background overflow-y-auto">
              <BlockList
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onReorderBlocks={handleBlockReorder}
                onToggleVisibility={handleBlockVisibilityToggle}
              />
            </div>

            {/* Editor Panel */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedBlock && (
                <BlockEditor
                  block={selectedBlock}
                  services={services}
                  onBlockUpdate={handleBlockUpdate}
                  onServiceAdd={handleServiceAdd}
                  onServiceUpdate={handleServiceUpdate}
                  onServiceDelete={handleServiceDelete}
                />
              )}
            </div>

            {/* Live Preview */}
            <div className="hidden w-[400px] flex-shrink-0 border-l border-border bg-muted/50 overflow-y-auto lg:block">
              <div className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">Preview</div>
                <div className="rounded-lg border border-border bg-background overflow-hidden">
                  <WebsitePreview blocks={blocks} services={services} template={template} scale={0.5} />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Full Preview Mode */
          <div className="flex-1 flex items-center justify-center bg-muted/50 p-8 overflow-auto">
            <div
              className={`bg-background rounded-lg border border-border shadow-lg overflow-hidden transition-all ${
                deviceView === "mobile" ? "w-[375px]" : "w-full max-w-5xl"
              }`}
            >
              <WebsitePreview blocks={blocks} services={services} template={template} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
