"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type {
  WebsiteBlock,
  Service,
  HeroContent,
  AboutContent,
  ServicesContent,
  ContactContent,
  CreativeContent,
  PriceType,
} from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { CreativeBlockEditor } from "@/components/builder/creative-block-editor"

interface BlockEditorProps {
  block: WebsiteBlock
  services: Service[]
  onBlockUpdate: (blockId: string, content: WebsiteBlock["content"]) => void
  onServiceAdd: () => void
  onServiceUpdate: (serviceId: string, updates: Partial<Service>) => void
  onServiceDelete: (serviceId: string) => void
}

export function BlockEditor({
  block,
  services,
  onBlockUpdate,
  onServiceAdd,
  onServiceUpdate,
  onServiceDelete,
}: BlockEditorProps) {
  const handleChange = (field: string, value: string | object) => {
    onBlockUpdate(block.id, {
      ...block.content,
      [field]: value,
    })
  }

  const renderHeroEditor = () => {
    const content = block.content as HeroContent
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Main title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea
            id="subtitle"
            value={content.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Short description about you"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta_text">CTA Button</Label>
          <Input
            id="cta_text"
            value={content.cta_text || ""}
            onChange={(e) => handleChange("cta_text", e.target.value)}
            placeholder="Contact now"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta_link">Link CTA</Label>
          <Input
            id="cta_link"
            value={content.cta_link || ""}
            onChange={(e) => handleChange("cta_link", e.target.value)}
            placeholder="#contact"
          />
        </div>
      </div>
    )
  }

  const renderAboutEditor = () => {
    const content = block.content as AboutContent
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Title</Label>
          <Input
            id="heading"
            value={content.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="About me"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Content</Label>
          <Textarea
            id="description"
            value={content.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Introduce yourself and your experience..."
            rows={6}
          />
        </div>
      </div>
    )
  }

  const renderServicesEditor = () => {
    const content = block.content as ServicesContent
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heading">Title</Label>
            <Input
              id="heading"
              value={content.heading || ""}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="Services"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="What I can help you with"
              rows={2}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Service list</Label>
            <Button variant="outline" size="sm" onClick={onServiceAdd} className="bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Add service
            </Button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <Input
                      value={service.title}
                      onChange={(e) => onServiceUpdate(service.id, { title: e.target.value })}
                      placeholder="Service name"
                    />
                    <Textarea
                      value={service.description || ""}
                      onChange={(e) => onServiceUpdate(service.id, { description: e.target.value })}
                      placeholder="Service description"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Select
                        value={service.price_type}
                        onValueChange={(value: PriceType) => onServiceUpdate(service.id, { price_type: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed price</SelectItem>
                          <SelectItem value="quote">Quote</SelectItem>
                        </SelectContent>
                      </Select>
                      {service.price_type === "fixed" && (
                        <Input
                          type="number"
                          value={service.price_amount || ""}
                          onChange={(e) =>
                            onServiceUpdate(service.id, {
                              price_amount: e.target.value ? Number.parseFloat(e.target.value) : null,
                            })
                          }
                          placeholder="Price (VND)"
                          className="flex-1"
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onServiceDelete(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {services.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No services yet. Click "Add service" to get started.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderContactEditor = () => {
    const content = block.content as ContactContent
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="heading">Title</Label>
          <Input
            id="heading"
            value={content.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="Contact"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={content.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            value={content.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="0912 345 678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={content.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Your address"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Social media</Label>
          <div className="space-y-2">
            <Input
              value={content.social_links?.facebook || ""}
              onChange={(e) => handleChange("social_links", { ...content.social_links, facebook: e.target.value })}
              placeholder="Facebook URL"
            />
            <Input
              value={content.social_links?.instagram || ""}
              onChange={(e) => handleChange("social_links", { ...content.social_links, instagram: e.target.value })}
              placeholder="Instagram URL"
            />
            <Input
              value={content.social_links?.linkedin || ""}
              onChange={(e) => handleChange("social_links", { ...content.social_links, linkedin: e.target.value })}
              placeholder="LinkedIn URL"
            />
          </div>
        </div>
      </div>
    )
  }

  const blockTitles: Record<string, string> = {
    hero: "Hero Section",
    about: "About",
    services: "Services",
    contact: "Contact",
    creative: "Creative Block",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {block.block_type === "creative"
            ? (block.content as CreativeContent).name || "Creative Block"
            : blockTitles[block.block_type]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {block.block_type === "hero" && renderHeroEditor()}
        {block.block_type === "about" && renderAboutEditor()}
        {block.block_type === "services" && renderServicesEditor()}
        {block.block_type === "contact" && renderContactEditor()}
        {block.block_type === "creative" && (
          <CreativeBlockEditor
            content={block.content as CreativeContent}
            onContentChange={(content) => onBlockUpdate(block.id, content)}
          />
        )}
      </CardContent>
    </Card>
  )
}
