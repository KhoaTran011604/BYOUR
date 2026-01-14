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
  PriceType,
} from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"

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
          <Label htmlFor="title">Tiêu đề</Label>
          <Input
            id="title"
            value={content.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Tiêu đề chính"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle">Phụ đề</Label>
          <Textarea
            id="subtitle"
            value={content.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Mô tả ngắn về bạn"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cta_text">Nút CTA</Label>
          <Input
            id="cta_text"
            value={content.cta_text || ""}
            onChange={(e) => handleChange("cta_text", e.target.value)}
            placeholder="Liên hệ ngay"
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
          <Label htmlFor="heading">Tiêu đề</Label>
          <Input
            id="heading"
            value={content.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="Về tôi"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Nội dung</Label>
          <Textarea
            id="description"
            value={content.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Giới thiệu về bản thân và kinh nghiệm của bạn..."
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
            <Label htmlFor="heading">Tiêu đề</Label>
            <Input
              id="heading"
              value={content.heading || ""}
              onChange={(e) => handleChange("heading", e.target.value)}
              placeholder="Dịch vụ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Những gì tôi có thể giúp bạn"
              rows={2}
            />
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Danh sách dịch vụ</Label>
            <Button variant="outline" size="sm" onClick={onServiceAdd} className="bg-transparent">
              <Plus className="mr-2 h-4 w-4" />
              Thêm dịch vụ
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
                      placeholder="Tên dịch vụ"
                    />
                    <Textarea
                      value={service.description || ""}
                      onChange={(e) => onServiceUpdate(service.id, { description: e.target.value })}
                      placeholder="Mô tả dịch vụ"
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
                          <SelectItem value="fixed">Giá cố định</SelectItem>
                          <SelectItem value="quote">Báo giá</SelectItem>
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
                          placeholder="Giá (VND)"
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
                Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.
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
          <Label htmlFor="heading">Tiêu đề</Label>
          <Input
            id="heading"
            value={content.heading || ""}
            onChange={(e) => handleChange("heading", e.target.value)}
            placeholder="Liên hệ"
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
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={content.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="0912 345 678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Textarea
            id="address"
            value={content.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Địa chỉ của bạn"
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Mạng xã hội</Label>
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

  const blockTitles = {
    hero: "Hero Section",
    about: "Giới thiệu",
    services: "Dịch vụ",
    contact: "Liên hệ",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{blockTitles[block.block_type]}</CardTitle>
      </CardHeader>
      <CardContent>
        {block.block_type === "hero" && renderHeroEditor()}
        {block.block_type === "about" && renderAboutEditor()}
        {block.block_type === "services" && renderServicesEditor()}
        {block.block_type === "contact" && renderContactEditor()}
      </CardContent>
    </Card>
  )
}
