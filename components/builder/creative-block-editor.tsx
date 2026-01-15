"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { CreativeContent, CreativeItem, CreativeItemType } from "@/lib/types"
import {
  Plus,
  Trash2,
  GripVertical,
  Image,
  Link,
  Minus,
  Space,
  MousePointerClick,
  Type,
} from "lucide-react"
import type React from "react"

interface CreativeBlockEditorProps {
  content: CreativeContent
  onContentChange: (content: CreativeContent) => void
}

const itemTypeLabels: Record<CreativeItemType, string> = {
  image: "Hình ảnh",
  link: "Liên kết",
  divider: "Đường kẻ",
  spacer: "Khoảng cách",
  button: "Nút bấm",
  text: "Văn bản",
}

const itemTypeIcons: Record<CreativeItemType, React.ElementType> = {
  image: Image,
  link: Link,
  divider: Minus,
  spacer: Space,
  button: MousePointerClick,
  text: Type,
}

export function CreativeBlockEditor({ content, onContentChange }: CreativeBlockEditorProps) {
  const handleNameChange = (name: string) => {
    onContentChange({ ...content, name })
  }

  const handleAddItem = (type: CreativeItemType) => {
    const newItem: CreativeItem = {
      id: crypto.randomUUID(),
      type,
      ...(type === "image" && { image_url: "", image_alt: "" }),
      ...(type === "link" && { link_text: "Liên kết mới", link_url: "" }),
      ...(type === "button" && { button_text: "Nút mới", button_url: "", button_style: "primary" as const }),
      ...(type === "text" && { text_content: "" }),
      ...(type === "spacer" && { spacer_size: "medium" as const }),
    }
    onContentChange({ ...content, items: [...content.items, newItem] })
  }

  const handleUpdateItem = (itemId: string, updates: Partial<CreativeItem>) => {
    onContentChange({
      ...content,
      items: content.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    })
  }

  const handleDeleteItem = (itemId: string) => {
    onContentChange({
      ...content,
      items: content.items.filter((item) => item.id !== itemId),
    })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
    if (dragIndex === dropIndex) return

    const newItems = [...content.items]
    const [removed] = newItems.splice(dragIndex, 1)
    newItems.splice(dropIndex, 0, removed)
    onContentChange({ ...content, items: newItems })
  }

  const renderItemEditor = (item: CreativeItem) => {
    switch (item.type) {
      case "image":
        return (
          <div className="space-y-2">
            <Input
              value={item.image_url || ""}
              onChange={(e) => handleUpdateItem(item.id, { image_url: e.target.value })}
              placeholder="URL hình ảnh"
            />
            <Input
              value={item.image_alt || ""}
              onChange={(e) => handleUpdateItem(item.id, { image_alt: e.target.value })}
              placeholder="Mô tả hình ảnh (alt)"
            />
          </div>
        )

      case "link":
        return (
          <div className="space-y-2">
            <Input
              value={item.link_text || ""}
              onChange={(e) => handleUpdateItem(item.id, { link_text: e.target.value })}
              placeholder="Văn bản hiển thị"
            />
            <Input
              value={item.link_url || ""}
              onChange={(e) => handleUpdateItem(item.id, { link_url: e.target.value })}
              placeholder="URL liên kết"
            />
          </div>
        )

      case "button":
        return (
          <div className="space-y-2">
            <Input
              value={item.button_text || ""}
              onChange={(e) => handleUpdateItem(item.id, { button_text: e.target.value })}
              placeholder="Văn bản nút"
            />
            <Input
              value={item.button_url || ""}
              onChange={(e) => handleUpdateItem(item.id, { button_url: e.target.value })}
              placeholder="URL khi click"
            />
            <Select
              value={item.button_style || "primary"}
              onValueChange={(value: "primary" | "secondary" | "outline") =>
                handleUpdateItem(item.id, { button_style: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )

      case "text":
        return (
          <Textarea
            value={item.text_content || ""}
            onChange={(e) => handleUpdateItem(item.id, { text_content: e.target.value })}
            placeholder="Nhập nội dung văn bản..."
            rows={3}
          />
        )

      case "spacer":
        return (
          <Select
            value={item.spacer_size || "medium"}
            onValueChange={(value: "small" | "medium" | "large") =>
              handleUpdateItem(item.id, { spacer_size: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Nhỏ (8px)</SelectItem>
              <SelectItem value="medium">Vừa (16px)</SelectItem>
              <SelectItem value="large">Lớn (32px)</SelectItem>
            </SelectContent>
          </Select>
        )

      case "divider":
        return <p className="text-xs text-muted-foreground">Đường kẻ ngang phân cách nội dung</p>

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Block Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tên khối</Label>
        <Input
          id="name"
          value={content.name || ""}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="VD: Gallery, Links, Social..."
        />
      </div>

      {/* Add Item Buttons */}
      <div className="space-y-2">
        <Label>Thêm nội dung</Label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(itemTypeLabels) as CreativeItemType[]).map((type) => {
            const Icon = itemTypeIcons[type]
            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => handleAddItem(type)}
                className="bg-transparent"
              >
                <Icon className="mr-1 h-3 w-3" />
                {itemTypeLabels[type]}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        <Label>Danh sách nội dung</Label>
        <div className="space-y-2">
          {content.items.map((item, index) => {
            const Icon = itemTypeIcons[item.type]
            return (
              <Card
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{itemTypeLabels[item.type]}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {renderItemEditor(item)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {content.items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có nội dung nào. Nhấn các nút phía trên để thêm.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
